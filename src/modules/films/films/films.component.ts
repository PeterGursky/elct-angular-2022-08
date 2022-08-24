import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { AfterViewInit, Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map, mergeAll, Observable, of, switchMap, tap } from 'rxjs';
import { Film } from 'src/entities/film';
import { UsersService } from 'src/services/users.service';
import { FilmsService } from '../films.service';

@Component({
  selector: 'app-films',
  templateUrl: './films.component.html',
  styleUrls: ['./films.component.css']
})
export class FilmsComponent implements OnInit, AfterViewInit {

  columnsToDisplay: string[] = [];
  filmsDataSource: FilmsDataSource;
  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;
  @ViewChild(MatSort) sort: MatSort | null = null;
  filterEvents$ = new EventEmitter<string>();

  constructor(private filmsSerice: FilmsService, private usersService: UsersService) {
    this.filmsDataSource = new FilmsDataSource(filmsSerice);
  }

  ngOnInit(): void {
    this.usersService.isLoggedInAsync().subscribe(loggedIn => {
      if (loggedIn)
        this.columnsToDisplay = ['id', 'nazov', 'slovenskyNazov','rok', 'afi1998', 'afi2007'];
      else 
        this.columnsToDisplay = ['id', 'nazov', 'rok'];
    });
  }

  ngAfterViewInit(): void {
    this.filmsDataSource.insertObservables(this.paginator, this.sort, this.filterEvents$.asObservable());
  }

  onFilter(event: any) {
    const text = event.target.value.trim().toLowerCase();
    this.filterEvents$.emit(text);
  }
}

class FilmsDataSource implements DataSource<Film> {
  futureObservables = new EventEmitter<Observable<any>>();
  paginator: MatPaginator | null = null;
  orderBy?: string = undefined;
  descending: boolean | undefined = undefined;
  indexFrom = 0;
  indexTo = 10;
  search: string | undefined = undefined;

  constructor(private filmsSerice: FilmsService) {}
  
  goToFirstPage() {
    this.indexFrom = 0;
    this.indexTo = this.paginator?.pageSize || 10;
    this.paginator?.firstPage();
  }

  insertObservables(paginator: MatPaginator | null, sort: MatSort | null, filter: Observable<string>) {
    this.indexTo = paginator?.pageSize || 10;
    this.futureObservables.emit(of("first data event"));
    this.paginator = paginator;

    this.futureObservables.emit(filter.pipe(
      tap(event => {
        this.search = event || undefined;
        this.goToFirstPage();
      })
    ));

    if (paginator && sort) {
      this.futureObservables.emit(paginator.page.pipe(
        tap(event => {
          this.indexFrom = event.pageIndex * event.pageSize;
          this.indexTo = this.indexFrom + event.pageSize;
        })
      ));
      this.futureObservables.emit(sort.sortChange.pipe(
        tap(event => {
          if (event.direction === '') {
            this.orderBy = undefined;
            this.descending = undefined;
            this.goToFirstPage();
            return;
          }
          this.orderBy = event.active;
          if (event.active === 'afi1998') {
            this.orderBy = 'poradieVRebricku.AFI 1998';
          }
          if (event.active === 'afi2007') {
            this.orderBy = 'poradieVRebricku.AFI 2007';
          }
          this.descending = event.direction === 'desc';
          this.goToFirstPage();
        })
      ))
    }
  }

  connect(collectionViewer: CollectionViewer): Observable<readonly Film[]> {
    return this.futureObservables.pipe(
      mergeAll(),
      tap(event => console.log("Event", event)),
      switchMap(event => {
        return this.filmsSerice.getFilms(this.orderBy, this.descending, this.indexFrom,
                                         this.indexTo, this.search).pipe(
          map(filmsResponse => {
            if (this.paginator) {
              this.paginator.length = filmsResponse.totalCount;
            }
            return  filmsResponse.items;
          })
        );
      })
    ); 
    
    
    
  }
  disconnect(collectionViewer: CollectionViewer): void {
  }
}
import { Component, OnInit } from '@angular/core';
import { Film } from 'src/entities/film';
import { UsersService } from 'src/services/users.service';
import { FilmsService } from '../films.service';

@Component({
  selector: 'app-films',
  templateUrl: './films.component.html',
  styleUrls: ['./films.component.css']
})
export class FilmsComponent implements OnInit {

  films: Film[] = [];
  columnsToDisplay: string[] = [];

  constructor(private filmsSerice: FilmsService, private usersService: UsersService) { }

  ngOnInit(): void {
    this.usersService.isLoggedInAsync().subscribe(loggedIn => {
      if (loggedIn)
        this.columnsToDisplay = ['id', 'nazov', 'slovenskyNazov','rok', 'afi1998', 'afi2007'];
      else 
        this.columnsToDisplay = ['id', 'nazov', 'rok'];
    });
    this.filmsSerice.getFilms().subscribe(filmsResponse => {
      this.films = filmsResponse.items;
    });
  }

  onFilter(event: any) {

  }
}

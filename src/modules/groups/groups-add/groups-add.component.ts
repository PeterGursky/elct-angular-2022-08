import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ConfirmDialogComponent, ConfirmDialogData } from 'src/app/confirm-dialog/confirm-dialog.component';
import { CanDeactivateComponent } from 'src/guards/can-deactivate.guard';

@Component({
  selector: 'app-groups-add',
  templateUrl: './groups-add.component.html',
  styleUrls: ['./groups-add.component.css']
})
export class GroupsAddComponent implements OnInit, CanDeactivateComponent {
  groupName = '';

  constructor(private matDialog: MatDialog) { }

  canDeactivate(): boolean | Observable<boolean> {
    if (this.groupName) {
      const dialogData = new ConfirmDialogData("Leaving page?", "Your form is filled and not submitted. Do you really want to leave the page?");
      const dialogRef = this.matDialog.open(ConfirmDialogComponent, {
        width: '400px',
        data: dialogData
      });
      return dialogRef.afterClosed();
    } else { // no data in form
      return true;
    }
    
  };

  ngOnInit(): void {
  }

  onSubmit() {
    // TODO add group
  }
}

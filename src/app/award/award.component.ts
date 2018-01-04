import { Component, OnInit, Input } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';

import { DataService } from '../data.service'
import { DeleteConfirmComponent } from '../delete-confirm/delete-confirm.component'
import { fadeInAnimation } from '../animations/fade-in.animation';


@Component({
  selector: 'app-award',
  templateUrl: './award.component.html',
  styleUrls: ['./award.component.css'],
  animations: [fadeInAnimation],
})
export class AwardComponent implements OnInit {

  errorMessage: string;
  successMessage: string;
  awards: any[];

  constructor (private dataService: DataService, public dialog: MatDialog) {}

  getAwards() {
    this.dataService.getRecords('actors/1/awards')
      .subscribe(
        awards => this.awards = awards,
        error =>  this.errorMessage = <any>error);
  }

  deleteAward(id: number) {

    const dialogRef = this.dialog.open(DeleteConfirmComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dataService.deleteRecord('awards', id)
          .subscribe(
            award => {
              this.successMessage = 'Record(s) deleted successfully';
              this.getAwards();
            },
            error =>  this.errorMessage = <any>error);
      }
    });
  }

  ngOnInit() {
    this.getAwards();
  }

}

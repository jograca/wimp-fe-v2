import 'rxjs/add/operator/switchMap';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { NgForm } from '@angular/forms';

import { DataService } from '../data.service'
import { fadeInAnimation } from '../animations/fade-in.animation';

@Component({
  selector: 'app-award-form',
  templateUrl: './award-form.component.html',
  styleUrls: ['./award-form.component.css'],
  animations: [fadeInAnimation]
})
export class AwardFormComponent implements OnInit {

  awardForm: NgForm;
  @ViewChild('awardForm')
  currentForm: NgForm;

  successMessage: string;
  errorMessage: string;

  actorId;

  award: object;

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private location: Location
  ) {}


  getRecordForEdit() {
    this.route.params
      .switchMap((params: Params) => this.dataService.getRecord('awards', +params['id']))
      .subscribe(award => this.award = award);
  }

  ngOnInit() {
    this.route.params
      .subscribe((params: Params) => {
        this.actorId = params['id'];
      });
  }

  saveAward(awardForm: NgForm) {
    if (typeof awardForm.value.id === 'number') {
      this.dataService.editRecord('awards;', awardForm.value, awardForm.value.id)
          .subscribe(
            award => this.successMessage = 'Record updated successfully',
            error =>  this.errorMessage = <any>error);
    }else {
      this.dataService.addRecord(`actors/${this.actorId}/awards`, awardForm.value)
          .subscribe(
            award => this.successMessage = 'Record added successfully',
            error =>  this.errorMessage = <any>error);
            this.award = {};
    }

  }

  ngAfterViewChecked() {
    this.formChanged();
  }

  formChanged() {
    this.awardForm = this.currentForm;
    this.awardForm.valueChanges
      .subscribe(
        data => this.onValueChanged()
      );
  }

  onValueChanged() {
    const form = this.awardForm.form;

    for (let field in this.formErrors) {
      // clear previous error message (if any)
      this.formErrors[field] = '';
      const control = form.get(field);

      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }

  formErrors = {
    'firstName': '',
    'lastName': '',
    'birthDate': '',
    'activeSinceYear': ''
  };

  validationMessages = {
    'title': {
      'required': 'Title is required.',
      'minlength': 'Title must be at least 2 characters long.',
      'maxlength': 'Title cannot be more than 30 characters long.'
    },
    'organization': {
      'required': 'Organization is required.',
      'minlength': 'Organization must be at least 2 characters long.',
      'maxlength': 'Organization cannot be more than 30 characters long.'
    },
    'year': {
      'pattern': 'Active Since Year must be a number'
    }
  };

}

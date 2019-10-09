import { Component, OnInit } from '@angular/core';
import { SearchConsultant } from '../../core/src/model/belcorp-search-consultant.model';
import { SearchConsultantService } from '../../core/src/services/belcorp-search-consultant.service'
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-belcorp-search-consultant',
  templateUrl: './belcorp-search-consultant.component.html',
  styleUrls: ['./belcorp-search-consultant.component.scss'],
  providers: [ SearchConsultantService ]
})

export class SearchConsultantComponent implements OnInit {
  public searchConsultant: Observable<SearchConsultant[]>;
  registerForm: FormGroup;

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
        firstname: ['', Validators.required],
        lastname: ['', Validators.required],
        distrito: ['', Validators.required]
    });
  }

  constructor(private searchConsultantService: SearchConsultantService, private formBuilder: FormBuilder) {
    this.searchConsultantService = searchConsultantService;
  }
  public submit() {
    this.searchConsultant = this.searchConsultantService.getSearchConsultant(this.registerForm.controls);
  }

}

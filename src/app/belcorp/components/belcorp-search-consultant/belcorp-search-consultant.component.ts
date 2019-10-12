import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { SearchConsultant } from '../../core/src/model/belcorp-search-consultant.model';
import { SearchConsultantService } from '../../core/src/services/belcorp-search-consultant.service';

@Component({
  selector: 'app-belcorp-search-consultant',
  templateUrl: './belcorp-search-consultant.component.html',
  styleUrls: ['./belcorp-search-consultant.component.scss'],
  providers: [SearchConsultantService],
})
export class SearchConsultantComponent implements OnInit {
  public forState: any;
  public searchConsultant: Observable<SearchConsultant[]>;
  public searchConsultantSubmit: SearchConsultant;
  public searchConsultantFormPerson: FormGroup;
  public searchConsultantFormCode: FormGroup;
  public searchConsultantFormPhone: FormGroup;
  public loading = false;
  public showMe = true;
  public consultProfile: any;
  public warning = false;

  constructor(private searchConsultantService: SearchConsultantService, private formBuilder: FormBuilder) {
    this.searchConsultantService = searchConsultantService;
  }

  ngOnInit() {
    this.getUbigeo();
    this.creationForms();
    this.getToken();
  }

  private getToken() {
    this.searchConsultantService.getBelcorpToken().subscribe(data => {
      console.log(data);
    });
  }

  public creationForms() {
    this.createFormPerson();
    this.createFormCode();
    this.createFormPhone();
  }

  public createFormPerson() {
    this.searchConsultantFormPerson = this.formBuilder.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      distrito: [''],
    });
  }

  public createFormCode() {
    this.searchConsultantFormCode = this.formBuilder.group({
      code: ['', Validators.required],
    });
  }

  public createFormPhone() {
    this.searchConsultantFormPhone = this.formBuilder.group({
      phone: ['', Validators.required],
    });
  }

  private getUbigeo() {
    this.searchConsultantService.getUbigeo().subscribe(data => {
      this.forState = data;
    });
  }

  public submitPersonales() {
    this.warning = false;
    this.loading = true;
    const type = 'PERSON';
    this.searchConsultantService.getSearchConsultant(this.searchConsultantFormPerson.value, type).subscribe(
      next => {
        if (next.length <= 0) {
          this.warning = true;
        } else {
          this.showMe = false;
        }
        this.consultProfile = next;
        this.loading = false;
      },
      error => {
        this.loading = false;
      }
    );
  }

  public submitCode() {
    this.warning = false;
    this.loading = true;
    const type = 'CODE';
    this.searchConsultantService.getSearchConsultant(this.searchConsultantFormCode.value, type).subscribe(
      next => {
        if (next.length <= 0) {
          this.warning = true;
        } else {
          this.showMe = false;
        }
        this.consultProfile = next;
        this.loading = false;
      },
      error => {
        this.loading = false;
      }
    );
  }

  public submitPhone() {
    this.warning = false;
    this.loading = true;
    const type = 'PHONE';
    this.searchConsultantService.getSearchConsultant(this.searchConsultantFormPhone.value, type).subscribe(
      next => {
        if (next.length <= 0) {
          this.warning = true;
        } else {
          this.showMe = false;
        }
        this.consultProfile = next;
        this.loading = false;
      },
      error => {
        this.loading = false;
      }
    );
  }

  public showMeReverse() {
    this.warning = false;
    this.showMe = true;
    this.creationForms();
  }
}

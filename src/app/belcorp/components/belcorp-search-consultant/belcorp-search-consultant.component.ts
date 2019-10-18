import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SiteContextConfig } from '@spartacus/core';
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
  public showPopup = false;
  public token: string;

  constructor(
    private searchConsultantService: SearchConsultantService,
    private formBuilder: FormBuilder,
    private router: Router,
    private test: SiteContextConfig
  ) {
    this.searchConsultantService = searchConsultantService;
  }

  ngOnInit() {
    this.getToken();
    this.creationForms();
  }

  private getToken() {
    this.searchConsultantService
      .getBelcorpToken()
      .subscribe(data => {
        this.token = data;
      })
      .add(() => this.getUbigeo());
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
    this.searchConsultantService.getUbigeo(this.token).subscribe(data => {
      this.forState = data;
    });
  }

  public submitPersonales() {
    this.warning = false;
    this.loading = true;
    const type = 'PERSON';
    this.searchConsultantService.getSearchConsultant(this.searchConsultantFormPerson.value, type, this.token).subscribe(
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
    this.searchConsultantService.getSearchConsultant(this.searchConsultantFormCode.value, type, this.token).subscribe(
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
    this.searchConsultantService.getSearchConsultant(this.searchConsultantFormPhone.value, type, this.token).subscribe(
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

  public sentConsultantToHybris(consult: string, country: string) {
    this.searchConsultantService.sendConsultantCodeToHybris(consult, country).subscribe(
      next => {
        console.log(next.urlStore);
        this.test.context.urlParameters[3] = 'replicatedSite';
        this.test.context['replicatedSite'] = [`${next.urlStore}`];
        this.router.navigate([`/`]);
      },
      error => {
        this.showPopup = true;
      }
    );
  }

  public showMeReverse() {
    this.warning = false;
    this.showMe = true;
    this.creationForms();
  }
}

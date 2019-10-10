import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { SearchConsultant } from '../../core/src/model/belcorp-search-consultant.model';
import { SearchConsultantService } from '../../core/src/services/belcorp-search-consultant.service';

@Component({
  selector: 'app-belcorp-search-consultant',
  templateUrl: './belcorp-search-consultant.component.html',
  styleUrls: ['./belcorp-search-consultant.component.scss'],
  providers: [SearchConsultantService]
})

export class SearchConsultantComponent implements OnInit {
  public forState: any;
  public searchConsultant: Observable<SearchConsultant[]>;
  searchConsultantFormBasicsInformations: FormGroup;
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<string[]>;
  myControl = new FormControl();

  constructor(private searchConsultantService: SearchConsultantService, private formBuilder: FormBuilder) {
    this.searchConsultantService = searchConsultantService;
  }

  ngOnInit() {
    this.getUbigeo();
    this.searchConsultantFormBasicsInformations = this.formBuilder.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      distrito: ['', Validators.required]
    });

    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  }

  private getUbigeo() {
    this.searchConsultantService.getUbigeo().subscribe((data) => {
      console.log(data);
      this.forState = data;
    });
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }
  public submit() {
    this.searchConsultant = this.searchConsultantService.getSearchConsultant(this.searchConsultantFormBasicsInformations.controls);
  }

}

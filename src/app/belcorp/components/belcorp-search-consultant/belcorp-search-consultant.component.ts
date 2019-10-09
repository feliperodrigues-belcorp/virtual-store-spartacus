import { Component, OnInit } from '@angular/core';
import { SearchConsultant } from '../../core/src/model/belcorp-search-consultant.model';
import { SearchConsultantService } from '../../core/src/services/belcorp-search-consultant.service';
import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-belcorp-search-consultant',
  templateUrl: './belcorp-search-consultant.component.html',
  styleUrls: ['./belcorp-search-consultant.component.scss'],
  providers: [ SearchConsultantService ]
})

export class SearchConsultantComponent implements OnInit {
  public searchConsultant: Observable<SearchConsultant[]>;
  searchConsultantFormBasicsInformations: FormGroup;
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<string[]>;
  myControl = new FormControl();

  ngOnInit() {
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

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  constructor(private searchConsultantService: SearchConsultantService, private formBuilder: FormBuilder) {
    this.searchConsultantService = searchConsultantService;
  }
  public submit() {
    this.searchConsultant = this.searchConsultantService.getSearchConsultant(this.searchConsultantFormBasicsInformations.controls);
  }

}

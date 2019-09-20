import { Component, OnInit } from '@angular/core';
import { StoreFinderService } from '@spartacus/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'cx-store-finder-stores-count',
  templateUrl: './store-finder-stores-count.component.html',
})
export class StoreFinderStoresCountComponent implements OnInit {
  locations$: Observable<any>;
  isLoading$: Observable<boolean>;

  constructor(private storeFinderService: StoreFinderService) {}

  ngOnInit() {
    this.storeFinderService.viewAllStores();
    this.locations$ = this.storeFinderService.getViewAllStoresEntities();
    this.isLoading$ = this.storeFinderService.getViewAllStoresLoading();
  }
}

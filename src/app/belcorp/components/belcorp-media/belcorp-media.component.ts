import { Component } from '@angular/core';
import { MediaComponent, MediaService } from '@spartacus/storefront';

@Component({
  selector: 'app-belcorp-media',
  templateUrl: './belcorp-media.component.html',
  styleUrls: ['./belcorp-media.component.scss']
})
export class BelcorpMediaComponent extends MediaComponent {

  constructor(
    mediaService: MediaService
  ) {
    super(mediaService)
  }



}

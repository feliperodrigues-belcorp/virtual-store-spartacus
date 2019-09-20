import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CmsLinkComponent } from '@spartacus/core';
import { CmsComponentData } from '../../../cms-structure/page/model/cms-component-data';

@Component({
  selector: 'cx-link',
  templateUrl: './link.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LinkComponent {
  constructor(public component: CmsComponentData<CmsLinkComponent>) {}
}

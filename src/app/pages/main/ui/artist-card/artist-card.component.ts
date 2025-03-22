import { DecimalPipe, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ArtistModel } from '@models';

@Component({
  selector: 'app-artist-card',
  imports: [DecimalPipe, NgTemplateOutlet],
  templateUrl: './artist-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArtistCardComponent {
  readonly artist = input.required<ArtistModel | null>();
  readonly loading = input<boolean>(false);
}

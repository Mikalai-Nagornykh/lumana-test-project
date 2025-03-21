import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ArtistModel } from '@models';

@Component({
  selector: 'app-artist-card',
  imports: [DecimalPipe],
  templateUrl: './artist-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArtistCardComponent {
  readonly artist = input.required<ArtistModel>();
}

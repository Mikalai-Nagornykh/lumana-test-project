import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthActions } from '@auth';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet],
  templateUrl: './layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent implements OnInit {
  private authStore = inject(Store);

  ngOnInit() {
    this.authStore.dispatch(AuthActions.getAccessToken());
  }
}

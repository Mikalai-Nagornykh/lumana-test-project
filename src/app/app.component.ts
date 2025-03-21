import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthActions } from '@auth';
import { Store } from '@ngrx/store';
import { CLIENT_ID_TOKEN, CLIENT_SECRET_TOKEN } from '@services';
import { AuthService } from './core/auth/services/api/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  private authStore = inject(Store);
  private clientId = inject(CLIENT_ID_TOKEN);
  private clientSecret = inject(CLIENT_SECRET_TOKEN);

  ngOnInit() {
    this.authStore.dispatch(
      AuthActions.getAccessToken({
        client_id: this.clientId,
        client_secret: this.clientSecret,
      }),
    );
  }
}

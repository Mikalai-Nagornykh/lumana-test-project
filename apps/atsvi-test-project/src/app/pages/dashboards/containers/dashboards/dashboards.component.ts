import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { initExampleRust, moving_average } from '@wasm-moving-average';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { WebSocketService } from '@services';
import { RustWasmService } from '../../services/rust-wasm.service';

@Component({
  selector: 'app-dashboards',
  imports: [CommonModule, BaseChartDirective],
  providers: [RustWasmService],
  templateUrl: './dashboards.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardsComponent implements OnInit, OnDestroy {
  private webSocketService = inject(WebSocketService);

  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        data: [65, 59, 80, 81, 56, 55, 40],
        label: 'Series A',
        fill: true,
        tension: 0.5,
        borderColor: 'black',
        backgroundColor: 'rgba(255,0,0,0.3)',
      },
    ],
  };

  public lineChartOptions: ChartOptions<'line'> = {
    responsive: false,
  };

  public lineChartLegend = true;

  private rawData: number[] = [];

  data = [1, 2, 3, 4, 5, 6];
  windowSize = 3;

  constructor() {
    this.webSocketService.connect('ws://localhost:8080');
  }

  async ngOnInit() {
    this.webSocketService.messages$.subscribe(console.log);
    await initExampleRust();
    // console.log(moving_average(this.data, this.windowSize));
  }

  ngOnDestroy() {
    this.webSocketService.closeConnection();
  }
}

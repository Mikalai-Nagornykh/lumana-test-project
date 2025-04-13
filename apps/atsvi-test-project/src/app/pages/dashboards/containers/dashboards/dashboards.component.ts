import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { WebSocketService } from '@services';
import { initExampleRust, moving_average } from '@wasm-moving-average';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { format } from 'date-fns';

type FilterType = 'MA' | 'MF' | 'EMA';

interface FilterOption {
  type: FilterType;
  label: string;
}

const filterOptions: FilterOption[] = [
  { type: 'MA', label: 'Moving Average' },
  { type: 'MF', label: 'Median Filter' },
  { type: 'EMA', label: 'Exponential Moving Average' },
];

@Component({
  selector: 'app-dashboards',
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './dashboards.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardsComponent implements OnInit, OnDestroy {
  private chart = viewChild(BaseChartDirective);

  private webSocketService = inject(WebSocketService);

  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        label: 'Raw Data',
        data: [],
        fill: false,
        borderColor: 'rgba(255, 99, 132, 1)',
        tension: 0.4,
      },
      {
        label: 'Smoothed',
        data: [],
        fill: false,
        borderColor: 'rgba(54, 162, 235, 1)',
        tension: 0.4,
      },
    ],
  };
  protected lineChartOptions: ChartOptions<'line'> = {
    responsive: false,
    animation: {
      duration: 1000,
      easing: 'linear',
    },
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#f1f1f1',
        },
      },
    },
    scales: {
      x: {
        ticks: {
          autoSkip: true,
          maxTicksLimit: 10,
          color: '#9ca3af',
          font: {
            size: 12,
          },
        },
        title: {
          display: true,
          text: 'Time',
          color: '#d1d5db',
          font: {
            size: 14,
            weight: 'bold',
          },
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
      y: {
        ticks: {
          color: '#ccc',
        },
        grid: {
          color: 'rgba(255,255,255,0.1)',
        },
      },
    },
  };

  protected readonly filterOptions = filterOptions;
  protected readonly lineChartLegend = true;

  protected selectedType = filterOptions[0];
  protected freezeMode = signal<boolean>(false);

  private rawData: { time: Date; value: number }[] = [];
  private maxPoints = 50;
  private windowSize = 5;
  private initialized = false;

  constructor() {
    this.webSocketService.connect('ws://localhost:8080');
  }

  async ngOnInit() {
    await initExampleRust();
    this.initialized = true;

    this.webSocketService.messages$.subscribe((msg) => {
      const value = Number(msg);
      if (isNaN(value)) return;

      this.handleIncomingValue(value);
    });
  }

  private handleIncomingValue(value: number) {
    if (!this.initialized) return;

    const now = new Date();

    this.rawData.push({ time: now, value });

    if (this.rawData.length > this.maxPoints) {
      this.rawData.shift();
    }

    if (!this.freezeMode()) {
      const times = this.rawData.map((d) => format(d.time, 'HH:mm:ss'));
      const values = this.rawData.map((d) => d.value);

      // @ts-ignore
      const smoothed = moving_average(values, this.windowSize);

      this.lineChartData.labels = [...times];
      this.lineChartData.datasets[0].data = [...values];
      this.lineChartData.datasets[1].data = [...smoothed];

      this.chart()?.update();
    }
  }

  ngOnDestroy() {
    this.webSocketService.closeConnection();
  }
}

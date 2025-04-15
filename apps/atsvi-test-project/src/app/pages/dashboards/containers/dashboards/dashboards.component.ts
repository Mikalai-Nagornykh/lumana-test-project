import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnDestroy,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { WebSocketService } from '@services';
import { initRustFunctions } from '@wasm-moving-average';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { format } from 'date-fns';
import { BaseChartDirective } from 'ng2-charts';
import {
  filterOptions,
  SmoothingMethod,
} from '../../constants/smooth-options.constant';

@Component({
  selector: 'app-dashboards',
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './dashboards.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardsComponent implements OnInit, OnDestroy {
  private chart = viewChild(BaseChartDirective);

  private webSocketService = inject(WebSocketService);
  private destroyRef = inject(DestroyRef);

  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [],
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

  protected selectedTypes = signal<SmoothingMethod[]>([filterOptions[0]]);
  protected freezeMode = signal<boolean>(false);

  private rawData: { time: Date; value: number }[] = [];
  private maxPoints = 50;
  private windowSize = 5;
  private alpha = 0.5;
  private initialized = false;

  constructor() {
    this.webSocketService.connect('ws://localhost:8080');
  }

  async ngOnInit() {
    await initRustFunctions();
    this.initialized = true;

    this.webSocketService.messages$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((msg) => {
        const value = Number(msg);
        if (isNaN(value)) return;

        this.handleIncomingValue(value);
      });
  }

  protected isSelected(option: SmoothingMethod): boolean {
    return this.selectedTypes().some((t) => t.type === option.type);
  }

  protected toggleFilter(option: SmoothingMethod): void {
    const current = this.selectedTypes();
    const exists = current.find((o) => o.type === option.type);

    if (exists) {
      this.selectedTypes.set(current.filter((o) => o.type !== option.type));
    } else {
      this.selectedTypes.set([...current, option]);
    }
  }

  private handleIncomingValue(value: number) {
    if (!this.initialized) return;

    const now = new Date();
    this.rawData.push({ time: now, value });

    if (this.rawData.length > this.maxPoints) {
      this.rawData.shift();
    }

    if (this.freezeMode()) return;

    this.changeDataSet();
  }

  private changeDataSet(): void {
    const times = this.rawData.map((d) => format(d.time, 'HH:mm:ss'));
    const values = this.rawData.map((d) => d.value);

    this.lineChartData.labels = [...times];

    if (this.lineChartData.datasets.length === 0) {
      this.lineChartData.datasets.push({
        label: 'Raw Data',
        data: [],
        fill: false,
        borderColor: 'rgba(255, 99, 132, 1)',
        tension: 0.4,
      });
    }

    this.lineChartData.datasets[0].data = [...values];

    this.selectedTypes().forEach((option, index) => {
      const fn = option.fn;
      const param = option.type === 'EMA' ? this.alpha : this.windowSize;
      const smoothed = fn(values, param);

      const datasetIndex = index + 1;

      if (!this.lineChartData.datasets[datasetIndex]) {
        this.lineChartData.datasets[datasetIndex] = {
          label: option.label,
          data: [],
          fill: false,
          borderColor: option.color,
          tension: 0.4,
        };
      }

      this.lineChartData.datasets[datasetIndex].data = smoothed;
    });

    this.lineChartData.datasets.length = this.selectedTypes().length + 1;

    this.chart()?.update();
  }

  ngOnDestroy() {
    this.webSocketService.closeConnection();
  }
}

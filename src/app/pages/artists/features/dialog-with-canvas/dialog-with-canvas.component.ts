import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  input,
  output,
  untracked,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ArtistModel } from '@models';
import {
  EMPTY,
  filter,
  fromEvent,
  map,
  Observable,
  switchMap,
  takeUntil,
  tap,
  throttleTime,
} from 'rxjs';
import {
  CanvasState,
  CursorState,
  POLYGONS_COLORS,
} from '../../constants/canvas.const';
import { Point } from '../../models/polygon.model';
import { CanvasHelper } from '../../utils/canvas-helper.util';
import { Polygon } from '../../utils/classes/canvas-polygon.class';

@Component({
  selector: 'app-dialog-with-canvas',
  imports: [],
  templateUrl: './dialog-with-canvas.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogWithCanvasComponent {
  readonly canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');
  readonly modal = viewChild.required<ElementRef<HTMLElement>>('modal');

  private document = inject(DOCUMENT);
  private destroyRef = inject(DestroyRef);

  readonly artist = input.required<ArtistModel>();
  readonly polygons = input<Polygon[]>();
  readonly isCloseEmit = output<boolean>();
  readonly savePolygonsEmit = output<Polygon[]>();

  private readonly canvasNativeElement = computed(
    () => this.canvas()?.nativeElement,
  );
  private context = computed<CanvasRenderingContext2D>(
    () =>
      this.canvasNativeElement().getContext('2d') as CanvasRenderingContext2D,
  );

  private state = CanvasState.idle;
  private color = POLYGONS_COLORS.red;
  private polygonsCollection: Polygon[] = [];
  private canvasHelper!: CanvasHelper;

  private mouseDown$: Observable<MouseEvent> = EMPTY;
  private mouseMove$: Observable<MouseEvent> = EMPTY;
  private mouseUp$: Observable<MouseEvent> = EMPTY;

  constructor() {
    effect(() => {
      const canvas = this.canvasNativeElement();
      if (canvas) {
        untracked(() => {
          this.mouseDown$ = fromEvent<MouseEvent>(canvas, 'mousedown');
          this.mouseMove$ = fromEvent<MouseEvent>(canvas, 'mousemove');
          this.mouseUp$ = fromEvent<MouseEvent>(this.document, 'mouseup');
        });
      }
    });

    effect(() => {
      const modal = this.modal();
      const canvas = this.canvasNativeElement();
      const artist = this.artist();
      const context = this.context();
      const polygons = this.polygons();

      if (modal && canvas && artist && context) {
        untracked(() => {
          this.canvasHelper = new CanvasHelper(
            canvas,
            artist.images[0]?.url || 'favicon.ico',
          );
          this.canvasHelper.init();

          if (polygons) {
            this.addPolygons(polygons);

            this.canvasHelper.drawPolygonsCollection(this.polygonsCollection);
          }

          this.drawingSubscription();
          this.movingSubscription();
          this.stateSubscription();
          this.rotatingSubscription();
        });
      }
    });
  }

  private addPolygons(polygons: Polygon[]) {
    const newPolygons = polygons.map((polygon) => {
      const clonedPoints = polygon.points.map((point) => ({
        x: point.x,
        y: point.y,
      }));
      return new Polygon(clonedPoints, polygon.angle, polygon.color);
    });

    this.polygonsCollection = [...newPolygons];
  }

  protected onSave(): void {
    this.savePolygonsEmit.emit(this.polygonsCollection);
  }

  protected clearPolygons(): void {
    this.polygonsCollection = [];
    this.canvasHelper.clearCanvas();
  }

  private drawingSubscription(): void {
    let drawingPolygons: Point[] = [];

    const keydown$ = fromEvent<KeyboardEvent>(this.document, 'keydown').pipe(
      filter((event) => event.key === 'Escape'),
    );

    keydown$.subscribe(() => {
      if (this.state === CanvasState.drawing) {
        drawingPolygons.length = 0;
        this.canvasHelper.clearCanvas();
        this.changeState(CanvasState.idle);
        this.canvasHelper.drawPolygonsCollection(this.polygonsCollection);
      }
    });

    this.mouseDown$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter(
          () =>
            this.state === CanvasState.idle ||
            this.state === CanvasState.drawing,
        ),
        map((event) => ({ x: event.offsetX, y: event.offsetY })),
        tap(({ x, y }) => {
          this.context().fillStyle = `rgba(${this.color}, 0.5)`;
          this.context().lineWidth = 2;
          this.context().strokeStyle = `rgba(${this.color})`;

          if (this.state === CanvasState.idle) {
            this.changeState(CanvasState.drawing);
            this.canvasHelper.startDrawing(x, y, drawingPolygons);
          } else {
            if (this.canvasHelper.isNearStartPoint(drawingPolygons, x, y)) {
              this.canvasHelper.closePolygon();
              const newPolygon = new Polygon(drawingPolygons, 0, this.color);
              this.polygonsCollection.push(newPolygon);
              this.changeState(CanvasState.idle);
              drawingPolygons = [];
              this.canvasHelper.drawPolygonsCollection(this.polygonsCollection);
            } else {
              drawingPolygons.push({ x, y });
              this.canvasHelper.drawActivePolygon(
                this.context(),
                drawingPolygons,
                x,
                y,
              );
            }
          }
        }),
        switchMap(() =>
          this.mouseMove$.pipe(
            throttleTime(16),
            filter(() => this.state === CanvasState.drawing),
            map((event) => ({
              xCurrent: event.offsetX,
              yCurrent: event.offsetY,
            })),
            tap(({ xCurrent, yCurrent }) => {
              this.canvasHelper.drawPolygonsCollection(this.polygonsCollection);
              this.canvasHelper.drawCurrentPolygon(
                this.context(),
                drawingPolygons,
                xCurrent,
                yCurrent,
                `rgba(${this.color})`,
              );
            }),
          ),
        ),
      )
      .subscribe();
  }

  private movingSubscription(): void {
    this.mouseDown$
      .pipe(
        filter(() => this.state === CanvasState.moving),
        switchMap((downEvent) => {
          this.changeState(CanvasState.drag);
          const currentItem = this.polygonsCollection.find((item) =>
            item.containsCursor(downEvent.offsetX, downEvent.offsetY),
          );
          if (currentItem) {
            this.canvasHelper.drawPolygonsCollection(this.polygonsCollection);
            currentItem.drawBoundingBox(this.context());
          } else {
            return EMPTY;
          }

          let previousOffsetX = downEvent.offsetX,
            previousOffsetY = downEvent.offsetY;

          return this.mouseMove$.pipe(
            tap((moveEvent) => {
              const dx = moveEvent.offsetX - previousOffsetX;
              const dy = moveEvent.offsetY - previousOffsetY;
              previousOffsetX = moveEvent.offsetX;
              previousOffsetY = moveEvent.offsetY;
              currentItem.translate(dx, dy);

              this.canvasHelper.drawPolygonsCollection(this.polygonsCollection);
              currentItem.drawBoundingBox(this.context());
            }),
            takeUntil(
              this.mouseUp$.pipe(tap(() => this.changeState(CanvasState.idle))),
            ),
          );
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  private stateSubscription(): void {
    this.mouseMove$
      .pipe(
        filter(
          () =>
            this.state !== CanvasState.drag &&
            this.state !== CanvasState.drawing,
        ),
        map((event) => this.getCursorState(event)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((cursorState) => this.updateCursorStyle(cursorState));
  }

  private rotatingSubscription(): void {
    this.mouseDown$
      .pipe(
        filter(() => this.state === CanvasState.rotating),
        switchMap((downEvent) => {
          this.changeState(CanvasState.drag);

          const currentItem = this.polygonsCollection.find((item) =>
            item.isCursorNearRotationHandle(
              this.context(),
              downEvent.offsetX,
              downEvent.offsetY,
            ),
          );

          if (!currentItem) {
            return EMPTY;
          }

          return this.mouseMove$.pipe(
            tap((moveEvent) =>
              this.canvasHelper.handleRotation(
                currentItem,
                moveEvent,
                this.polygonsCollection,
              ),
            ),
            takeUntil(
              this.mouseUp$.pipe(tap(() => this.changeState(CanvasState.idle))),
            ),
          );
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  private changeState(newState: CanvasState): void {
    this.state = newState;
  }

  private getCursorState(event: MouseEvent): CursorState {
    const moveItem = this.polygonsCollection.find((item) =>
      item.containsCursor(event.offsetX, event.offsetY),
    );
    const rotateItem = this.polygonsCollection.find((item) =>
      item.isCursorNearRotationHandle(
        this.context(),
        event.offsetX,
        event.offsetY,
      ),
    );

    return moveItem ? 'move' : rotateItem ? 'rotate' : null;
  }

  private updateCursorStyle(cursorState: CursorState): void {
    switch (cursorState) {
      case 'move':
        this.canvasNativeElement().style.cursor = 'grab';
        this.changeState(CanvasState.moving);
        break;
      case 'rotate':
        this.canvasNativeElement().style.cursor = 'move';
        this.changeState(CanvasState.rotating);
        break;
      default:
        this.canvasNativeElement().style.cursor = 'default';
        this.changeState(CanvasState.idle);
        break;
    }
  }
}

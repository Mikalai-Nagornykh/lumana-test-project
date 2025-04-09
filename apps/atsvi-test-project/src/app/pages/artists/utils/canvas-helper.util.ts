import { Point } from '../models/polygon.model';
import { Polygon } from './classes/canvas-polygon.class';

export class CanvasHelper {
  private readonly context: CanvasRenderingContext2D;

  constructor(public canvas: HTMLCanvasElement, public bgUrl: string) {
    this.context = canvas.getContext('2d')!;
  }

  static isPointInsidePolygon(x: number, y: number, polygon: Point[]): boolean {
    let inside = false;
    const len = polygon.length;

    for (let i = 0, j = len - 1; i < len; j = i++) {
      const xi = polygon[i].x,
        yi = polygon[i].y;
      const xj = polygon[j].x,
        yj = polygon[j].y;

      const intersect =
        yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;

      if (intersect) inside = !inside;
    }

    return inside;
  }

  static rotatePoints(
    points: Point[],
    centerX: number,
    centerY: number,
    angle: number,
  ): Point[] {
    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);

    return points.map(({ x, y }) => ({
      x: centerX + (x - centerX) * cosA - (y - centerY) * sinA,
      y: centerY + (x - centerX) * sinA + (y - centerY) * cosA,
    }));
  }

  static drawDashedPolygon(
    context: CanvasRenderingContext2D,
    points: Point[],
    color: string,
    dashPattern: number[] = [6, 4],
  ): void {
    const path = new Path2D();
    points.forEach((point, index) => {
      index === 0
        ? path.moveTo(point.x, point.y)
        : path.lineTo(point.x, point.y);
    });
    path.closePath();

    context.setLineDash(dashPattern);
    context.lineWidth = 1;
    context.strokeStyle = color;
    context.stroke(path);
    context.setLineDash([]);
  }

  public init(): void {
    this.initializeCanvas();
    this.setCanvasBackground();
  }

  public clearCanvas(): void {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  public isNearStartPoint(
    drowningPolygons: Point[],
    x: number,
    y: number,
    threshold: number = 5,
  ): boolean {
    if (drowningPolygons.length === 0) return false;

    const firstPoint = drowningPolygons[0];
    const distance = Math.sqrt(
      (x - firstPoint.x) ** 2 + (y - firstPoint.y) ** 2,
    );

    return distance <= threshold;
  }

  public startDrawing(x: number, y: number, drowningPolygons: Point[]): void {
    drowningPolygons.push({ x, y });
    this.context.beginPath();
    this.context.moveTo(x, y);
  }

  public closePolygon(): void {
    this.context.closePath();
    this.context.stroke();
    this.context.fill();
  }

  public drawActivePolygon(
    context: CanvasRenderingContext2D,
    points: Point[],
    xCurrent: number,
    yCurrent: number,
  ) {
    points.forEach((point, index) => {
      if (index === 0) {
        context.moveTo(point.x, point.y);
      } else {
        context.lineTo(point.x, point.y);
      }
    });
    context.lineTo(xCurrent, yCurrent);
    context.stroke();
  }

  public drawPolygonsCollection(objectCollection: Polygon[]): void {
    this.clearCanvas();
    objectCollection.forEach((polygon) =>
      polygon.drawTransformedPolygon(this.context),
    );
  }

  public drawCurrentPolygon(
    context: CanvasRenderingContext2D,
    points: Point[],
    xCurrent?: number,
    yCurrent?: number,
    color: string = 'rgba(0, 0, 0, 1)',
  ): void {
    context.lineWidth = 2;
    context.strokeStyle = color;
    context.beginPath();

    points.forEach((point, index) => {
      if (index === 0) {
        context.moveTo(point.x, point.y);
      } else {
        context.lineTo(point.x, point.y);
      }
    });

    if (xCurrent !== undefined && yCurrent !== undefined) {
      context.lineTo(xCurrent, yCurrent);
    }

    context.stroke();
  }

  public handleRotation(
    currentItem: Polygon,
    moveEvent: MouseEvent,
    objectCollection: Polygon[],
  ): void {
    const targetX = moveEvent.offsetX;
    const targetY = moveEvent.offsetY;
    const minMaxPoints = currentItem.boundingBox;

    currentItem.updateRotation(targetX, targetY, minMaxPoints);

    this.drawPolygonsCollection(objectCollection);
    currentItem.drawTransformedPolygon(this.context);
    currentItem.drawBoundingBox(this.context);
  }

  private setCanvasBackground(): void {
    Object.assign(this.canvas.style, {
      backgroundImage: `url(${this.bgUrl})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    });

    this.setCanvasScale();
  }

  private initializeCanvas(): void {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  private setCanvasScale(): void {
    const scale = 1;
    this.canvas.width = this.canvas.clientWidth * scale;
    this.canvas.height = this.canvas.clientHeight * scale;
    this.context.scale(scale, scale);
  }
}

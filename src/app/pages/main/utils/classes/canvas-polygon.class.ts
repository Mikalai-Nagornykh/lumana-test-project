import { CANVAS_COLORS, POLYGONS_COLORS } from '../../constants/canvas.const';
import { Point } from '../../models/polygon.model';
import { CanvasHelper } from '../canvas-helper.util';
import { BoundingBox } from './bounding-box.class';

export class Polygon {
  constructor(
    public points: Point[],
    public angle: number,
    public color: string = POLYGONS_COLORS.red,
  ) {}

  public get boundingBox(): BoundingBox {
    return BoundingBox.fromPoints(this.points);
  }

  public drawTransformedPolygon(context: CanvasRenderingContext2D): void {
    const { centerX, centerY } = this.boundingBox;
    const cosA = Math.cos(this.angle);
    const sinA = Math.sin(this.angle);

    const polygon = new Path2D();

    this.points.forEach((point, index) => {
      const x =
        centerX + (point.x - centerX) * cosA - (point.y - centerY) * sinA;
      const y =
        centerY + (point.x - centerX) * sinA + (point.y - centerY) * cosA;

      index === 0 ? polygon.moveTo(x, y) : polygon.lineTo(x, y);
    });

    polygon.closePath();

    context.fillStyle = `rgba(${this.color}, 0.5)`;
    context.strokeStyle = `rgba(${this.color})`;
    context.lineWidth = 2;
    context.fill(polygon);
    context.stroke(polygon);
  }

  public translate(dx: number, dy: number): void {
    this.points.forEach((point) => {
      point.x += dx;
      point.y += dy;
    });
  }

  public updateRotation(
    targetX: number,
    targetY: number,
    minMaxPoints: BoundingBox,
  ): void {
    const dx1 = minMaxPoints.minX - minMaxPoints.centerX;
    const dy1 = minMaxPoints.minY - minMaxPoints.centerY;

    const dx2 = targetX - minMaxPoints.centerX;
    const dy2 = targetY - minMaxPoints.centerY;

    this.angle = Math.atan2(dy2, dx2) - Math.atan2(dy1, dx1);
  }

  public containsCursor(cursorX: number, cursorY: number): boolean {
    const { centerX, centerY } = this.boundingBox;
    const cosA = Math.cos(this.angle);
    const sinA = Math.sin(this.angle);

    const rotatedPoints = this.points.map((point) => ({
      x: centerX + (point.x - centerX) * cosA - (point.y - centerY) * sinA,
      y: centerY + (point.x - centerX) * sinA + (point.y - centerY) * cosA,
    }));

    return CanvasHelper.isPointInsidePolygon(cursorX, cursorY, rotatedPoints);
  }

  public drawBoundingBox(context: CanvasRenderingContext2D) {
    const { minX, maxX, minY, maxY, centerX, centerY } = this.boundingBox;

    const framePoints: Point[] = [
      { x: minX, y: minY },
      { x: maxX, y: minY },
      { x: maxX, y: maxY },
      { x: minX, y: maxY },
    ];

    const rotatedPoints = CanvasHelper.rotatePoints(
      framePoints,
      centerX,
      centerY,
      this.angle,
    );
    CanvasHelper.drawDashedPolygon(context, rotatedPoints, '#00FFFF');

    const rotatePoint = new Path2D();
    rotatePoint.arc(rotatedPoints[0].x, rotatedPoints[0].y, 6, 0, 2 * Math.PI);
    context.fillStyle = CANVAS_COLORS.blue;
    context.fill(rotatePoint);
  }

  public isCursorNearRotationHandle(
    context: CanvasRenderingContext2D,
    cursorX: number,
    cursorY: number,
  ): boolean {
    const { minX, centerX, minY, centerY } = this.boundingBox;
    const cosA = Math.cos(this.angle);
    const sinA = Math.sin(this.angle);

    const rotatedX =
      centerX + (minX - centerX) * cosA - (minY - centerY) * sinA;

    const rotatedY =
      centerY + (minX - centerX) * sinA + (minY - centerY) * cosA;

    const rotatePoint = new Path2D();
    rotatePoint.arc(rotatedX, rotatedY, 8, 0, 2 * Math.PI);
    return context.isPointInPath(rotatePoint, cursorX, cursorY);
  }
}

import { Point } from '../../models/polygon.model';

export class BoundingBox {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  centerX: number;
  centerY: number;

  constructor(minX: number, maxX: number, minY: number, maxY: number) {
    this.minX = minX;
    this.maxX = maxX;
    this.minY = minY;
    this.maxY = maxY;
    this.centerX = (minX + maxX) / 2;
    this.centerY = (minY + maxY) / 2;
  }

  static fromPoints(points: Point[]): BoundingBox {
    const minX = Math.min(...points.map((point) => point.x));
    const maxX = Math.max(...points.map((point) => point.x));
    const minY = Math.min(...points.map((point) => point.y));
    const maxY = Math.max(...points.map((point) => point.y));

    return new BoundingBox(minX, maxX, minY, maxY);
  }
}

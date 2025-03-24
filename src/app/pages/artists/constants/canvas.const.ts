export const POLYGONS_COLORS = {
  red: '231, 76, 60',
};
export const CANVAS_COLORS = { blue: '#58a6ff' };

export enum CanvasState {
  idle = 'idle',
  drawing = 'drawing',
  moving = 'moving',
  drag = 'drag',
  rotating = 'rotating',
}

export type CursorState = 'move' | 'rotate' | null;

// Author: Ubayd Sharif

//Types
import { Line, Vec2 } from "./types";
import { Box } from "./types";

export const add = (v1: Vec2, v2: Vec2): Vec2 => {
  return { x: v1.x + v2.x, y: v1.y + v2.y };
};

export const subtract = (v1: Vec2, v2: Vec2): Vec2 => {
  return { x: v1.x - v2.x, y: v1.y - v2.y };
};

export const scale = (v: Vec2, factor: number): Vec2 => {
  return { x: v.x * factor, y: v.y * factor };
};

export const dot = (v1: Vec2, v2: Vec2): number => {
  return v1.x * v2.x + v1.y * v2.y;
};

export const magnitude = (v: Vec2) => {
  return Math.sqrt(v.x * v.x + v.y * v.y);
};

export const normalize = (v: Vec2): Vec2 => {
  const mag = magnitude(v);
  if (mag == 0) {
    return v;
  }
  return { x: v.x / mag, y: v.y / mag };
};

export const distance = (v1: Vec2, v2: Vec2): number => {
  return Math.sqrt(
    (v2.x - v1.x) * (v2.x - v1.x) + (v2.y - v1.y) * (v2.y - v1.y)
  );
};

export const sameSide = (l: Line, p1: Vec2, p2: Vec2) => {
  const sideA: Vec2 = { x: l.x1, y: l.y1 };
  const sideB: Vec2 = { x: l.x2, y: l.y2 };

  const AB: Vec2 = subtract(sideB, sideA);
  const AP1: Vec2 = subtract(p1, sideA);
  const AP2: Vec2 = subtract(p2, sideA);

  const crossZ1 = AP1.x * AB.y - AP1.y * AB.x;
  const crossZ2 = AP2.x * AB.y - AP2.y * AB.x;

  return (crossZ1 >= 0 && crossZ2 >= 0) || (crossZ1 <= 0 && crossZ2 <= 0);
};

export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

export const pointInsideBox = (
  // used in lineBoxCol
  p: { x: number; y: number },
  b: Box
): boolean => {
  return (
    p.x >= b.center_x - b.width / 2 &&
    p.x <= b.center_x + b.width / 2 &&
    p.y >= b.center_y - b.height / 2 &&
    p.y <= b.center_y + b.height / 2
  );
};

export const closestPointOnLine = (l: Line, p: Vec2): Vec2 => {
  // used in circleLineCol
  const A_B: Vec2 = subtract({ x: l.x2, y: l.y2 }, { x: l.x1, y: l.y1 });
  const A_P: Vec2 = subtract(p, { x: l.x1, y: l.y1 });
  const magnitudeAB: number = magnitude(A_B);
  const projection: number = dot(A_P, A_B) / (magnitudeAB * magnitudeAB);

  if (projection < 0) return { x: l.x1, y: l.y1 };
  else if (projection > 1) return { x: l.x2, y: l.y2 };
  else return add({ x: l.x1, y: l.y1 }, scale(A_B, projection));
};

export const orientation = (p: Vec2, q: Vec2, r: Vec2): number => {
  // used in lineLineCol
  const val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
  if (val === 0) return 0;
  return val > 0 ? 1 : 2;
};

export const onSegment = (p: Vec2, q: Vec2, r: Vec2): boolean => {
  // used in lineLineCol
  if (
    q.x <= Math.max(p.x, r.x) &&
    q.x >= Math.min(p.x, r.x) &&
    q.y <= Math.max(p.y, r.y) &&
    q.y >= Math.min(p.y, r.y)
  )
    return true;
  return false;
};

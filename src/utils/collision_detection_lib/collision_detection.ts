// Author: Ubayd Sharif

//TODO:
// 1. Use types for shapes
// 2. Add params using shape types

//types
import { Circle, Box, Line } from "./types";

//functions
import {
  add,
  subtract,
  dot,
  magnitude,
  normalize,
  distance,
  sameSide,
  clamp,
  pointInsideBox,
  closestPointOnLine,
  onSegment,
  orientation,
} from "./vec2_operations";

export const circleCircleCol = (c1: Circle, c2: Circle): boolean => {
  // Two circles collide or overlap in 2D space if the distance between their centers is less than the sum of their radii.
  return (
    distance(
      { x: c1.center_x, y: c1.center_y },
      { x: c2.center_x, y: c2.center_y }
    ) <=
    c1.radius + c2.radius
  );
};

export const lineLineCol = (l1: Line, l2: Line): boolean => {
  const o1 = orientation(
    { x: l1.x1, y: l1.y1 },
    { x: l1.x2, y: l1.y2 },
    { x: l2.x1, y: l2.y1 }
  );
  const o2 = orientation(
    { x: l1.x1, y: l1.y1 },
    { x: l1.x2, y: l1.y2 },
    { x: l2.x2, y: l2.y2 }
  );
  const o3 = orientation(
    { x: l2.x1, y: l2.y1 },
    { x: l2.x2, y: l2.y2 },
    { x: l1.x1, y: l1.y1 }
  );
  const o4 = orientation(
    { x: l2.x1, y: l2.y1 },
    { x: l2.x2, y: l2.y2 },
    { x: l1.x2, y: l1.y2 }
  );

  // General case
  if (o1 !== o2 && o3 !== o4) return true;

  // Special Cases
  // l1 and l2.x1 are collinear and l2.x1 lies on segment l1
  if (
    o1 === 0 &&
    onSegment(
      { x: l1.x1, y: l1.y1 },
      { x: l2.x1, y: l2.y1 },
      { x: l1.x2, y: l1.y2 }
    )
  )
    return true;

  // l1 and l2.x2 are collinear and l2.x2 lies on segment l1
  if (
    o2 === 0 &&
    onSegment(
      { x: l1.x1, y: l1.y1 },
      { x: l2.x2, y: l2.y2 },
      { x: l1.x2, y: l1.y2 }
    )
  )
    return true;

  // l2 and l1.x1 are collinear and l1.x1 lies on segment l2
  if (
    o3 === 0 &&
    onSegment(
      { x: l2.x1, y: l2.y1 },
      { x: l1.x1, y: l1.y1 },
      { x: l2.x2, y: l2.y2 }
    )
  )
    return true;

  // l2 and l1.x2 are collinear and l1.x2 lies on segment l2
  if (
    o4 === 0 &&
    onSegment(
      { x: l2.x1, y: l2.y1 },
      { x: l1.x2, y: l1.y2 },
      { x: l2.x2, y: l2.y2 }
    )
  )
    return true;

  return false;
};

export const boxBoxCol = (b1: Box, b2: Box): boolean => {
  if (Math.abs(b1.center_x - b2.center_x) > (b1.width + b2.width) / 2)
    return false;

  if (Math.abs(b1.center_y - b2.center_y) > (b1.height + b2.height) / 2)
    return false;

  return true;
};

export const circleLineCol = (c: Circle, l: Line): boolean => {
  const closestPoint = closestPointOnLine(l, { x: c.center_x, y: c.center_y });
  return distance(closestPoint, { x: c.center_x, y: c.center_y }) <= c.radius;
};

export const circleBoxCol = (c: Circle, b: Box): boolean => {
  const closest = {
    x: clamp(c.center_x, b.center_x - b.width / 2, b.center_x + b.width / 2),
    y: clamp(c.center_y, b.center_y - b.height / 2, b.center_y + b.height / 2),
  };

  const diff = {
    x: closest.x - c.center_x,
    y: closest.y - c.center_y,
  };

  const diffLength = Math.sqrt(diff.x * diff.x + diff.y * diff.y);

  return diffLength <= c.radius;
};

export const lineBoxCol = (l: Line, b: Box): boolean => {
  const left: Line = {
    type: "Line",
    id: 0,
    x1: b.center_x - b.width / 2,
    y1: b.center_y - b.height / 2,
    x2: b.center_x - b.width / 2,
    y2: b.center_y + b.height / 2,
  };
  const right: Line = {
    type: "Line",
    id: 0,
    x1: b.center_x + b.width / 2,
    y1: b.center_y - b.height / 2,
    x2: b.center_x + b.width / 2,
    y2: b.center_y + b.height / 2,
  };
  const top: Line = {
    type: "Line",
    id: 0,
    x1: b.center_x - b.width / 2,
    y1: b.center_y - b.height / 2,
    x2: b.center_x + b.width / 2,
    y2: b.center_y - b.height / 2,
  };
  const bottom: Line = {
    type: "Line",
    id: 0,
    x1: b.center_x - b.width / 2,
    y1: b.center_y + b.height / 2,
    x2: b.center_x + b.width / 2,
    y2: b.center_y + b.height / 2,
  };

  if (
    lineLineCol(l, left) ||
    lineLineCol(l, right) ||
    lineLineCol(l, top) ||
    lineLineCol(l, bottom)
  ) {
    return true;
  }

  if (
    pointInsideBox({ x: l.x1, y: l.y1 }, b) ||
    pointInsideBox({ x: l.x2, y: l.y2 }, b)
  ) {
    return true;
  }

  return false;
};

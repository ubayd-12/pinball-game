import * as p5 from "p5";

export type Shape = Circle | Line | Box;

export type Vec2 = {
  x: number;
  y: number;
};

export type Circle = {
  type: "Circle";
  id: number;
  center_x: number;
  center_y: number;
  radius: number;
  velocity?: Vec2; // Optional velocity property
  acceleration?: Vec2;
};

export type Line = {
  type: "Line";
  id: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

export type Box = {
  type: "Box";
  id: number;
  center_x: number;
  center_y: number;
  width: number;
  height: number;
};

export interface Plunger {
  shaft: Box;
  knob: Circle;
  color: string;
}

export interface ColoredBox extends Box {
  color: number;
}

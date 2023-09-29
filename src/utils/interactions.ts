// Author: Ubayd Sharif

// Handle all shape interactions

import { Box, Circle, Line, Vec2 } from "./collision_detection_lib/types";
import {
  circleBoxCol,
  circleCircleCol,
} from "./collision_detection_lib/collision_detection";
import * as p5 from "p5";
import {
  subtract,
  magnitude,
  normalize,
  scale,
  add,
  dot,
  closestPointOnLine,
} from "./collision_detection_lib/vec2_operations";

export const ballBallInteraction = (balls: Circle[]): void => {
  for (let i = 0; i < balls.length; i++) {
    for (let j = i + 1; j < balls.length; j++) {
      const ball1 = balls[i];
      const ball2 = balls[j];

      if (circleCircleCol(ball1, ball2)) {
        // Calc direction vector
        const dir = {
          x: ball2.center_x - ball1.center_x,
          y: ball2.center_y - ball1.center_y,
        };

        // Calc distance between balls as well as any possible overlap
        const dist = Math.sqrt(dir.x * dir.x + dir.y * dir.y);
        const overlap = (ball1.radius + ball2.radius - dist) / 2;

        // Normalize dir vector
        dir.x /= dist;
        dir.y /= dist;

        ball1.center_x -= dir.x * overlap;
        ball1.center_y -= dir.y * overlap;
        ball2.center_x += dir.x * overlap;
        ball2.center_y += dir.y * overlap;

        const v1 = ball1.velocity.x * dir.x + ball1.velocity.y * dir.y;
        const v2 = ball2.velocity.x * dir.x + ball2.velocity.y * dir.y;

        const m1 = 1; // pinballs have equal mass
        const m2 = 1; // pinballs have equal mass
        const cor = 1;

        const new_v1 = (m1 * v1 + m2 * v2 - m2 * (v1 - v2) * cor) / (m1 + m2);
        const new_v2 = (m1 * v1 + m2 * v2 + m1 * (v1 - v2) * cor) / (m1 + m2);

        ball1.velocity.x += dir.x * (new_v1 - v1);
        ball1.velocity.y += dir.y * (new_v1 - v1);
        ball2.velocity.x += dir.x * (new_v2 - v2);
        ball2.velocity.y += dir.y * (new_v2 - v2);
      }
    }
  }
};

export const boundaryBallInteraction = (
  balls: Circle[],
  p: p5,
  func: () => void
) => {
  for (let ball of balls) {
    // Ground
    if (ball.center_y > p.height - ball.radius && ball.velocity.y > 0) {
      ball.velocity.y *= -0.9; // damping
      ball.center_y = p.height - ball.radius; // pinball doesn't sink
    }
    // Ceiling
    if (ball.center_y - ball.radius < 0 && ball.velocity.y < 0) {
      ball.velocity.y *= -0.9; // reverse y with damping
      ball.center_y = ball.radius; // pull ball inside
      func();
    }

    // Right wall
    if (ball.center_x + ball.radius > p.width && ball.velocity.x > 0) {
      ball.velocity.x *= -1;
      ball.center_x = p.width - ball.radius;
    }

    // Left wall
    if (ball.center_x - ball.radius < 0 && ball.velocity.x < 0) {
      ball.velocity.x *= -1;
      ball.center_x = ball.radius;
    }
  }
};

export const ballBoxObstacleInteraction = (
  balls: Circle[],
  obstacles: Box[]
) => {
  for (let ball of balls) {
    for (let obstacle of obstacles) {
      if (circleBoxCol(ball, obstacle)) {
        const left = obstacle.center_x - obstacle.width / 2;
        const right = obstacle.center_x + obstacle.width / 2;
        const top = obstacle.center_y - obstacle.height / 2;
        const bottom = obstacle.center_y + obstacle.height / 2;

        // Vector from box center to ball center
        let vecX = ball.center_x - obstacle.center_x;
        let vecY = ball.center_y - obstacle.center_y;

        // Absolute vector
        let absVecX = Math.abs(vecX);
        let absVecY = Math.abs(vecY);

        // Calculate overlap in x and y directions
        let overlapX = obstacle.width / 2 + ball.radius - absVecX;
        let overlapY = obstacle.height / 2 + ball.radius - absVecY;

        // Check which overlap is smaller
        if (overlapX < overlapY) {
          // Ball collided with the left or right of box
          if (vecX < 0) overlapX = -overlapX; // Ball is on the left side of box
          ball.center_x += overlapX;
          ball.velocity.x *= -0.8; // Reflect ball's velocity in x direction
        } else {
          // Ball collided with the top or bottom of box
          if (vecY < 0) overlapY = -overlapY; // Ball is on the top side of box
          ball.center_y += overlapY;
          ball.velocity.y *= -0.8; // Reflect ball's velocity in y direction
        }
      }
    }
  }
};

export const ballCircleObstacleInteraction = (
  balls: Circle[],
  circleObstacles: Circle[]
) => {
  for (let ball of balls) {
    for (let obstacle of circleObstacles) {
      const ballPosition: Vec2 = { x: ball.center_x, y: ball.center_y };
      const obstaclePosition: Vec2 = {
        x: obstacle.center_x,
        y: obstacle.center_y,
      };

      // Calc distance
      const distanceVector: Vec2 = subtract(ballPosition, obstaclePosition);
      const distance: number = magnitude(distanceVector);

      // Check if distance is less than the sum of the radii
      if (distance < ball.radius + obstacle.radius) {
        // Find overlap if it is there
        const overlap: number = ball.radius + obstacle.radius - distance;

        const normalizedDistanceVector: Vec2 = normalize(distanceVector);

        // Fix collision
        const adjustmentVector: Vec2 = scale(normalizedDistanceVector, overlap);

        // Move ball's pos
        const adjustedBallPosition: Vec2 = add(ballPosition, adjustmentVector);
        ball.center_x = adjustedBallPosition.x;
        ball.center_y = adjustedBallPosition.y;

        // Reflect velocity
        const dotProduct: number = dot(ball.velocity, normalizedDistanceVector);
        const reflectionVector: Vec2 = scale(
          normalizedDistanceVector,
          2 * dotProduct
        );
        ball.velocity = subtract(ball.velocity, reflectionVector);
      }
    }
  }
};

export const ballLineObstacleInteraction = (
  balls: Circle[],
  lineObstacles: Line[]
) => {
  const damping = 0.8;

  for (let ball of balls) {
    for (let line of lineObstacles) {
      // closest point on line to circle center
      const closestPoint = closestPointOnLine(line, {
        x: ball.center_x,
        y: ball.center_y,
      });

      const collisionVector = subtract(
        { x: ball.center_x, y: ball.center_y },
        closestPoint
      );

      // distance is less than the circle radius
      if (magnitude(collisionVector) < ball.radius) {
        const normal = normalize(collisionVector);
        const reflection = subtract(
          ball.velocity,
          scale(normal, 2 * dot(ball.velocity, normal))
        );

        ball.center_x += reflection.x;
        ball.center_y += reflection.y;
        ball.velocity = scale(reflection, damping);
      }
    }
  }
};

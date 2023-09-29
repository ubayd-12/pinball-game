import * as p5 from "p5";
import { ParticleSystem } from "./utils/ParticleSystem/ParticleSystem";
import { Vec2 } from "./utils/collision_detection_lib/types";
import { add } from "./utils/collision_detection_lib/vec2_operations";

import { Howl } from "howler";

import {
  boxObstacles,
  balls,
  circleObstacles,
  lineObstacles,
  plungers,
} from "./shapes";
import {
  ballBallInteraction,
  ballBoxObstacleInteraction,
  boundaryBallInteraction,
  ballCircleObstacleInteraction,
  ballLineObstacleInteraction,
} from "./utils/interactions";
import { AUDIO_BASE64, BG_BASE64, PLANET_BASE64 } from "./utils/contants";

let gravity: Vec2 = { x: 0, y: 0.2 } as Vec2;
let startTime: number;

const playAudio = () => {
  const audioData = "data:audio/mp3;base64," + AUDIO_BASE64;
  const sound = new Howl({
    src: [audioData],
  });
  sound.play();
};

export const sketch = (p: p5) => {
  let system: ParticleSystem;
  let bg: p5.Image;
  let planetImage: p5.Image;

  p.preload = () => {
    planetImage = p.loadImage("data:image/png;base64," + PLANET_BASE64);
    bg = p.loadImage("data:image/png;base64," + BG_BASE64);
  };

  p.setup = () => {
    p.createCanvas(1300, 700);
    startTime = p.millis();
    system = new ParticleSystem(p);
  };

  // broweser forces user interaction to allow sounds so click button when you first load in to hear sounds when ceiling is hit
  document.addEventListener("keydown", () => {
    console.log("Allowing audio");
  });

  p.draw = () => {
    const particleFunc = () => {
      playAudio();
      for (let i = 0; i < 10; i++) {
        system.addParticle(p.createVector(p.width / 2, 50));
      }
    };

    p.background(220);
    p.image(bg, 0, 0, p.width, p.height);
    system.run();
    p.fill(255);
    p.stroke(0);

    // Update ball's velocity and position

    for (let ball of balls) {
      ball.velocity = add(ball.velocity, gravity);
      ball.center_x += ball.velocity.x;
      ball.center_y += ball.velocity.y;
    }

    // Check for ball obstacle collisions (boxes)

    ballBoxObstacleInteraction(balls, boxObstacles);

    // Check for ball obstacle collisions (circles)

    ballCircleObstacleInteraction(balls, circleObstacles);

    // Check for ball obstacle collisions (lines)

    ballLineObstacleInteraction(balls, lineObstacles);

    // check for ball ball collisions

    ballBallInteraction(balls);

    // Check for ball collisions with boundaries (activate particle system when ceiling hit)

    boundaryBallInteraction(balls, p, particleFunc);

    // add plunger as obstacle after .3 of sec after they "shoot out of plunger"

    if (p.millis() - startTime > 300) {
      boxObstacles.push(plungers[0].shaft);
      boxObstacles.push(plungers[1].shaft);
      circleObstacles.push(plungers[0].knob);
      circleObstacles.push(plungers[1].knob);
    }

    // Draw the balls

    for (let ball of balls) {
      p.ellipse(ball.center_x, ball.center_y, ball.radius * 2);
    }

    // Draw the obstacles (boxes)

    for (let obstacle of boxObstacles) {
      p.fill("purple");
      p.rectMode(p.CENTER);
      p.rect(
        obstacle.center_x,
        obstacle.center_y,
        obstacle.width,
        obstacle.height
      );
    }

    // Draw the obstacles (circles)

    for (let obstacle of circleObstacles) {
      const x = obstacle.center_x - obstacle.radius;
      const y = obstacle.center_y - obstacle.radius;
      const d = obstacle.radius * 2;

      p.image(planetImage, x, y, d, d);
    }

    for (let obstacle of lineObstacles) {
      p.stroke(0, 255, 255);
      p.line(obstacle.x1, obstacle.y1, obstacle.x2, obstacle.y2);
      p.stroke(0);
    }

    p.fill("red"); // Set the fill color to red for the plungers

    // Draw plungers

    for (let plunger of plungers) {
      p.fill(plunger.color);
      // Draw plunger shaft
      p.rectMode(p.CENTER);
      p.rect(
        plunger.shaft.center_x,
        plunger.shaft.center_y,
        plunger.shaft.width,
        plunger.shaft.height
      );
      // Draw plunger knob
      p.ellipse(
        plunger.knob.center_x,
        plunger.knob.center_y,
        plunger.knob.radius * 2
      );
    }

    p.fill(255);
  };
};

export const myp5 = new p5(sketch, document.body);

import * as p5 from "p5";

export class Particle {
  position: p5.Vector;
  velocity: p5.Vector;
  acceleration: p5.Vector;
  lifespan: number;
  color: p5.Color; // New color property

  constructor(position: p5.Vector, p: p5) {
    this.position = position.copy();
    this.velocity = p.createVector(p.random(-1, 1), p.random(-1, 1));
    this.acceleration = p.createVector(0, 0.05);
    this.lifespan = 255;

    this.color = p.color(
      p.random(255),
      p.random(255),
      p.random(255),
      this.lifespan
    );
  }

  update(p: p5) {
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.lifespan -= 2;
    this.color.setAlpha(this.lifespan);
  }

  display(p: p5) {
    p.stroke(0, this.lifespan);
    p.fill(this.color);
    p.ellipse(this.position.x, this.position.y, 12, 12);
  }

  isDead() {
    return this.lifespan < 0;
  }
}

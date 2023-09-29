// Credit: Prof Guy's Lecture slides
// Note: Reformated to fit TypeScipt

import * as p5 from "p5";
import { Particle } from "./Particle";

export class ParticleSystem {
  particles: Particle[];
  p: p5;

  constructor(p: p5) {
    this.particles = [];
    this.p = p;
  }

  addParticle(position: p5.Vector) {
    this.particles.push(new Particle(position, this.p));
  }

  run() {
    for (let particle of this.particles) {
      particle.update(this.p);
      particle.display(this.p);
    }

    this.particles = this.particles.filter((p) => !p.isDead());
  }
}

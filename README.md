**Basic Pinball Dynamics:** Balls were simulated to fall and accelerate due to gravity, with each ball naturally interacting with obstacles, bouncing off as it descends. This was achieved by updating each ball's velocity and position during each iteration of the game loop, incorporating gravitational acceleration.

**Multiple Balls Interacting:** Multiple balls, each responding to gravity, bounce off obstacles and each other with no penetration or missed collisions. The `ballBallInteraction` function handles the detection and resolution of collisions between balls, ensuring smooth and natural interactions.

**Circular Obstacles:** Circular obstacles were added to engage with the balls smoothly. The `ballCircleObstacleInteraction` function was utilized to detect and resolve collisions between balls and circular obstacles, providing a natural bouncing effect.

**Line-Segment and/or Polygonal Obstacles:** Line-segment obstacles interact with the balls, offering smooth reflections and variety. This was implemented using the `ballLineObstacleInteraction` function, which checks for collisions between balls and line-segment obstacles and adjusts ball velocities accordingly.

**Particle System Effects:** Particle effects highlight special ball-triggered events with dynamic visual feedback. A `ParticleSystem` class was designed to create and manage particle effects, which are triggered by specific ball interactions, as identified within the game loop.

**Plunger/Launcher to shoot balls:** Plungers launch balls with calculated initial velocity and trajectory for authentic motion. Plungers were modeled as composed of shaft and knob parts, with their motion and interactions handled by specific functions within the code.

**Textured Background:** A textured background enhances the visual appeal, with the texture complementing obstacle placement. The background texture is loaded using the `p.loadImage` function and drawn to the canvas during each iteration of the draw loop.

**Textured Obstacles:** Textured obstacles provide visual variety and thematic consistency in the environment. Textures for obstacles are loaded and applied to specific obstacles, utilizing the p5.js library's image-handling functionality.

**Sound Effects:** Sound effects, integrated for specific ball interactions, provide immediate, immersive feedback. The `Howl` object from the `howler.js` library was used to load and play sound effects in response to specific triggers identified in the game loop.

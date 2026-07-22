/* ============================================
   墨韵学堂 · Three.js 水墨粒子系统
   Ink Particle Physics Simulation
   ============================================ */

(function() {
  'use strict';

  const canvas = document.getElementById('inkCanvas');
  if (!canvas) return;

  // Guard: ensure Three.js loaded
  if (typeof THREE === 'undefined') {
    console.warn('Three.js not loaded — ink canvas disabled');
    canvas.style.display = 'none';
    return;
  }

  try {

  // Scene setup
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 50;

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  // Particle configuration
  const PARTICLE_COUNT = 4000;
  const INK_COLOR = new THREE.Color(0x1A1A1A);
  const ACCENT_COLOR = new THREE.Color(0xC8441C);

  // Geometry
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const velocities = new Float32Array(PARTICLE_COUNT * 3);
  const opacities = new Float32Array(PARTICLE_COUNT);
  const sizes = new Float32Array(PARTICLE_COUNT);
  const colors = new Float32Array(PARTICLE_COUNT * 3);
  const phases = new Float32Array(PARTICLE_COUNT);

  // Initialize particles in a scattered pattern
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const i3 = i * 3;

    // Spread across the canvas
    positions[i3]     = (Math.random() - 0.5) * 100;
    positions[i3 + 1] = (Math.random() - 0.5) * 60;
    positions[i3 + 2] = (Math.random() - 0.5) * 30;

    // Slow initial velocities
    velocities[i3]     = (Math.random() - 0.5) * 0.02;
    velocities[i3 + 1] = (Math.random() - 0.5) * 0.02;
    velocities[i3 + 2] = (Math.random() - 0.5) * 0.01;

    // Varying sizes (ink droplets)
    sizes[i] = Math.random() * 3 + 0.5;

    // Opacities
    opacities[i] = Math.random() * 0.4 + 0.1;

    // Phase offset for animation
    phases[i] = Math.random() * Math.PI * 2;

    // Mix between ink black and vermilion (mostly ink)
    const mixFactor = Math.random();
    if (mixFactor > 0.92) {
      colors[i3]     = ACCENT_COLOR.r;
      colors[i3 + 1] = ACCENT_COLOR.g;
      colors[i3 + 2] = ACCENT_COLOR.b;
    } else {
      const shade = 0.1 + Math.random() * 0.15;
      colors[i3]     = shade;
      colors[i3 + 1] = shade;
      colors[i3 + 2] = shade;
    }
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('aOpacity', new THREE.BufferAttribute(opacities, 1));
  geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));

  // Shader material for ink particles
  const vertexShader = `
    attribute float aOpacity;
    attribute float aSize;
    attribute float aPhase;
    varying float vOpacity;
    varying vec3 vColor;
    uniform float uTime;

    void main() {
      vOpacity = aOpacity;
      vColor = color;

      // Gentle floating motion
      vec3 pos = position;
      pos.x += sin(uTime * 0.3 + aPhase) * 0.8;
      pos.y += cos(uTime * 0.2 + aPhase * 1.3) * 0.6;
      pos.z += sin(uTime * 0.15 + aPhase * 0.7) * 0.3;

      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      gl_PointSize = aSize * (300.0 / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
    }
  `;

  const fragmentShader = `
    varying float vOpacity;
    varying vec3 vColor;
    uniform float uTime;

    void main() {
      // Soft circular particle with ink bleed effect
      vec2 center = gl_PointCoord - 0.5;
      float dist = length(center);

      // Sharp core, soft edge — like ink on paper
      float core = smoothstep(0.5, 0.15, dist);
      float bleed = smoothstep(0.5, 0.4, dist) * 0.3;

      float alpha = (core + bleed) * vOpacity;

      // Subtle time-based opacity pulse
      alpha *= 0.8 + 0.2 * sin(uTime * 0.5);

      gl_FragColor = vec4(vColor, alpha);
    }
  `;

  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uTime: { value: 0 }
    },
    transparent: true,
    depthWrite: false,
    vertexColors: true,
    blending: THREE.NormalBlending
  });

  const particles = new THREE.Points(geometry, material);
  scene.add(particles);

  // Ink splatter effect — burst of particles
  const splatters = [];

  function createSplatter(x, y) {
    const count = 30 + Math.floor(Math.random() * 40);
    const splatterGeo = new THREE.BufferGeometry();
    const splatPos = new Float32Array(count * 3);
    const splatVel = [];
    const splatSizes = new Float32Array(count);
    const splatOpacities = new Float32Array(count);
    const splatColors = new Float32Array(count * 3);

    // Convert screen coords to 3D
    const vec = new THREE.Vector3(
      (x / window.innerWidth) * 2 - 1,
      -(y / window.innerHeight) * 2 + 1,
      0
    );
    vec.unproject(camera);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      splatPos[i3]     = vec.x + (Math.random() - 0.5) * 2;
      splatPos[i3 + 1] = vec.y + (Math.random() - 0.5) * 2;
      splatPos[i3 + 2] = vec.z;

      // Radial velocity from center
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 0.5 + 0.2;
      splatVel.push({
        x: Math.cos(angle) * speed,
        y: Math.sin(angle) * speed - 0.1, // slight upward bias
        z: (Math.random() - 0.5) * 0.1
      });

      splatSizes[i] = Math.random() * 4 + 1;
      splatOpacities[i] = Math.random() * 0.6 + 0.3;

      // Mostly dark ink, some vermilion
      if (Math.random() > 0.85) {
        splatColors[i3] = ACCENT_COLOR.r;
        splatColors[i3+1] = ACCENT_COLOR.g;
        splatColors[i3+2] = ACCENT_COLOR.b;
      } else {
        const shade = 0.08 + Math.random() * 0.12;
        splatColors[i3] = shade;
        splatColors[i3+1] = shade;
        splatColors[i3+2] = shade;
      }
    }

    splatterGeo.setAttribute('position', new THREE.BufferAttribute(splatPos, 3));
    splatterGeo.setAttribute('aSize', new THREE.BufferAttribute(splatSizes, 1));
    splatterGeo.setAttribute('aOpacity', new THREE.BufferAttribute(splatOpacities, 1));
    splatterGeo.setAttribute('color', new THREE.BufferAttribute(splatColors, 3));

    const splatMat = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: { uTime: { value: 0 } },
      transparent: true,
      depthWrite: false,
      vertexColors: true,
      blending: THREE.NormalBlending
    });

    const splatPoints = new THREE.Points(splatterGeo, splatMat);
    scene.add(splatPoints);

    splatters.push({
      points: splatPoints,
      velocities: splatVel,
      life: 1.0,
      decay: 0.008 + Math.random() * 0.005
    });
  }

  // Mouse interaction
  let mouseDown = false;
  let lastMouseTime = 0;

  canvas.addEventListener('mousedown', (e) => {
    mouseDown = true;
    createSplatter(e.clientX, e.clientY);
  });

  canvas.addEventListener('mouseup', () => { mouseDown = false; });

  canvas.addEventListener('mousemove', (e) => {
    if (mouseDown) {
      const now = Date.now();
      if (now - lastMouseTime > 100) {
        createSplatter(e.clientX, e.clientY);
        lastMouseTime = now;
      }
    }

    // Subtle particle repulsion from mouse
    const mx = ((e.clientX / window.innerWidth) * 2 - 1) * 50;
    const my = (-(e.clientY / window.innerHeight) * 2 + 1) * 30;
    const posAttr = geometry.getAttribute('position');
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const px = posAttr.getX(i);
      const py = posAttr.getY(i);
      const dx = px - mx;
      const dy = py - my;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 15) {
        const force = (15 - dist) / 15 * 0.05;
        velocities[i * 3]     += (dx / dist) * force;
        velocities[i * 3 + 1] += (dy / dist) * force;
      }
    }
  });

  // Touch support
  canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const t = e.touches[0];
    createSplatter(t.clientX, t.clientY);
  }, { passive: false });

  canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const t = e.touches[0];
    const mx = ((t.clientX / window.innerWidth) * 2 - 1) * 50;
    const my = (-(t.clientY / window.innerHeight) * 2 + 1) * 30;
    const posAttr = geometry.getAttribute('position');
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const px = posAttr.getX(i);
      const py = posAttr.getY(i);
      const dx = px - mx;
      const dy = py - my;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 15) {
        const force = (15 - dist) / 15 * 0.05;
        velocities[i * 3]     += (dx / dist) * force;
        velocities[i * 3 + 1] += (dy / dist) * force;
      }
    }
  }, { passive: false });

  // Animation loop
  let time = 0;
  const DAMPING = 0.96;
  const GRAVITY = -0.003;

  function animate() {
    requestAnimationFrame(animate);
    time += 0.016;
    material.uniforms.uTime.value = time;

    // Update main particles
    const posAttr = geometry.getAttribute('position');
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;

      // Apply gravity
      velocities[i3 + 1] += GRAVITY;

      // Apply damping
      velocities[i3]     *= DAMPING;
      velocities[i3 + 1] *= DAMPING;
      velocities[i3 + 2] *= DAMPING;

      // Gentle drift
      velocities[i3]     += Math.sin(time * 0.5 + phases[i]) * 0.0003;
      velocities[i3 + 1] += Math.cos(time * 0.3 + phases[i] * 1.3) * 0.0002;

      // Update position
      posAttr.setX(i, posAttr.getX(i) + velocities[i3]);
      posAttr.setY(i, posAttr.getY(i) + velocities[i3 + 1]);
      posAttr.setZ(i, posAttr.getZ(i) + velocities[i3 + 2]);

      // Boundary wrapping
      if (posAttr.getX(i) > 60) posAttr.setX(i, -60);
      if (posAttr.getX(i) < -60) posAttr.setX(i, 60);
      if (posAttr.getY(i) > 40) posAttr.setY(i, -40);
      if (posAttr.getY(i) < -40) posAttr.setY(i, 40);
    }
    posAttr.needsUpdate = true;

    // Update splatters
    for (let s = splatters.length - 1; s >= 0; s--) {
      const splat = splatters[s];
      splat.life -= splat.decay;

      if (splat.life <= 0) {
        scene.remove(splat.points);
        splat.points.geometry.dispose();
        splat.points.material.dispose();
        splatters.splice(s, 1);
        continue;
      }

      // Update splatter particle positions
      const splatPos = splat.points.geometry.getAttribute('position');
      for (let i = 0; i < splatPos.count; i++) {
        const sv = splat.velocities[i];
        splatPos.setX(i, splatPos.getX(i) + sv.x);
        splatPos.setY(i, splatPos.getY(i) + sv.y);
        splatPos.setZ(i, splatPos.getZ(i) + sv.z);

        // Gravity on splatter
        sv.y -= 0.01;
        // Damping
        sv.x *= 0.97;
        sv.y *= 0.97;
        sv.z *= 0.97;
      }
      splatPos.needsUpdate = true;

      // Fade opacity
      splat.points.material.uniforms.uTime.value = time;
      const opacAttr = splat.points.geometry.getAttribute('aOpacity');
      for (let i = 0; i < opacAttr.count; i++) {
        opacAttr.setX(i, opacAttr.getX(i) * 0.995);
      }
      opacAttr.needsUpdate = true;
    }

    // Gentle camera sway
    camera.position.x = Math.sin(time * 0.1) * 2;
    camera.position.y = Math.cos(time * 0.08) * 1;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }

  animate();

  // Resize handler
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });

  // Parallax on scroll
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const heroHeight = document.querySelector('.hero')?.offsetHeight || window.innerHeight;
    if (scrollY < heroHeight) {
      const progress = scrollY / heroHeight;
      camera.position.z = 50 + progress * 20;
      material.uniforms.uTime.value = time;
      // Fade particles as user scrolls past hero
      const opacity = 1 - progress;
      canvas.style.opacity = Math.max(0, opacity);
    }
  });

  } catch (err) {
    console.warn('Three.js ink system error:', err);
    canvas.style.display = 'none';
  }

})();

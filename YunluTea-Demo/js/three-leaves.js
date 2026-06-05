/**
 * 云露茶事 · Yunlu Tea — Process Section 3D Falling Leaves
 * Realistic tea leaf shapes with bezier curves + gentle falling animation
 */
(function () {
  'use strict';

  var container = document.getElementById('processCanvas');
  if (!container) return;
  if (typeof THREE === 'undefined') return;

  var w = container.clientWidth;
  var h = container.clientHeight;
  if (w === 0 || h === 0) return;

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 100);
  camera.position.z = 10;

  var renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(w, h);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);

  // ---------- Realistic Leaf Shape (bezier curves) ----------
  function createLeafGeometry() {
    var shape = new THREE.Shape();
    // Start at tip (top)
    shape.moveTo(0, 0.7);
    // Right edge — gentle outward curve, then taper to stem
    shape.bezierCurveTo(0.35, 0.45, 0.42, 0.05, 0.08, -0.65);
    // Bottom stem curve
    shape.bezierCurveTo(0.03, -0.7, -0.03, -0.7, -0.08, -0.65);
    // Left edge — mirror
    shape.bezierCurveTo(-0.42, 0.05, -0.35, 0.45, 0, 0.7);

    var geom = new THREE.ShapeGeometry(shape);

    // Add mid-vein line (thin elongated rectangle)
    var vein = new THREE.Shape();
    vein.moveTo(0, 0.68);
    vein.lineTo(0.02, 0.68);
    vein.lineTo(0.01, -0.63);
    vein.lineTo(-0.01, -0.63);
    vein.lineTo(-0.02, 0.68);

    // We'll create the vein as a separate darker mesh later
    return geom;
  }

  var leafGeom = createLeafGeometry();
  var veinGeom = (function () {
    var s = new THREE.Shape();
    s.moveTo(0, 0.66);
    s.bezierCurveTo(0.015, 0.2, 0.01, -0.2, 0, -0.63);
    s.bezierCurveTo(-0.01, -0.2, -0.015, 0.2, 0, 0.66);
    return new THREE.ShapeGeometry(s);
  })();

  var leafColors = [0x8B6914, 0x2D4A22, 0x4A6E3E, 0xA0792C, 0x6B8E3A, 0x3D6B35];
  var leaves = [];

  for (var i = 0; i < 18; i++) {
    var group = new THREE.Group();

    // Main leaf body
    var color = leafColors[Math.floor(Math.random() * leafColors.length)];
    var leafMat = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.3 + Math.random() * 0.3,
      side: THREE.DoubleSide,
    });
    var leafMesh = new THREE.Mesh(leafGeom, leafMat);
    group.add(leafMesh);

    // Darker mid-vein
    var veinMat = new THREE.MeshBasicMaterial({
      color: 0x1a1a0a,
      transparent: true,
      opacity: 0.08 + Math.random() * 0.06,
      side: THREE.DoubleSide,
    });
    var veinMesh = new THREE.Mesh(veinGeom, veinMat);
    veinMesh.position.z = 0.002;
    group.add(veinMesh);

    group.position.set(
      (Math.random() - 0.5) * 14,
      (Math.random() - 0.5) * 10,
      Math.random() * 4 - 2
    );
    group.rotation.set(
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2
    );

    // Falling physics
    group.userData = {
      speed: 0.2 + Math.random() * 0.6,
      rx: (Math.random() - 0.5) * 0.006,
      ry: (Math.random() - 0.5) * 0.01,
      rz: (Math.random() - 0.5) * 0.005,
      sway: 0.4 + Math.random() * 1.0,
      swaySpeed: 0.3 + Math.random() * 0.5,
      fallAmp: 0.5 + Math.random() * 1.2,
      offset: Math.random() * Math.PI * 2,
      baseX: group.position.x,
      baseY: group.position.y,
    };

    scene.add(group);
    leaves.push(group);
  }

  // ---------- Animate (gentle falling + side sway) ----------
  var clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    var t = clock.getElapsedTime();

    for (var i = 0; i < leaves.length; i++) {
      var g = leaves[i];
      var d = g.userData;

      // Vertical float (like falling slowly)
      g.position.y = d.baseY + Math.sin(t * d.speed + d.offset) * d.fallAmp;

      // Horizontal sway (like wind)
      g.position.x = d.baseX + Math.cos(t * d.swaySpeed + d.offset) * d.sway;

      // Continuous gentle rotation
      g.rotation.x += d.rx;
      g.rotation.y += d.ry;
      g.rotation.z += d.rz;

      // Keep z within bounds
      if (g.position.z > 2) g.position.z = -2;
      g.position.z += Math.sin(t * 0.2 + d.offset) * 0.005;
    }

    renderer.render(scene, camera);
  }
  animate();

  // ---------- Resize ----------
  window.addEventListener('resize', function () {
    if (!container) return;
    var nw = container.clientWidth;
    var nh = container.clientHeight;
    if (nw === 0 || nh === 0) return;
    camera.aspect = nw / nh;
    camera.updateProjectionMatrix();
    renderer.setSize(nw, nh);
  });
})();

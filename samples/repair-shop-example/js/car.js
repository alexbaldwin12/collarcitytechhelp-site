/* Interactive 3D car (three.js r170, self-hosted). Loaded only when the stage nears the viewport.
   Model: "Car Concept" (Khronos glTF-Sample-Assets, CC BY 4.0, see assets/CREDITS.md), optimised and logo-free. It has separate nodes for wheels, tyres,
   brake discs and pads, glass, interior, and a simplified engine. Suspension / battery / fluids are NOT modelled, so those hotspots sit on the body and
   a clearly illustrative "x-ray" overlay (amber outlines) shows roughly where they live. */
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export async function start(stageEl, canvasHost, hotsEl, onPick, onReady) {
  const W = () => stageEl.clientWidth, H = () => stageEl.clientHeight;
  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  renderer.setSize(W(), H());
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.0;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const cv = renderer.domElement; cv.setAttribute('aria-label', 'Interactive 3D car. Drag to turn it, use the buttons to zoom. Part buttons are listed beside it.');
  cv.tabIndex = 0; canvasHost.appendChild(cv);
  const scene = new THREE.Scene(); scene.background = new THREE.Color(0x0c0d0f); scene.fog = new THREE.Fog(0x0c0d0f, 9, 22);
  const cam = new THREE.PerspectiveCamera(36, W() / H(), 0.05, 60);
  const pm = new THREE.PMREMGenerator(renderer);
  const envTex = await new Promise((r, j) => new THREE.TextureLoader().load('assets/env.jpg', r, undefined, j));
  envTex.mapping = THREE.EquirectangularReflectionMapping; envTex.colorSpace = THREE.SRGBColorSpace;
  scene.environment = pm.fromEquirectangular(envTex).texture; scene.environmentIntensity = 0.9;
  // floor with soft reflection
  const floor = new THREE.Mesh(new THREE.CircleGeometry(14, 64), new THREE.MeshPhysicalMaterial({ color: 0x15171a, roughness: .4, metalness: .1, clearcoat: .6, clearcoatRoughness: .4, transparent: true, opacity: .86 }));
  floor.rotation.x = -Math.PI / 2; floor.position.y = -.002; scene.add(floor);
  const ring = new THREE.Mesh(new THREE.RingGeometry(3.25, 3.29, 96), new THREE.MeshBasicMaterial({ color: 0xf0a83a, transparent: true, opacity: .55 }));
  ring.rotation.x = -Math.PI / 2; ring.position.y = .004; scene.add(ring);
  const k = new THREE.SpotLight(0xfff0dc, 40, 24, .7, .8, 1.6); k.position.set(2, 7, 3); scene.add(k);
  const k2 = new THREE.SpotLight(0xf0a83a, 40, 24, .8, .9, 1.6); k2.position.set(-4, 3, -4); scene.add(k2);
  scene.add(new THREE.HemisphereLight(0x8aa0c0, 0x0a0a0a, .35));

  // model
  const dr = new DRACOLoader(); dr.setDecoderPath('vendor/draco/');
  const gl = new GLTFLoader(); gl.setDRACOLoader(dr);
  const gltf = await gl.loadAsync('models/car.glb');
  const car = gltf.scene;                       // nose toward +Z already
  const shell = [];                              // paint and glass: go ghostly in x-ray
  car.traverse(o => {
    if (!o.isMesh) return;
    const n = o.material.name || '';
    if (/^Paint /.test(n)) { o.material = o.material.clone(); o.material.userData.o = o.material.opacity; shell.push(o.material); }
    if (n === 'Glass') { o.material.userData.o = 1; shell.push(o.material); }
  });
  const uniq = [...new Set(shell)];
  scene.add(car); car.updateMatrixWorld(true);
  const bb = new THREE.Box3().setFromObject(car);
  const sc = 4.5 / Math.max(bb.getSize(new THREE.Vector3()).x, bb.getSize(new THREE.Vector3()).z);
  car.scale.setScalar(sc); car.updateMatrixWorld(true);
  const b2 = new THREE.Box3().setFromObject(car), c2 = b2.getCenter(new THREE.Vector3());
  car.position.x -= c2.x; car.position.z -= c2.z; car.position.y -= b2.min.y; car.updateMatrixWorld(true);
  const mirror = car.clone(true); mirror.scale.y *= -1; mirror.position.y = -.004; scene.add(mirror);
  // model-space coordinates (metres, nose +Z, +X is the car's left) mapped into the scaled, centred scene
  const L = (x, y, z) => car.localToWorld(new THREE.Vector3(x, y, z));
  const nodeCtr = (name) => { const o = car.getObjectByName(name); return o ? new THREE.Box3().setFromObject(o).getCenter(new THREE.Vector3()) : null; };
  const wf = nodeCtr('WheelFrontL') || L(.97, .38, 1.49), wr = nodeCtr('WheelRearL') || L(.97, .38, -1.31);
  const disc = nodeCtr('WheelFrontLBrakeDisc') || wf;

  // ghost overlay (illustrative, amber outlines): the model has a simplified engine, nothing else under the skin
  const ghost = new THREE.Group(); ghost.visible = false; scene.add(ghost);
  const lineM = new THREE.LineBasicMaterial({ color: 0xf0a83a, transparent: true, opacity: .95, depthTest: false });
  const fillM = new THREE.MeshBasicMaterial({ color: 0xf0a83a, transparent: true, opacity: .12, depthTest: false });
  const gparts = {};
  function ghostBox(id, w, h, dp, p, shape) {
    const g = shape === 'cyl' ? new THREE.CylinderGeometry(w, w, h, 20) : new THREE.BoxGeometry(w, h, dp);
    const m = new THREE.Mesh(g, fillM); const l = new THREE.LineSegments(new THREE.EdgesGeometry(g), lineM);
    const grp = new THREE.Group(); grp.add(m, l); grp.position.copy(p); grp.renderOrder = 10; m.renderOrder = l.renderOrder = 10; ghost.add(grp); (gparts[id] = gparts[id] || []).push(grp); return grp;
  }
  ghostBox('engine', .78, .5, .72, L(0, .46, 1.95));                       // engine bay block
  ghostBox('battery', .34, .24, .22, L(-.62, .56, 2.12));                   // battery, front corner
  ghostBox('oil', .1, .26, 0, L(.5, .5, 2.08), 'cyl'); ghostBox('oil', .18, .12, .3, L(.42, .26, 1.7)); // filter and oil pan
  [wf, wr, new THREE.Vector3(-wf.x, wf.y, wf.z), new THREE.Vector3(-wr.x, wr.y, wr.z)].forEach(w => ghostBox('suspension', .06, .5, 0, new THREE.Vector3(w.x * .9, w.y + .42, w.z), 'cyl'));
  const gm = ghost.children;

  // hotspots (positions from node boxes + estimates; normals hide hotspots on the far side)
  const HS = {
    brakes: { p: disc.clone().add(new THREE.Vector3(.12, 0, 0)), n: [1, 0, 0], x: false, cam: [3.4, .8, 3.9], tg: [wf.x, .4, wf.z] },
    tires: { p: new THREE.Vector3(wr.x + .1, wr.y + .3, wr.z), n: [1, .3, 0], x: false, cam: [3.7, .9, -3.2], tg: [wr.x, .38, wr.z] },
    suspension: { p: new THREE.Vector3(wf.x * .92, wf.y + .46, wf.z), n: [1, .6, 0], x: true, cam: [3.4, 1.1, 3.4], tg: [wf.x * .8, .5, wf.z] },
    engine: { p: L(0, .9, 1.75), n: [0, 1, .3], x: true, cam: [-2.2, 2.4, 5.0], tg: [0, .5, L(0, 0, 1.9).z] },
    oil: { p: L(.55, .86, 2.12), n: [1, .6, .3], x: true, cam: [3.2, 1.5, 4.8], tg: [.3, .4, L(0, 0, 1.9).z] },
    battery: { p: L(-.6, .86, 2.2), n: [-1, .6, .3], x: true, cam: [-3.3, 1.6, 4.6], tg: [-.4, .45, L(0, 0, 2).z] }
  };
  const LBL = { brakes: 'Brakes', tires: 'Tires', suspension: 'Suspension', engine: 'Engine', oil: 'Oil and fluids', battery: 'Battery' };
  const hotEls = {};
  Object.keys(HS).forEach(id => {
    const b = document.createElement('button'); b.type = 'button'; b.className = 'hot'; b.setAttribute('aria-label', LBL[id] + ': show service details'); b.setAttribute('aria-pressed', 'false');
    b.innerHTML = '<span>' + LBL[id] + '</span>'; b.addEventListener('click', () => onPick(id, true)); hotsEl.appendChild(b); hotEls[id] = b;
  });

  // controls
  const ctl = new OrbitControls(cam, cv);
  cv.style.touchAction = 'pan-y';               // vertical swipes still scroll the page; horizontal swipes turn the car
  ctl.enableDamping = true; ctl.dampingFactor = .08; ctl.enablePan = false; ctl.minDistance = 2.4; ctl.maxDistance = 9; ctl.maxPolarAngle = Math.PI / 2 - .02; ctl.minPolarAngle = .2;
  ctl.enableZoom = false; ctl.autoRotate = true; ctl.autoRotateSpeed = .8; ctl.listenToKeyEvents(cv);
  ctl.touches = { ONE: THREE.TOUCH.ROTATE, TWO: THREE.TOUCH.DOLLY_ROTATE };
  const HOME = { p: new THREE.Vector3(3.9, 1.35, 4.4), t: new THREE.Vector3(0, .5, 0) };
  cam.position.copy(HOME.p); ctl.target.copy(HOME.t); ctl.update();
  const EYE = L(0, .95, .35);
  let tween = null, cabin = false, xray = false, active = false, visible = false, sel = null;
  const reduced = document.documentElement.classList.contains('rm');
  if (reduced) ctl.autoRotate = false;
  cv.addEventListener('pointerdown', () => { ctl.autoRotate = false; active = true; ctl.enableZoom = !cabin; });
  cv.addEventListener('blur', () => { ctl.enableZoom = false; });
  cv.addEventListener('pointerleave', () => { ctl.enableZoom = false; });
  cv.addEventListener('wheel', e => { if (e.ctrlKey) { ctl.enableZoom = true; } }, { passive: true });

  function flyTo(p, t, ms = 1100) {
    if (reduced) { cam.position.copy(p); ctl.target.copy(t); ctl.update(); need(); return; }
    tween = { t0: performance.now(), ms, p0: cam.position.clone(), t0v: ctl.target.clone(), p1: p.clone(), t1: t.clone() };
  }
  const ease = x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  function setXray(on) {
    xray = on; ghost.visible = on;
    uniq.forEach(m => { m.transparent = on; m.opacity = on ? .2 : 1; m.depthWrite = !on; if ('transmission' in m && m.name === 'Glass') m.transmission = on ? 0 : 1; m.needsUpdate = true; }); need();
  }
  function enterCabin() {
    cabin = true; setXray(false); ctl.autoRotate = false; ctl.enableZoom = false;
    const eye = EYE.clone();  // seat position, looking toward the nose
    ctl.minDistance = ctl.maxDistance = .02; cam.near = .02; cam.fov = 70; cam.updateProjectionMatrix();
    ctl.rotateSpeed = -.45; ctl.maxPolarAngle = Math.PI * .85; ctl.minPolarAngle = .35;
    ctl.target.copy(eye.clone().add(new THREE.Vector3(0, -.012, .02))); cam.position.copy(eye);
    cam.position.z -= .02; ctl.update(); need();
  }
  function exitCabin() {
    if (!cabin) return; cabin = false;
    ctl.minDistance = 2.4; ctl.maxDistance = 9; ctl.rotateSpeed = 1; ctl.maxPolarAngle = Math.PI / 2 - .02; ctl.minPolarAngle = .2; cam.near = .05; cam.fov = 36; cam.updateProjectionMatrix();
    cam.position.copy(HOME.p); ctl.target.copy(HOME.t); ctl.update();
  }
  function focus(id) {
    exitCabin(); sel = id;
    Object.keys(hotEls).forEach(k => hotEls[k].setAttribute('aria-pressed', String(k === id)));
    const h = HS[id]; if (!h) return;
    setXray(h.x); ctl.autoRotate = false;
    gm.forEach(g => { g.visible = false; }); (gparts[id] || []).forEach(g => { g.visible = true; });
    flyTo(new THREE.Vector3(...h.cam), new THREE.Vector3(...h.tg));
  }
  function reset() { exitCabin(); sel = null; setXray(false); Object.values(hotEls).forEach(b => b.setAttribute('aria-pressed', 'false')); flyTo(HOME.p, HOME.t); }
  function zoom(f) { if (cabin) return; const v = cam.position.clone().sub(ctl.target); const len = Math.min(ctl.maxDistance, Math.max(ctl.minDistance, v.length() * f)); v.setLength(len); flyTo(ctl.target.clone().add(v), ctl.target.clone(), 350); }

  // render loop only while on screen
  let raf = 0, dirty = true;
  function need() { dirty = true; }
  ctl.addEventListener('change', need);
  const tmp = new THREE.Vector3(), nv = new THREE.Vector3(), dv = new THREE.Vector3();
  function frame(now) {
    raf = visible ? requestAnimationFrame(frame) : 0;
    if (tween) { const k = Math.min(1, (now - tween.t0) / tween.ms), e = ease(k); cam.position.lerpVectors(tween.p0, tween.p1, e); ctl.target.lerpVectors(tween.t0v, tween.t1, e); if (k >= 1) tween = null; dirty = true; }
    const moved = ctl.update();
    if (moved || dirty || ctl.autoRotate) {
      dirty = false; renderer.render(scene, cam);
      const w = W(), h = H();
      for (const id in HS) {
        const hs = HS[id], b = hotEls[id];
        if (cabin) { b.classList.add('hide'); continue; }
        tmp.copy(hs.p).project(cam);
        nv.set(...hs.n).normalize(); dv.copy(cam.position).sub(hs.p).normalize();
        const front = nv.dot(dv) > .0 || xray;
        b.classList.toggle('hide', !front || tmp.z > 1);
        b.style.transform = 'translate(' + ((tmp.x * .5 + .5) * w) + 'px,' + ((-tmp.y * .5 + .5) * h) + 'px)';
      }
    }
  }
  function resize() { cam.aspect = W() / H(); cam.updateProjectionMatrix(); renderer.setSize(W(), H()); need(); }
  new ResizeObserver(resize).observe(stageEl);
  new IntersectionObserver(es => { visible = es[0].isIntersecting; if (visible && !raf) raf = requestAnimationFrame(frame); }, { rootMargin: '100px' }).observe(stageEl);
  document.addEventListener('visibilitychange', () => { if (document.hidden) visible = false; });
  onReady();
  return { focus, reset, zoom, cabin: () => { if (cabin) { reset(); return false; } enterCabin(); return true; }, xray: () => { setXray(!xray); return xray; }, isCabin: () => cabin, hotEls };
}

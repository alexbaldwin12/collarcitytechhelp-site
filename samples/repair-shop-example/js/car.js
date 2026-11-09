/* Interactive 3D car (three.js r170, self-hosted). Loaded only when the stage nears the viewport.
   Model: "Ferrari 458 Italia" by vicent091036 (see assets/CREDITS.md). It has separate nodes for wheels, tyres, brakes, glass, interior.
   Engine / suspension / battery / fluids are NOT modelled inside the car, so those hotspots are placed on the body and
   a clearly illustrative "x-ray" overlay (amber outlines) shows roughly where the parts live. */
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
  const gltf = await gl.loadAsync('models/coupe.glb');
  const car = gltf.scene; car.rotation.y = Math.PI; // nose toward +Z
  const mats = {
    body: new THREE.MeshPhysicalMaterial({ color: 0xc9ccd0, metalness: 1, roughness: .42, clearcoat: 1, clearcoatRoughness: .03 }),
    detail: new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 1, roughness: .5 }),
    glass: new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: .25, roughness: 0, transmission: 1 })
  };
  const swap = { Body_Color: mats.body, metal_gray: mats.detail, metal_chrome: mats.detail, Glass_Gray: mats.glass };
  const shell = []; // materials that go ghostly in x-ray
  car.traverse(o => { if (o.isMesh) { if (swap[o.material.name]) o.material = swap[o.material.name]; } });
  scene.add(car); car.updateMatrixWorld(true);
  const bb = new THREE.Box3().setFromObject(car), c0 = bb.getCenter(new THREE.Vector3());
  const sc = 4.5 / Math.max(bb.getSize(new THREE.Vector3()).x, bb.getSize(new THREE.Vector3()).z);
  car.scale.setScalar(sc); car.updateMatrixWorld(true);
  const b2 = new THREE.Box3().setFromObject(car), c2 = b2.getCenter(new THREE.Vector3());
  car.position.x -= c2.x; car.position.z -= c2.z; car.position.y -= b2.min.y; car.updateMatrixWorld(true);
  const mirror = car.clone(true); mirror.scale.y *= -1; mirror.position.y = -.004; scene.add(mirror);
  mirror.traverse(o => { if (o.isMesh && !(o.material.name in swap)) { /* shares materials */ } });
  [mats.body, mats.glass].forEach(m => { m.userData.o = m.opacity; });
  const nodeBox = (pred) => { const b = new THREE.Box3(); let any = false; car.traverse(o => { if (pred(o)) { b.expandByObject(o); any = true; } }); return any ? b : null; };
  const wheels = {}; car.traverse(o => { if (/^wheel_(fl|fr|rl|rr)$/.test(o.name)) { wheels[o.name] = new THREE.Box3().setFromObject(o).getCenter(new THREE.Vector3()); } });
  // a wheel on the +x side, front and rear (nose is +z)
  const pickSide = (front) => Object.values(wheels).filter(w => w.x > 0 && (front ? w.z > 0 : w.z < 0))[0] || new THREE.Vector3(.82, .36, front ? 1.15 : -1.48);
  const wf = pickSide(true), wr = pickSide(false);

  // ghost overlay (illustrative, amber outlines)
  const ghost = new THREE.Group(); ghost.visible = false; scene.add(ghost);
  const lineM = new THREE.LineBasicMaterial({ color: 0xf0a83a, transparent: true, opacity: .95, depthTest: false });
  const fillM = new THREE.MeshBasicMaterial({ color: 0xf0a83a, transparent: true, opacity: .12, depthTest: false });
  const gparts = {};
  function ghostBox(id, w, h, dp, x, y, z, shape) {
    const g = shape === 'cyl' ? new THREE.CylinderGeometry(w, w, h, 20) : new THREE.BoxGeometry(w, h, dp);
    const m = new THREE.Mesh(g, fillM); const l = new THREE.LineSegments(new THREE.EdgesGeometry(g), lineM);
    const grp = new THREE.Group(); grp.add(m, l); grp.position.set(x, y, z); grp.renderOrder = 10; m.renderOrder = l.renderOrder = 10; ghost.add(grp); (gparts[id] = gparts[id] || []).push(grp); return grp;
  }
  ghostBox('engine', .78, .5, .62, 0, .62, -1.2);          // engine block behind the seats
  ghostBox('engine', .2, .34, 0, -.2, .98, -1.2, 'cyl'); ghostBox('engine', .2, .34, 0, .2, .98, -1.2, 'cyl');
  ghostBox('battery', .3, .2, .2, .35, .5, 1.62);        // battery in the nose
  ghostBox('oil', .1, .26, 0, .45, .55, -1.5, 'cyl'); ghostBox('oil', .16, .12, .3, -.4, .4, -1.45);
  [wf, wr, new THREE.Vector3(-wf.x, wf.y, wf.z), new THREE.Vector3(-wr.x, wr.y, wr.z)].forEach(w => { const g = ghostBox('suspension', .06, .5, 0, w.x * .9, w.y + .42, w.z, 'cyl'); });
  const gm = ghost.children;

  // hotspots (positions from node boxes + estimates; normals are used to hide hotspots on the far side)
  const brakeBox = nodeBox(o => o.name === 'brake' && new THREE.Box3().setFromObject(o).getCenter(new THREE.Vector3()).distanceTo(wf) < .3);
  const tyreTop = new THREE.Vector3(wr.x + .08, wr.y + .3, wr.z);
  const HS = {
    brakes: { p: (brakeBox ? brakeBox.getCenter(new THREE.Vector3()) : wf.clone()).add(new THREE.Vector3(.1, 0, 0)), n: [1, 0, 0], x: false, cam: [3.4, .75, 3.4], tg: [.8, .4, 1.1] },
    tires: { p: tyreTop, n: [1, .3, 0], x: false, cam: [3.6, .8, -3.1], tg: [.8, .35, -1.4] },
    suspension: { p: new THREE.Vector3(wf.x * .92, wf.y + .42, wf.z), n: [1, .6, 0], x: true, cam: [3.2, 1.0, 3.0], tg: [.7, .5, 1.1] },
    engine: { p: new THREE.Vector3(0, .98, -1.18), n: [0, 1, -.3], x: true, cam: [-2.0, 2.4, -4.2], tg: [0, .6, -1.2] },
    oil: { p: new THREE.Vector3(.5, .62, -1.55), n: [1, .3, -.6], x: true, cam: [3.0, 1.2, -3.8], tg: [.2, .5, -1.4] },
    battery: { p: new THREE.Vector3(.3, .68, 1.68), n: [0, 1, .5], x: true, cam: [-1.8, 1.9, 4.4], tg: [.2, .5, 1.5] }
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
    [mats.body, mats.glass].forEach(m => { m.transparent = on; m.opacity = on ? .2 : 1; m.depthWrite = !on; m.needsUpdate = true; });
    mats.glass.transmission = on ? 0 : 1; need();
  }
  function enterCabin() {
    cabin = true; setXray(false); ctl.autoRotate = false; ctl.enableZoom = false;
    const eye = new THREE.Vector3(.34, 1.04, -.02);  // driver's seat, looking toward the nose
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

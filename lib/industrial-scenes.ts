import * as THREE from 'three';

export type SceneKind = 'demolition' | 'scrap' | 'loader' | 'crane' | 'truck';
export type SceneControl = { paused: boolean; replay: number; progress: number | null };
type Item = { mesh: THREE.Mesh; start: THREE.Vector3; scale: THREE.Vector3; material: THREE.Material; seed: number };
const clamp = (n: number) => Math.min(1, Math.max(0, n));
const smooth = (n: number) => { n = clamp(n); return n * n * (3 - 2 * n); };
const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);

export function createIndustrialScene(host: HTMLElement, kind: SceneKind, control: () => SceneControl, stage: (n: number) => void) {
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7));
  renderer.setClearColor(0x000000, 0);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;
  host.appendChild(renderer.domElement);
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-8, 8, 6, -6, .1, 80);
  const target = V(0, kind === 'demolition' ? 2.25 : 1.2, 0);
  camera.position.set(kind === 'demolition' ? 12 : 11, kind === 'demolition' ? 9 : 7, 13);
  camera.lookAt(target);
  scene.add(new THREE.HemisphereLight(0xe6f1ff, 0x25384f, 3));
  const sun = new THREE.DirectionalLight(0xffedc6, 4.2);
  sun.position.set(-5, 11, 7); sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  Object.assign(sun.shadow.camera, { left: -10, right: 10, top: 10, bottom: -10, near: .1, far: 35 });
  sun.shadow.bias = -.001;
  scene.add(sun);
  const fill = new THREE.DirectionalLight(0x99c9ff, 2.1); fill.position.set(5, 5, -7); scene.add(fill);
  const mat = (color: number, metalness = .2, roughness = .6) => new THREE.MeshStandardMaterial({ color, metalness, roughness });
  const gold = mat(0xecb51e, .45, .32), concrete = mat(0xbcc8d1, .18, .7), white = mat(0xe6e9e8), dark = mat(0x182b40), steel = mat(0x738a9d, .75, .3), rubber = mat(0x17202b, .05, .85), glass = mat(0x3f758c, .65, .18), silver = mat(0xdbe4e7, .7, .28), copper = mat(0xbb7953, .7, .3);
  const boxGeo = new THREE.BoxGeometry(1, 1, 1);
  const box = (group: THREE.Object3D, x: number, y: number, z: number, w: number, h: number, d: number, material = gold) => {
    const m = new THREE.Mesh(boxGeo, material); m.position.set(x, y, z); m.scale.set(w, h, d); m.castShadow = true; m.receiveShadow = true; group.add(m); return m;
  };
  const cyl = (group: THREE.Object3D, x: number, y: number, z: number, radius: number, length: number, material = steel, sides = 16) => {
    const m = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, length, sides), material); m.position.set(x, y, z); m.castShadow = true; group.add(m); return m;
  };
  const rod = (group: THREE.Object3D, a: THREE.Vector3, b: THREE.Vector3, r: number, material = silver) => {
    const m = cyl(group, 0, 0, 0, r, a.distanceTo(b), material); m.position.copy(a).add(b).multiplyScalar(.5); m.quaternion.setFromUnitVectors(V(0, 1, 0), b.clone().sub(a).normalize()); return m;
  };
  const ground = new THREE.Group(); scene.add(ground);
  box(ground, 0, -.25, 0, 10, .38, 7.5, dark);
  const pad = box(ground, 0, -.04, 0, 9.6, .08, 7.1, mat(kind === 'scrap' ? 0x31465a : 0x8e9ea8, .15, .8));
  const padMaterial = pad.material;
  const grid = new THREE.GridHelper(9.5, 16, 0x8593a0, 0x5f7282); grid.position.y = .014;
  (grid.material as THREE.Material).transparent = true; (grid.material as THREE.Material).opacity = .22; scene.add(grid);
  for (const z of [-3.6, 3.6]) box(ground, 0, -.015, z, 9.85, .04, .035, gold);
  for (const x of [-4.9, 4.9]) box(ground, x, -.015, 0, .035, .04, 7.2, gold);
  const world = new THREE.Group(); scene.add(world);
  let update: (t: number, p: number) => void = () => {};

  if (kind === 'demolition') {
    const items: Item[] = [];
    const piece = (x: number, y: number, z: number, w: number, h: number, d: number, material: THREE.MeshStandardMaterial) => {
      const mesh = box(world, x, y, z, w, h, d, material);
      items.push({ mesh, start: mesh.position.clone(), scale: mesh.scale.clone(), material, seed: items.length * 1.618033988 });
    };
    for (let floor = 0; floor < 7; floor++) {
      const y = .18 + floor * .84;
      for (let ix = 0; ix < 4; ix++) for (let iz = 0; iz < 3; iz++) {
        piece((ix - 1.5) * 1.22, y + .38, (iz - 1) * 1.35, .13, .77, .13, floor === 4 ? gold : concrete);
      }
      for (let ix = 0; ix < 4; ix++) {
        piece((ix - 1.5) * 1.23, y + .8, 0, 1.23, .12, 3.1, floor === 4 ? gold : white);
        if (floor > 0 && floor < 6) piece((ix - 1.5) * 1.22, y + .38, 1.39, .98, .57, .04, glass);
      }
      for (let z = -1; z <= 1; z++) if (floor > 0) piece(1.9, y + .38, z * .96, .04, .54, .8, steel);
    }
    // Debris follows an art-directed demolition, then continuously morphs into a level surface.
    const n = items.length, columns = 14, rows = Math.ceil(n / columns);
    const dustGeo = new THREE.BufferGeometry(); const dustPos = new Float32Array(180 * 3);
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    const dustMat = new THREE.PointsMaterial({ color: 0xd6b776, size: .06, transparent: true, opacity: 0, depthWrite: false });
    const dust = new THREE.Points(dustGeo, dustMat); world.add(dust);
    update = (t, p) => {
      const burst = smooth((p - .15) / .36), settle = smooth((p - .54) / .40);
      items.forEach((it, i) => {
        const angle = it.seed * 2.4, radius = 1.2 + ((i * 17) % 28) / 10;
        const rubble = V(Math.sin(angle) * radius, .12 + ((i * 7) % 5) * .055, Math.cos(angle) * radius * .7);
        const flight = Math.sin(burst * Math.PI) * (1.3 + (i % 5) * .3);
        const pos = it.start.clone().lerp(rubble, burst); pos.y += flight;
        const tile = V((i % columns - (columns - 1) / 2) * .66, .045, (Math.floor(i / columns) - (rows - 1) / 2) * .46);
        it.mesh.position.copy(pos.lerp(tile, settle));
        it.mesh.rotation.set(Math.sin(it.seed) * burst * (1 - settle) * 2, Math.cos(it.seed) * burst * (1 - settle) * 2, burst * (1 - settle));
        const collapsedScale = it.scale.clone().lerp(V(.38, .18, .32), burst);
        it.mesh.scale.copy(collapsedScale.lerp(V(.66, .04, .46), settle));
        if (settle > .2) it.mesh.material = concrete;
        else it.mesh.material = it.material;
      });
      for (let i = 0; i < 180; i++) {
        const a = i * 2.39996, r = burst * (1 + i % 8) * .66;
        dustPos[i * 3] = Math.cos(a) * r; dustPos[i * 3 + 1] = .3 + Math.sin(i * 7.1) ** 2 * burst * 2.3;
        dustPos[i * 3 + 2] = Math.sin(a) * r * .6;
      }
      dustGeo.attributes.position.needsUpdate = true; dustMat.opacity = Math.sin(burst * Math.PI) * .4 * (1 - settle);
      world.rotation.y = -.12 + Math.sin(t * .12) * .035;
      pad.material = p > .94 ? concrete : padMaterial;
      stage(p < .17 ? 0 : p < .54 ? 1 : p < .94 ? 2 : 3);
    };
  } else if (kind === 'scrap') {
    const pieces: { mesh: THREE.Mesh; initial: THREE.Vector3; rotation: THREE.Euler; end: THREE.Vector3; type: number }[] = [];
    for (let k = 0; k < 3; k++) {
      box(ground, (k - 1) * 2.7, .09, 0, 2.3, .16, 3, dark);
      box(ground, (k - 1) * 2.7, .18, 1.47, 2.3, .045, .03, gold);
      for (let i = 0; i < 27; i++) {
        const material = [steel, copper, silver][k];
        let mesh: THREE.Mesh;
        if (k === 1) {
          mesh = new THREE.Mesh(new THREE.TorusGeometry(.25, .055, 8, 18), material); world.add(mesh); mesh.castShadow = true;
        } else {
          mesh = box(world, 0, 0, 0, k === 0 ? .15 : .6, .12, k === 0 ? .84 : .42, material);
        }
        const id = k * 27 + i;
        const initial = V(Math.sin(id * 9.2) * 3.8, .32 + Math.cos(id * 5.3) ** 2 * .7, Math.cos(id * 4.8) * 2.5);
        mesh.position.copy(initial); mesh.rotation.set(id * .41, id * .81, id * .3);
        pieces.push({ mesh, initial, rotation: mesh.rotation.clone(), end: V((k - 1) * 2.7 + ((i % 3) - 1) * .6, .3 + Math.floor(i / 9) * .34, ((Math.floor(i / 3) % 3) - 1) * .72), type: k });
      }
    }
    update = (t, p) => {
      pieces.forEach((item, i) => {
        const s = smooth((p - (i % 9) * .025) / .76);
        item.mesh.position.copy(item.initial).lerp(item.end, s);
        item.mesh.position.y += Math.sin(s * Math.PI) * (1.8 + i % 3 * .22);
        item.mesh.rotation.set(item.rotation.x * (1 - s) + (item.type === 1 ? Math.PI / 2 * s : 0), item.rotation.y * (1 - s), item.rotation.z * (1 - s));
      });
      world.rotation.y = Math.sin(t * .2) * .035;
      stage(p < .3 ? 0 : p < .85 ? 1 : 2);
    };
  } else {
    const vehicle = new THREE.Group(); world.add(vehicle);
    const wheels: THREE.Group[] = [];
    const wheel = (x: number, z: number, radius = .53) => {
      const g = new THREE.Group(); g.position.set(x, radius + .13, z); vehicle.add(g);
      const tire = cyl(g, 0, 0, 0, radius, .4, rubber, 24); tire.rotation.x = Math.PI / 2;
      const hub = cyl(g, 0, 0, z > 0 ? .22 : -.22, radius * .55, .04, gold, 16); hub.rotation.x = Math.PI / 2;
      const center = cyl(g, 0, 0, z > 0 ? .25 : -.25, radius * .16, .055, steel); center.rotation.x = Math.PI / 2;
      for (let a = 0; a < 16; a++) { const b = box(g, Math.cos(a * Math.PI / 8) * radius, Math.sin(a * Math.PI / 8) * radius, 0, .14, .12, .43, rubber); b.rotation.z = a * Math.PI / 8; }
      wheels.push(g);
    };
    const cab = (x: number, y: number, w = 1.25, h = 1.5) => {
      box(vehicle, x, y, 0, w, h, 1.25, gold);
      box(vehicle, x, y + .16, .636, w * .74, h * .66, .015, glass);
      box(vehicle, x, y + .16, -.636, w * .74, h * .66, .015, glass);
      box(vehicle, x - w / 2 - .01, y + .16, 0, .015, h * .66, .98, glass);
      box(vehicle, x, y + h / 2 + .05, 0, w + .14, .12, 1.4, dark);
      box(vehicle, x - .18, y - .22, .656, .18, .04, .02, silver);
      for (const z of [-.74, .74]) { rod(vehicle, V(x - w / 2, y + .3, z * .8), V(x - w / 2, y + .3, z), .025); box(vehicle, x - w / 2, y + .28, z, .16, .21, .08, dark); }
    };
    let articulate: (t: number, p: number) => void = () => {};
    if (kind === 'loader') {
      wheel(-1.05, 1); wheel(-1.05, -1); wheel(1.45, 1); wheel(1.45, -1);
      box(vehicle, .2, .9, 0, 3.75, .5, 1.52, gold);
      box(vehicle, 1.22, 1.47, 0, 1.5, .68, 1.34, gold);
      for (let i = 0; i < 6; i++) box(vehicle, 1 + i * .12, 1.5, .677, .045, .4, .02, dark);
      cab(-.02, 2.04, 1.2, 1.42);
      cyl(vehicle, 1.4, 2.02, -.48, .07, .63, dark);
      box(vehicle, .28, 3, 0, .13, .16, .16, gold);
      const boom = new THREE.Group(); boom.position.set(-.55, 1.06, 0); vehicle.add(boom);
      for (const z of [-.6, .6]) {
        rod(boom, V(0, 0, z), V(-1.7, .28, z), .12, gold);
        rod(boom, V(-1.7, .28, z), V(-2.05, -.35, z), .12, gold);
        rod(vehicle, V(.1, 1, z), V(-1.25, 1.58, z), .065, silver);
      }
      const bucket = new THREE.Group(); bucket.position.set(-2.1, -.4, 0); boom.add(bucket);
      box(bucket, -.18, -.05, 0, .86, .12, 2.02, gold);
      const back = box(bucket, .2, .25, 0, .12, .6, 2.02, gold); back.rotation.z = -.2;
      for (const z of [-.95, .95]) box(bucket, -.18, .22, z, .75, .46, .12, gold);
      for (let i = 0; i < 7; i++) box(bucket, -.7, -.02, (i - 3) * .27, .25, .06, .1, steel);
      articulate = (t, p) => { boom.rotation.z = -.08 + smooth(p) * -.65 + Math.sin(t * .9) * .045; bucket.rotation.z = .12 + p * .35; };
    } else if (kind === 'truck') {
      for (const x of [-1.9, .85, 1.9]) { wheel(x, .97, .5); wheel(x, -.97, .5); }
      box(vehicle, 0, .83, 0, 5.2, .26, 1.48, dark);
      cab(-1.8, 1.72, 1.38, 1.73);
      box(vehicle, -2.53, 1.15, 0, .14, .35, 1.52, white);
      for (const z of [-.51, .51]) box(vehicle, -2.615, 1.33, z, .03, .16, .26, white);
      const bed = new THREE.Group(); bed.position.set(2.15, 1.18, 0); vehicle.add(bed);
      box(bed, -1.48, 0, 0, 3.2, .14, 1.68, gold);
      for (const z of [-.87, .87]) {
        box(bed, -1.48, .48, z, 3.2, .94, .1, gold);
        for (let i = 0; i < 7; i++) box(bed, -2.95 + i * .46, .48, z * 1.07, .07, .91, .04, white);
      }
      for (const x of [-3.1, .07]) box(bed, x, .5, 0, .1, .96, 1.7, gold);
      articulate = (_t, p) => { bed.rotation.z = -smooth(p) * .49; };
    } else {
      for (const x of [-2, -.95, .95, 2]) { wheel(x, .95, .44); wheel(x, -.95, .44); }
      box(vehicle, 0, .83, 0, 5.6, .48, 1.7, gold);
      cab(-2, 1.48, 1.1, 1.06);
      for (const x of [-1.4, 1.4]) for (const z of [-1, 1]) {
        box(vehicle, x, .75, z * 1.4, .25, .23, 1.4, silver);
        cyl(vehicle, x, .43, z * 1.95, .1, .6, gold);
        box(vehicle, x, .13, z * 1.95, .6, .12, .55, dark);
      }
      const turret = new THREE.Group(); turret.position.set(.45, 1.15, 0); vehicle.add(turret);
      box(turret, .6, .3, 0, 1.8, .55, 1.6, gold); box(turret, .3, .68, .58, 1.0, .67, .6, glass);
      const boom = new THREE.Group(); boom.position.set(0, .58, 0); turret.add(boom);
      box(boom, -1.8, .1, 0, 3.8, .4, .42, gold);
      const extension = box(boom, -3.2, .1, 0, 2.5, .27, .29, silver);
      for (let i = 0; i < 7; i++) box(boom, -i * .48, .32, 0, .08, .03, .44, dark);
      const cable = rod(turret, V(-2.8, 4.25, 0), V(-2.8, 1.3, 0), .016, dark);
      const hook = new THREE.Group(); turret.add(hook); cyl(hook, 0, 0, 0, .16, .3, gold);
      const hookRing = new THREE.Mesh(new THREE.TorusGeometry(.12, .035, 6, 14, Math.PI * 1.6), steel); hookRing.position.y = -.25; hook.add(hookRing);
      articulate = (t, p) => {
        boom.rotation.z = -.55 - smooth(p) * .22; extension.position.x = -3 - smooth(p) * .65;
        const tip = V(extension.position.x - 1.2, .1, 0).applyAxisAngle(V(0, 0, 1), boom.rotation.z).add(boom.position);
        const len = 1.5 + .5 * (1 - smooth(p));
        cable.position.copy(tip).add(V(0, -len / 2, 0)); cable.scale.y = len / 2.95;
        hook.position.copy(tip).add(V(Math.sin(t * 1.2) * .06, -len - .12, 0));
        turret.rotation.y = -.08 + smooth(p) * .15;
      };
    }
    update = (t, p) => {
      vehicle.position.x = 2.4 * (1 - smooth(Math.min(1, p * 3)));
      vehicle.rotation.y = -.13;
      wheels.forEach(w => { w.rotation.z = -(vehicle.position.x / .53); });
      articulate(t, p); stage(p < .5 ? 0 : 1);
    };
  }
  let width = 1, height = 1;
  const resize = () => {
    width = host.clientWidth; height = host.clientHeight; if (!width || !height) return;
    const vertical = kind === 'demolition' ? 9.7 : kind === 'crane' ? 8.4 : 7.3;
    const halfH = Math.max(vertical / 2, 11.9 / (width / height) / 2);
    camera.left = -halfH * width / height; camera.right = halfH * width / height; camera.top = halfH; camera.bottom = -halfH;
    camera.updateProjectionMatrix(); renderer.setSize(width, height); renderer.render(scene, camera);
  };
  const ro = new ResizeObserver(resize); ro.observe(host); resize();
  let visible = false, raf = 0, destroyed = false, previous = 0, elapsed = 0, replay = control().replay, lastStage = -1, smoothProgress = 0, wasPaused: boolean | null = null;
  const report = stage; stage = n => { if (n !== lastStage) { lastStage = n; report(n); } };
  const tick = (now: number) => {
    if (destroyed) return;
    const c = control();
    const dt = previous ? Math.min((now - previous) / 1000, .08) : 0; previous = now;
    if (c.replay !== replay) { elapsed = 0; smoothProgress = 0; replay = c.replay; }
    if (!c.paused && !document.hidden && visible) elapsed += dt;
    const rect = host.getBoundingClientRect();
    const scroll = clamp((window.innerHeight * .83 - rect.top) / (window.innerHeight * .66));
    const p = c.progress !== null ? c.progress : kind === 'demolition' ? clamp((elapsed - 1.3) / 5.8) : kind === 'scrap' ? clamp(scroll * .75 + elapsed * .045) : clamp(scroll * .6 + elapsed * .055);
    if (!c.paused) { smoothProgress += (p - smoothProgress) * (1 - Math.exp(-dt * 4)); update(elapsed, smoothProgress); } else if (elapsed === 0) update(0, kind === 'demolition' ? 0 : 1);
    if (visible && !document.hidden && (!c.paused || wasPaused !== c.paused)) renderer.render(scene, camera);
    wasPaused = c.paused;
    if (visible && !document.hidden) raf = requestAnimationFrame(tick);
  };
  const start = () => { cancelAnimationFrame(raf); previous = 0; if (visible && !document.hidden) raf = requestAnimationFrame(tick); };
  const io = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; if (visible) start(); else cancelAnimationFrame(raf); }, { rootMargin: '100px' }); io.observe(host);
  document.addEventListener('visibilitychange', start);
  const pointer = (e: PointerEvent) => { if (control().paused || e.pointerType !== 'mouse') return; const r = host.getBoundingClientRect(); camera.position.x = 12 + (e.clientX - r.left - r.width / 2) / r.width * 1.1; camera.lookAt(target); };
  host.addEventListener('pointermove', pointer);
  const contextLost = (e: Event) => { e.preventDefault(); host.dispatchEvent(new Event('scene-unavailable')); };
  renderer.domElement.addEventListener('webglcontextlost', contextLost);
  update(0, control().paused ? (kind === 'demolition' ? 0 : 1) : 0);
  return () => {
    destroyed = true; cancelAnimationFrame(raf); io.disconnect(); ro.disconnect(); document.removeEventListener('visibilitychange', start); host.removeEventListener('pointermove', pointer);
    renderer.domElement.removeEventListener('webglcontextlost', contextLost);
    const geometries = new Set<THREE.BufferGeometry>(), materials = new Set<THREE.Material>();
    scene.traverse(obj => { if (obj instanceof THREE.Mesh || obj instanceof THREE.Points || obj instanceof THREE.LineSegments) { geometries.add(obj.geometry); (Array.isArray(obj.material) ? obj.material : [obj.material]).forEach(m => materials.add(m)); } });
    geometries.forEach(g => g.dispose()); materials.forEach(m => m.dispose()); renderer.dispose(); renderer.domElement.remove();
  };
}

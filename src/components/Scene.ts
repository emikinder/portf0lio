import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Timer } from 'three/addons/misc/Timer.js';

export function createScene() {
  const canvasSection = document.querySelector('#canvas-section');
  const canvas = document.querySelector('canvas');
  canvas.width = canvasSection.clientWidth;
  canvas.height = canvasSection.clientHeight;

  let hoveredSkill: string | null = null;

  const skillSection = document.querySelector('#skills-section');
  skillSection.addEventListener('mouseover', (e) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains('skill-item')) {
      hoveredSkill = target.id;
    }
  });

  skillSection.addEventListener('mouseleave', () => {
    hoveredSkill = null;
  });

  const sizes = {
    width: canvas.width,
    height: canvas.height,
  };

  window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = canvasSection.clientWidth;
    sizes.height = canvasSection.clientHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
  });

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    1000
  );

  // Controls
  const controls = new OrbitControls(camera, canvas);
  controls.enableZoom = false;
  controls.enablePan = false;
  controls.enableDamping = true;

  const renderer = new THREE.WebGLRenderer({ canvas });
  renderer.setSize(sizes.width, sizes.height);
  renderer.setClearColor(0x161616);

  const createTorus = (radius: number, color: number) => {
    const geometry = new THREE.TorusGeometry(radius, 0.03, 16, 100);
    const material = new THREE.MeshBasicMaterial({ color });
    return new THREE.Mesh(geometry, material);
  };

  const createSphere = (radius: number, color: number) => {
    const geometry = new THREE.SphereGeometry(radius, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color });
    return new THREE.Mesh(geometry, material);
  };

  const group1 = new THREE.Group();
  const torus1 = createTorus(10, 0xebebeb);
  const sphere_0 = createSphere(0.3, 0xb599f2);
  sphere_0.position.x = 10;
  group1.add(torus1, sphere_0);
  group1.position.y = 6;

  const group2 = new THREE.Group();
  const torus2 = createTorus(12, 0xebebeb);
  const sphere_1 = createSphere(0.3, 0xc1d96a);
  const sphere_3 = createSphere(0.3, 0xa7d8f2);
  group2.add(torus2, sphere_1, sphere_3);
  group2.rotation.y = Math.PI / 1.2;
  group2.position.x = -10;

  const group3 = new THREE.Group();
  const torus3 = createTorus(8, 0xebebeb);
  const sphere_2 = createSphere(0.3, 0xf2b5a7);
  const sphere_4 = createSphere(0.3, 0xf2dd72);
  group3.add(torus3, sphere_2, sphere_4);
  group3.rotation.x = Math.PI / 3.1;

  scene.add(group1, group2, group3);

  camera.position.z = 10;

  const timer = new Timer();

  function animate() {
    // Timer
    timer.update();
    const elapsedTime = timer.getElapsed();

    const circleAngle = elapsedTime * 0.5;
    sphere_0.position.x = -Math.cos(circleAngle) * 10;
    sphere_0.position.y = -Math.sin(circleAngle) * 10;

    sphere_1.position.x = Math.cos(circleAngle) * 12;
    sphere_1.position.y = Math.sin(circleAngle) * 12;

    sphere_3.position.x = -Math.cos(circleAngle) * 12;
    sphere_3.position.y = -Math.sin(circleAngle) * 12;

    sphere_4.position.x = Math.cos(circleAngle) * 8;
    sphere_4.position.y = Math.sin(circleAngle) * 8;

    sphere_2.position.x = -Math.cos(circleAngle) * 8;
    sphere_2.position.y = -Math.sin(circleAngle) * 8;

    const cameraOffset = new THREE.Vector3(0, 0, -1);
    const objectPosition = new THREE.Vector3();

    const spheres = [sphere_0, sphere_1, sphere_2, sphere_3, sphere_4];

    if (hoveredSkill === null) {
      camera.position.set(0, 0, 10);
      camera.lookAt(0, 0, 0);
    } else {
      const index = parseInt(hoveredSkill, 10);
      const sphere = spheres[index] || spheres[2]; // Default to sphere_2 if index is invalid
      sphere.getWorldPosition(objectPosition);
      camera.position.copy(objectPosition).add(cameraOffset);
      camera.lookAt(objectPosition);
    }
    
    requestAnimationFrame(animate);

    group1.rotation.x -= 0.003;
    group1.rotation.y -= 0.002;

    group2.rotation.x += 0.001;
    group2.rotation.y += 0.003;

    group3.rotation.x += 0.002;
    group3.rotation.y += 0.001;

    renderer.render(scene, camera);
  }
  animate();
}

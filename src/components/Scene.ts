import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Timer } from 'three/addons/misc/Timer.js';

export function createScene() {
  const canvasSection = document.querySelector('#canvas-section');
  const canvas = document.querySelector('canvas');
  canvas.width = canvasSection.clientWidth;
  canvas.height = canvasSection.clientHeight;

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
    const geometry = new THREE.SphereGeometry(radius, 16, 16);
    const material = new THREE.MeshBasicMaterial({ color });
    return new THREE.Mesh(geometry, material);
  };
  
  const group1 = new THREE.Group();
  const torus1 = createTorus(10, 0xebebeb);
  const sphere1 = createSphere(0.3, 0xf2b5a7);
  sphere1.position.x = 10;
  group1.add(torus1, sphere1);
  group1.position.y = 6;
  
  const group2 = new THREE.Group();
  const torus2 = createTorus(12, 0xebebeb);
  const sphere2 = createSphere(0.3, 0xc1d96a);
  const sphere4 = createSphere(0.3, 0xB599F2);
  group2.add(torus2, sphere2, sphere4);
  group2.rotation.y = Math.PI / 1.2;
  group2.position.x = -10;
  
  const group3 = new THREE.Group();
  const torus3 = createTorus(8, 0xebebeb);
  const sphere3 = createSphere(0.3, 0xf2dd72);
  const sphere5 = createSphere(0.3, 0xa7d8f2);
  group3.add(torus3, sphere3, sphere5);
  group3.rotation.x = Math.PI / 3.1;
  
  scene.add(group1, group2, group3);
  
  camera.position.z = 10;
  
  const timer = new Timer();
  
  function animate() {
    // Timer
    timer.update();
    const elapsedTime = timer.getElapsed();
    
    // const offset = new THREE.Vector3(1, 1, 1); // Offset de la cámara respecto al objeto
    // camera.position.copy(sphere3.position).add(offset);
    // camera.lookAt(sphere3.position);

    const circleAngle = elapsedTime * 0.5;
    sphere1.position.x = - Math.cos(circleAngle) * 10;
    sphere1.position.y = - Math.sin(circleAngle) * 10;

    sphere2.position.x = Math.cos(circleAngle) * 12;
    sphere2.position.y = Math.sin(circleAngle) * 12;

    sphere4.position.x = -Math.cos(circleAngle) * 12;
    sphere4.position.y = -Math.sin(circleAngle) * 12;

    sphere5.position.x = Math.cos(circleAngle) * 8;
    sphere5.position.y = Math.sin(circleAngle) * 8;

    sphere3.position.x = -Math.cos(circleAngle) * 8;
    sphere3.position.y = -Math.sin(circleAngle) * 8;

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

import * as THREE from 'three';

import { AsciiEffect } from 'three/addons/effects/AsciiEffect.js';
import { TrackballControls } from 'three/addons/controls/TrackballControls.js';

const start = Date.now();

export default function createScene() {
  const canvasSection = document.querySelector('#canvas-section');
  const canvas = document.querySelector('canvas');
  canvas.width = canvasSection.clientWidth;
  canvas.height = canvasSection.clientHeight;

  const sizes = {
    width: canvas.width,
    height: canvas.height,
  };

  console.log(canvas.width, canvas.height);

  const camera = new THREE.PerspectiveCamera(
    70,
    sizes.width / sizes.height,
    1,
    1000
  );
  camera.position.y = 150;
  camera.position.z = 500;

  const scene = new THREE.Scene();
  // scene.background = new THREE.Color(0, 0, 0);
  // scene.background = new THREE.Color(22 / 255, 22 / 255, 22 / 255);
  scene.background = null;

  const pointLight1 = new THREE.PointLight(0xffffff, 3, 0, 0);
  pointLight1.position.set(500, 500, 500);
  scene.add(pointLight1);

  const pointLight2 = new THREE.PointLight(0xffffff, 1, 0, 0);
  pointLight2.position.set(-500, -500, -500);
  scene.add(pointLight2);

  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(200, 20, 10),
    new THREE.MeshPhongMaterial({ flatShading: true })
  );
  scene.add(sphere);

  // Plane
  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(400, 400),
    new THREE.MeshBasicMaterial({ color: 0xe0e0e0 })
  );
  plane.position.y = -200;
  plane.rotation.x = -Math.PI / 2;
  // scene.add(plane);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  });
  renderer.setSize(sizes.width, sizes.height);
  renderer.setAnimationLoop(animate);
  renderer.setClearColor(0x000000, 0); // Transparent background

  const effect = new AsciiEffect(renderer, ' .:-+*=%@#', { invert: false });
  effect.setSize(sizes.width, sizes.height);
  effect.domElement.style.color = 'white';
  effect.domElement.style.backgroundColor = 'transparent';

  canvas.parentNode.replaceChild(effect.domElement, canvas);

  const controls = new TrackballControls(camera, effect.domElement);
  controls.noZoom = true;

  window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = canvasSection.clientWidth;
    sizes.height = canvasSection.clientHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    // effect.setSize(sizes.width, sizes.height);
  });

  function animate() {
    const timer = Date.now() - start;

    sphere.position.y = Math.abs(Math.sin(timer * 0.002)) * 150;
    sphere.rotation.x = timer * 0.0003;
    sphere.rotation.z = timer * 0.0002;

    controls.update();

    effect.render(scene, camera);
  }
  animate();
}

// function onWindowResize() {
//   camera.aspect = window.innerWidth / window.innerHeight;
//   camera.updateProjectionMatrix();

//   renderer.setSize(window.innerWidth, window.innerHeight);
//   effect.setSize(window.innerWidth, window.innerHeight);
// }

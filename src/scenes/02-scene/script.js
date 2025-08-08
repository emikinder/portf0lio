import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import GUI from 'lil-gui';
import earthVertexShader from './shaders/earth/vertex.glsl';
import earthFragmentShader from './shaders/earth/fragment.glsl';
import atmosphereVertexShader from './shaders/atmosphere/vertex.glsl';
import atmosphereFragmentShader from './shaders/atmosphere/fragment.glsl';

export default function createScene() {
  // Clean up any existing GUI instances
  const existingGuis = document.querySelectorAll('.lil-gui');
  existingGuis.forEach((gui) => gui.remove());

  // Debug
  const gui = new GUI();
  gui.hide();

  /**
   * Base
   */
  // Canvas
  const canvas = document.querySelector('#scene');

  // Scene
  const scene = new THREE.Scene();

  // Loaders
  const textureLoader = new THREE.TextureLoader();

  /**
   * Earth
   */
  // Colors
  const earthParameters = {
    atmosphereDayColor: '#00aaff',
    atmosphereTwilightColor: '#ff6600',
  };

  gui.addColor(earthParameters, 'atmosphereDayColor').onChange(() => {
    earthMaterial.uniforms.uAtmosphereDayColor.value.set(
      earthParameters.atmosphereDayColor
    );
    atmosphereMaterial.uniforms.uAtmosphereDayColor.value.set(
      earthParameters.atmosphereDayColor
    );
  });
  gui.addColor(earthParameters, 'atmosphereTwilightColor').onChange(() => {
    earthMaterial.uniforms.uAtmosphereTwilightColor.value.set(
      earthParameters.atmosphereTwilightColor
    );
    atmosphereMaterial.uniforms.uAtmosphereTwilightColor.value.set(
      earthParameters.atmosphereTwilightColor
    );
  });

  // Textures
  const earthDayTexture = textureLoader.load('/static/earth/day.jpg');
  earthDayTexture.colorSpace = THREE.SRGBColorSpace;
  earthDayTexture.anisotropy = 8;

  const earthNightTexture = textureLoader.load('/static/earth/night.jpg');
  earthNightTexture.colorSpace = THREE.SRGBColorSpace;
  earthNightTexture.anisotropy = 8;

  const specularCloudsTexture = textureLoader.load(
    '/static/earth/specularClouds.jpg'
  );
  specularCloudsTexture.anisotropy = 8;

  // Mesh
  const earthGeometry = new THREE.SphereGeometry(2, 64, 64);
  const earthMaterial = new THREE.ShaderMaterial({
    vertexShader: earthVertexShader,
    fragmentShader: earthFragmentShader,
    uniforms: {
      uDayTexture: new THREE.Uniform(earthDayTexture),
      uNightTexture: new THREE.Uniform(earthNightTexture),
      uSpecularCloudsTexture: new THREE.Uniform(specularCloudsTexture),
      uSunDirection: new THREE.Uniform(new THREE.Vector3(0, 0, 1)),
      uAtmosphereDayColor: new THREE.Uniform(
        new THREE.Color(earthParameters.atmosphereDayColor)
      ),
      uAtmosphereTwilightColor: new THREE.Uniform(
        new THREE.Color(earthParameters.atmosphereTwilightColor)
      ),
    },
  });
  const earth = new THREE.Mesh(earthGeometry, earthMaterial);
  scene.add(earth);

  // Atmosphere
  const atmosphereMaterial = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    transparent: true,
    vertexShader: atmosphereVertexShader,
    fragmentShader: atmosphereFragmentShader,
    uniforms: {
      uSunDirection: new THREE.Uniform(new THREE.Vector3(0, 0, 1)),
      uAtmosphereDayColor: new THREE.Uniform(
        new THREE.Color(earthParameters.atmosphereDayColor)
      ),
      uAtmosphereTwilightColor: new THREE.Uniform(
        new THREE.Color(earthParameters.atmosphereTwilightColor)
      ),
    },
  });
  const atmosphere = new THREE.Mesh(earthGeometry, atmosphereMaterial);
  atmosphere.scale.set(1.04, 1.04, 1.04);
  scene.add(atmosphere);

  // Sun
  const sunSpherical = new THREE.Spherical(1, Math.PI * 0.5, 0.5);
  const sunDirection = new THREE.Vector3();

  // Debug
  const debugSun = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.1, 2),
    new THREE.MeshBasicMaterial()
  );
  scene.add(debugSun);

  // Update sun direction
  const updateSun = () => {
    // Sun direction
    sunDirection.setFromSpherical(sunSpherical);

    // Debug
    debugSun.position.copy(sunDirection).multiplyScalar(5);

    // Uniforms
    earthMaterial.uniforms.uSunDirection.value.copy(sunDirection);
    atmosphereMaterial.uniforms.uSunDirection.value.copy(sunDirection);
  };
  updateSun();

  // GUI
  gui
    .add(sunSpherical, 'phi')
    .min(0)
    .max(Math.PI)
    .name('Sun y')
    .onChange(updateSun);
  gui
    .add(sunSpherical, 'theta')
    .min(-Math.PI)
    .max(Math.PI)
    .name('Sun x')
    .onChange(updateSun);

  /**
   * Sizes
   */
  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
    pixelRatio: Math.min(window.devicePixelRatio, 2),
  };

  const handleResize = () => {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    sizes.pixelRatio = Math.min(window.devicePixelRatio, 2);

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(sizes.pixelRatio);
  };

  window.addEventListener('resize', handleResize);

  /**
   * Camera
   */
  // Base camera
  const camera = new THREE.PerspectiveCamera(
    40,
    sizes.width / sizes.height,
    0.1,
    100
  );
  camera.position.x = 12;
  camera.position.y = 5;
  camera.position.z = 4;
  scene.add(camera);

  // Controls
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;

  /**
   * Renderer
   */
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
  });
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(sizes.pixelRatio);
  renderer.setClearColor('#000011');

  /**
   * Animate
   */
  const clock = new THREE.Clock();
  let animationId;

  const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    earth.rotation.y = elapsedTime * 0.1;

    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    animationId = window.requestAnimationFrame(tick);
  };

  tick();

  // Return cleanup function
  return () => {
    console.log('Cleaning up scene...');
    // Cancel animation frame
    if (animationId) {
      cancelAnimationFrame(animationId);
    }

    // Dispose of GUI
    if (gui) {
      gui.destroy();
    }

    // Clean up Three.js resources
    if (renderer) {
      renderer.dispose();
    }

    // Remove event listeners
    window.removeEventListener('resize', handleResize);

    // Dispose geometries and materials
    if (earthGeometry) earthGeometry.dispose();
    if (earthMaterial) earthMaterial.dispose();
    if (atmosphereMaterial) atmosphereMaterial.dispose();

    // Dispose textures
    if (earthDayTexture) earthDayTexture.dispose();
    if (earthNightTexture) earthNightTexture.dispose();
    if (specularCloudsTexture) specularCloudsTexture.dispose();
  };
}

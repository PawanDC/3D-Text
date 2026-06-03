import * as THREE from "three";
import GUI from "lil-gui";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";

const canvas = document.querySelector("canvas#canvas");

/**
 * Debug UI
 */
const gui = new GUI({
    width: 350,
    title: 'Debug UI',
});

const debug = {
    count: 200,
}
/**
 * Scene
 */
const scene = new THREE.Scene();

/**
 *  Texture Loader
 */
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load("/static/textures/matcaps/3.png");
texture.colorSpace = THREE.SRGBColorSpace;
/**
 * Font loader
 */
const fontLoader = new FontLoader();
fontLoader.load("/static/fonts/helvetiker_regular.typeface.json", (font) => {
  const textGeometry = new TextGeometry("Thank you!", {
    font: font,
    size: 0.7,
    depth: 0.2,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 5,
  });
  textGeometry.center();
  const textMaterial = new THREE.MeshMatcapMaterial({matcap: texture});
  const text = new THREE.Mesh(textGeometry, textMaterial);
  scene.add(text);
});


/**
 * Geometries
 */
const palneGeometry = new THREE.PlaneGeometry(1, 1);
const PlaneMaterial = new THREE.MeshMatcapMaterial({ matcap: texture });
gui.add(PlaneMaterial, 'wireframe').name('Plave Wireframe');

const sphereGeometry = new THREE.SphereGeometry(0.3, 16, 16);
const sphereMaterial = new THREE.MeshMatcapMaterial({ matcap: texture});
gui.add(sphereMaterial, 'wireframe').name('Sphere Wireframe');


for(let i=0; i<debug.count; i++){

  const plane = new THREE.Mesh(palneGeometry, PlaneMaterial);
  const planeScale = Math.random() * 0.2;
  plane.scale.set(planeScale, planeScale, planeScale);
  plane.position.x = (Math.random() - 0.5) * 15;
  plane.position.y = (Math.random() - 0.5) * 15;
  plane.position.z = (Math.random() - 0.5) * 15;
  plane.rotation.x = Math.PI;
  plane.rotation.y = Math.PI;
  scene.add(plane);
 
  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  const sphereSize = Math.random()*0.3+0.1;
  sphere.scale.set(sphereSize, sphereSize, sphereSize);
  sphere.position.x = (Math.random() - 0.5) * 15;
  sphere.position.y = (Math.random() - 0.5) * 15;
  sphere.position.z = (Math.random() - 0.5) * 15;
  scene.add(sphere);
}

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};
/**
 * Resize
 */
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
});

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100,
);
camera.position.set(0, 0, 3);
scene.add(camera);

/**
 * Controls
 */
const orbitControl = new OrbitControls(camera, canvas);
orbitControl.maxDistance = 8;
orbitControl.minDistance = 2;
orbitControl.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(sizes.width, sizes.height);

const timer = new THREE.Timer();
/**
 * Function
 */
const tick = () => {
  timer.update();

  renderer.render(scene, camera);

  orbitControl.update();

  window.requestAnimationFrame(tick);
};
tick();

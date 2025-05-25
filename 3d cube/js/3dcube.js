const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const loader = new THREE.TextureLoader();
const materials = [];
for (let i = 1; i <= 6; i++) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 256;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#0af';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 120px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(i, canvas.width / 2, canvas.height / 2);
  const texture = new THREE.CanvasTexture(canvas);
  materials.push(new THREE.MeshBasicMaterial({map: texture}));
}

const geometry = new THREE.BoxGeometry();
const cube = new THREE.Mesh(geometry, materials);
scene.add(cube);

camera.position.z = 3;
document.getElementById("rotateX").addEventListener("input", e => {
  cube.rotation.x = THREE.MathUtils.degToRad(e.target.value);
});
document.getElementById("rotateY").addEventListener("input", e => {
  cube.rotation.y = THREE.MathUtils.degToRad(e.target.value);
});
document.getElementById("rotateZ").addEventListener("input", e => {
  cube.rotation.z = THREE.MathUtils.degToRad(e.target.value);
});

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

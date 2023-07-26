import * as THREE from 'three';
import './style.css';
import Particles from './Particles';
const canvas = document.getElementById('app');

const camera = new THREE.PerspectiveCamera(
	50,
	window.innerWidth / window.innerHeight,
	1,
	10000
);
camera.position.z = 500;

const scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animation);
canvas.appendChild(renderer.domElement);

// particles
const particles = new Particles(scene, renderer, animation);

// resize
function resize(renderer) {
	const canvas = renderer.domElement;
	const width = canvas.clientWidth;
	const height = canvas.clientHeight;
	const needResize = canvas.width !== width || canvas.height !== height;
	if (needResize) {
		renderer.setSize(width, height, false);
	}
	return needResize;
}

window.addEventListener('resize', function () {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);
});

// animation

function animation(time) {
	if (resize(renderer)) {
		camera.aspect = canvas.clientWidth / canvas.clientHeight;
		camera.updateProjectionMatrix();
	}

	renderer.render(scene, camera);
}

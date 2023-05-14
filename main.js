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
const particles = new Particles(scene);

// animation

function animation(time) {
	renderer.render(scene, camera);
}

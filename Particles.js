import * as THREE from 'three';
import fragmentShader from './shaders/fragmentShader.frag';
import vertexShader from './shaders/vertexShader.vert';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const readyImg = document.querySelector('.ready-img');
const canvas = document.getElementById('app');
const isTablet = window.innerWidth < 991;
const isMobile = window.innerWidth < 767;
function Particles(scene) {
	const loader = new THREE.TextureLoader();
	let texWidth = 0;
	let texHeight = 0;
	const texture = loader.load('/unagi-1.png', (tex) => {
		tex.minFilter = THREE.LinearFilter;
		tex.magFilter = THREE.LinearFilter;
		tex.format = THREE.RGBAFormat;

		texWidth = tex.image.width;
		texHeight = tex.image.height;

		initPoints(true);
	});
	const initPoints = (discard) => {
		const numPoints = texWidth * texHeight;
		let numVisible = numPoints;
		let threshold = 0;
		let originalColors;

		if (discard) {
			// discard pixels darker than threshold #22
			numVisible = 0;
			threshold = 0;

			const img = texture.image;
			const canvas = document.createElement('canvas');
			const ctx = canvas.getContext('2d');

			canvas.width = texWidth;
			canvas.height = texHeight;
			ctx.scale(1, -1);
			ctx.drawImage(img, 0, 0, texWidth, texHeight * -1);

			const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
			originalColors = Float32Array.from(imgData.data);

			for (let i = 0; i < numPoints; i++) {
				if (originalColors[i * 4 + 0] > threshold) numVisible++;
			}
		}
		const uniforms = {
			uTime: { value: 5.0 },
			uRandom: { value: 150.0 },
			uDepth: { value: 1.0 },
			uSize: { value: 1.0 },
			uTextureSize: { value: new THREE.Vector2(texWidth, texHeight) },
			uTexture: { value: texture },
			uTouch: { value: null },
			uTurbulence: { value: 25.0 },
		};

		const material = new THREE.RawShaderMaterial({
			uniforms,
			vertexShader,
			fragmentShader,
			depthTest: false,
			transparent: true,
			depthWrite: false,
			// blending: THREE.AdditiveBlending,
		});

		const geometry = new THREE.InstancedBufferGeometry();

		// positions
		const positions = new THREE.BufferAttribute(new Float32Array(4 * 3), 3);
		positions.setXYZ(0, -0.5, 0.5, 0.0);
		positions.setXYZ(1, 0.5, 0.5, 0.0);
		positions.setXYZ(2, -0.5, -0.5, 0.0);
		positions.setXYZ(3, 0.5, -0.5, 0.0);
		geometry.setAttribute('position', positions);

		// uvs
		const uvs = new THREE.BufferAttribute(new Float32Array(4 * 2), 2);
		uvs.setXYZ(0, 0.0, 0.0);
		uvs.setXYZ(1, 1.0, 0.0);
		uvs.setXYZ(2, 0.0, 1.0);
		uvs.setXYZ(3, 1.0, 1.0);
		geometry.setAttribute('uv', uvs);

		// index
		geometry.setIndex(
			new THREE.BufferAttribute(new Uint16Array([0, 2, 1, 2, 3, 1]), 1)
		);

		const indices = new Uint16Array(numPoints);
		const offsets = new Float32Array(numPoints * 3);
		const angles = new Float32Array(numPoints);

		for (let i = 0, j = 0; i < numPoints; i++) {
			offsets[j * 3 + 0] = i % texWidth;
			offsets[j * 3 + 1] = Math.floor(i / texWidth);

			indices[j] = i;

			angles[j] = Math.random() * Math.PI;

			j++;
		}

		geometry.setAttribute(
			'pindex',
			new THREE.InstancedBufferAttribute(indices, 1, false)
		);
		geometry.setAttribute(
			'offset',
			new THREE.InstancedBufferAttribute(offsets, 3, false)
		);
		geometry.setAttribute(
			'angle',
			new THREE.InstancedBufferAttribute(angles, 1, false)
		);

		const mesh = new THREE.Mesh(geometry, material);
		{
			isTablet
				? ((mesh.position.y = 65),
				  mesh.scale.set(0.6, 0.6, 0.6),
				  (mesh.position.x = -25))
				: ((mesh.position.x = 170), (mesh.position.y = -1));
		}
		{
			isMobile &&
				((mesh.position.y = 75),
				mesh.scale.set(0.4, 0.4, 0.4),
				(mesh.position.x = -25));
		}
		console.log(mesh);
		mesh.rotateZ(0.35447637);
		scene.add(mesh);
		onload(mesh);
	};

	const onload = (mesh) => {
		gsap.set(readyImg, { opacity: 0 });
		gsap.fromTo(
			mesh.material.uniforms.uRandom,
			{
				value: 2500.0,
			},
			{
				duration: 15,
				value: 2000.0,
				ease: 'linear',
				repeat: -1,
				yoyo: true,
				id: 'first',
			}
		);
		gsap.to(mesh.material.uniforms.uRandom, {
			scrollTrigger: {
				trigger: '.section_seafood-meat',
				start: 'top bottom',
				end: isTablet ? 'top 5%' : isMobile ? ' top 3%' : 'top top',
				// markers: true,
				scrub: true,
				onEnter: () => {
					gsap.getById('first').pause();
				},

				onUpdate: (self) => {
					if (self.direction === -1) {
						if (self.progress < 0.2) {
							if (gsap.getById('first').paused()) {
								gsap.getById('first').resume();
								return;
							}
						}
					}
				},
			},
			duration: 1,
			value: 0.0,
			ease: 'linear',
		});
		gsap.to(readyImg, {
			scrollTrigger: {
				trigger: '.section_seafood-meat',
				start: isTablet ? 'top 10%' : 'top 4%',
				end: isTablet ? 'top 5%' : 'top top',
				// markers: true,
				scrub: true,
			},
			duration: 1,
			opacity: 1,
		});
	};
	gsap.to(canvas, {
		scrollTrigger: {
			trigger: '.section_seafood-meat',
			start: isTablet ? 'top 10%' : 'top 3%',
			end: isTablet ? 'top 6%' : isMobile ? 'top top' : 'top -2%',
			// markers: true,
			scrub: true,
		},
		duration: 1,
		opacity: 0,
	});
}

export default Particles;

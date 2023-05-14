import * as THREE from 'three';
import fragmentShader from './shaders/fragmentShader.frag';
import vertexShader from './shaders/vertexShader.vert';
import { gsap } from 'gsap';
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

			for (let i = 0; i < this.numPoints; i++) {
				if (originalColors[i * 4 + 0] > threshold) numVisible++;
			}

			// console.log('numVisible', numVisible, this.numPoints);
		}
		const uniforms = {
			uTime: { value: 0 },
			uRandom: { value: 0.0 },
			uDepth: { value: 1.0 },
			uSize: { value: 1.0 },
			uTextureSize: { value: new THREE.Vector2(texWidth, texHeight) },
			uTexture: { value: texture },
			uTouch: { value: null },
		};

		const material = new THREE.RawShaderMaterial({
			uniforms,
			vertexShader,
			fragmentShader,
			depthTest: false,
			transparent: true,
			// blending: THREE.AdditiveBlending
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
		scene.add(mesh);
		// show(mesh);
	};

	const show = (mesh) => {
		gsap.to(mesh.material.uniforms.uRandom, {
			duration: 4,
			value: 50.0,
			ease: 'power3.out',
		});
	};
}
export default Particles;

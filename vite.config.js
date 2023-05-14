import glslify from 'rollup-plugin-glslify';

// ...

export default {
	publicDir: 'public/',
	base: './',
	build: {
		outDir: '../dist/',
		emptyOutDir: true,
		sourcemap: true,
	},
	plugins: [glslify()],
};

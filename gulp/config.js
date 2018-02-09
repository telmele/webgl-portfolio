/**
 * Gulp tasks config
 */

"use strict";

const src = "./app";
const dest = "./dist";
const tmp = "./.tmp";
const jsDir = src + "/js";
const styleDir = src + "/css";
const imgDir = src + "/images";
const langDir = src + "/lang";

module.exports = {
	html: {
		"src": src + "/*.html",
		"dest": dest,
		"useref": {searchPath: ['.tmp', 'app', '.']},
		"cssNano": {safe: true, autoprefixer: false},
		"htmlmin": {
			collapseWhitespace: true,
			minifyCSS: true,
			minifyJS: {compress: {drop_console: true}},
			processConditionalComments: true,
			removeComments: true,
			removeEmptyAttributes: true,
			removeScriptTypeAttributes: true,
			removeStyleLinkTypeAttributes: true
		},
		"uglify": {compress: {drop_console: true}}
	},
	styles: {
		"src": styleDir + "/*",
		"dest": tmp + "/css",
		"autoprefixer": {
			"browsers": ['last 2 versions'],
			"cascade": false
		}
	},
	scripts: {
		"src": jsDir + "/**/*.js",
		"dest": tmp + "/js"
	},
	fonts: {
		"src": src + "/fonts/**/*",
		"dest": dest + "/fonts",
		"tmp": tmp + "/fonts"
	},
	serve: {
		"browsersync": {
			"port": 9000,
			"server": {
				"baseDir": [src],
				"routes": {
					"/bower_components": "bower_components"
				}
			}
		},
		"watch_reload": [
			src + "/*.html",
			src + "/img/**/*",
			tmp + "/fonts/**/*"
		],
		"watch": {
			"styles": styleDir + "/**/*.css",
			"fonts": src + "/fonts/**/*",
			"scripts": jsDir + '/**/*.js'
		},
		"dist": {
			"browsersync": {
				"notify": false,
				"port": 9002,
				"server": {
					"baseDir": [dest]
				}
			}
		}
	},
	clean: [
		dest,
		tmp
	],
	lint: {
		"reload": {
			"stream": true,
			"once": true
		},
		eslint: {fix: true},
		"src": src + "/scripts/**/*.js",
		"dest": src
	},
	wiredep: {
		src: src + '/*.html',
		wiredep: {
			ignorePath: /^(\.\.\/)*\.\./
		},
		dest: src
	},
	build: {
		src: dest + "/**/*",
		size: {
			title: 'build',
			gzip: true
		}
	},
	extras: {
		src: [
			src + '/*',
			'!app/*.html'
		],
		dest: dest
	}
};

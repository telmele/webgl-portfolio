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
		"src": src,
		"dest": dest,
		"useref": {
			"searchPath": [
				'.tmp',
			]
		},
		"cssNano": {
			"preset": [
				"default",
				{
					"discardComments": {
						"removeAll": true
					}
				}
			]
		},
		"htmlmin": {
			"collapseWhitespace": true,
			"minifyCSS": true,
			"minifyJS": true,
		}
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
	img: {
		"src": imgDir + "/**/*",
		"dest": dest + "/images",
		"imagemin": {
			"progressive": true,
			"svgoPlugins": [{
				"removeViewBox": false,
				"cleanupIDs": false
			}]
		}
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
				"baseDir": [tmp, src],
				"routes": {
					"/bower_components": "bower_components"
				}
			}
		},
		"watch_reload": [
			src + "/*.html",
			src + "/img/**/*",
			tmp + "/fonts/**/*",
			tmp + "/css/**/*.css",
			jsDir + "/**/*.js"
		],
		"watch": {
			"styles": styleDir + "/**/*",
			"fonts": src + "/fonts/**/*"
		},
		"test": {
			"browsersync": {
				"notify": false,
				"port": 9001,
				"ui": false,
				"server": {
					"baseDir": "test",
					routes: {
						'/scripts': 'app/scripts',
						'/bower_components': 'bower_components'
					}
				}
			},
			"watch": {
				"spec": "test/spec/**/*.js"
			}
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
		"src": src + "/scripts/**/*.js",
		"test": {
			"src": "test/spec/**/*.js",
			"options": {
				"env": {
					"node": true,
					"mocha": true
				}
			}
		}
	},
	build: {
		src: src + "/**/*",
		dest: dest,
		size: {
			title: 'build',
			gzip: true
		}
	},
	extras: {
		"src": [
			src + "*.*",
			"!" + src + "/*.html"
		],
		"options": {
			"dot": true
		},
		"dest": dest
	}
};

'use strict';

var camera, controls, scene, stats, renderer;
var cssScene, cssRenderer;
var composer, glitchPass, outlinePass;
var poster, wire, ipod, headset;
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

var modelScale = 6;
var SHADOW_MAP_WIDTH = 512;
var SHADOW_MAP_HEIGHT = 512;

function init() {
	initScene();
	// initCSS3D();
	initLights();
	initPostProcessing();
	animate();
}

function initScene() {
	/** CAMERA **/
	camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 1000);
	camera.position.set(15, 5, 0);

	/** CONTROLS **/
	controls = new THREE.OrbitControls(camera);
	controls.enableZoom = false;
	controls.enablePan = false;
	controls.maxPolarAngle = Math.PI / 2;
	controls.minAzimuthAngle = Math.PI / 2;
	controls.maxAzimuthAngle = Math.PI;
	controls.update();
	/** SCENE **/
	scene = new THREE.Scene();
	window.scene = scene;
	cssScene = new THREE.Scene();
	scene.background = new THREE.Color(0x000000);

	/** HELPERS **/
	// X AXIS IS RED // Y AXIS IS GREEN // Z AXIS IS BLUE

	stats = new Stats();
	document.body.appendChild(stats.dom);
	/** CALLBACKS **/
	window.addEventListener('resize', function () {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
	}, false);
	window.addEventListener('mousemove', function () {
		mouse.x = event.clientX / window.innerWidth * 2 - 1;
		mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
	}, false);

	/** RENDERER **/
	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	// renderer.shadowMap.type = THREE.BasicShadowMap;
	document.body.appendChild(renderer.domElement);

	/** CSS RENDERER **/
	cssRenderer = new THREE.CSS3DRenderer();
	cssRenderer.setSize(window.innerWidth, window.innerHeight);
	cssRenderer.domElement.style.position = 'absolute';
	cssRenderer.domElement.style.top = 0;
	document.body.appendChild(cssRenderer.domElement);

	/** WORKSHOP LOADER **/
	var mtlLoader = new THREE.MTLLoader();
	mtlLoader.load("../model/workshop/materials.mtl", function (materials) {
		console.log(materials.getAsArray());
		for (var i = 0; i < materials.getAsArray().length; i++) {
			var mat = materials.getAsArray()[i];
			// mat.emissiveIntensity = 0;
			// mat.emissiveLight = 0;
			// mat.emissive = new THREE.Color (0x000000);

			if (mat.name === "mat2") {
				mat.emissive = new THREE.Color(0xddddff);
				mat.emissiveLight = 1;
				mat.emissiveIntensity = 1;
			}
			if (mat.name === "mat14") {
				mat.emissive = new THREE.Color(0x73FBFF);
				mat.emissiveLight = 1;
				mat.emissiveIntensity = 1;
			}
			if (mat.name === "mat12") {
				mat.emissive = mat.color;
				mat.emissiveLight = 1;
				mat.emissiveIntensity = 0.3;
			}
			if (mat.name === "mat9") {
				mat.emissive = mat.color;
				mat.emissiveLight = 1;
				mat.emissiveIntensity = 0.3;
			}
		}
		console.log(materials);
		var objLoader = new THREE.OBJLoader();
		objLoader.setMaterials(materials);
		objLoader.load("../model/workshop/model.obj", function (object) {
			object.scale.set(object.scale.x * modelScale, object.scale.y * modelScale, object.scale.z * modelScale);
			object.castShadow = true;
			object.receiveShadow = true;
			for (var i = 0; i < object.children.length; i++) {
				var mesh = object.children[i];
				mesh.castShadow = true;
				mesh.receiveShadow = true;
				switch (mesh.name) {
					case "mesh1854588575":
						console.log(mesh);
						object.children.splice(i, 1);
						poster = mesh;
						scene.add(poster);
						poster.scale.set(6, 6, 6);
						break;
					case "mesh1845611640":
						object.children.splice(i, 1);
						ipod = mesh;
						scene.add(ipod);
						// ipod.scale.set(6,6,6);
						break;
					case "mesh466027787":
						object.children.splice(i, 1);
						wire = mesh;
						scene.add(wire);
						wire.scale.set(6, 6, 6);
						break;
					case "mesh850969638":
						object.children.splice(i, 1);
						headset = mesh;
						scene.add(headset);
						headset.scale.set(6, 6, 6);
						break;
					default:
				}
			}
			scene.add(object);
		});
	});
}

function initLights() {

	var neon = new THREE.PointLight(0xddddff, 1, 8);
	neon.position.set(0, 3.5, -4);
	neon.castShadow = true;
	scene.add(neon);

	var laptop = new THREE.PointLight(0xddddff, 1, 8);
	laptop.position.set(-3, 0.5, -3);
	// laptop.castShadow = true;
	scene.add(laptop);

	var laptop2 = new THREE.PointLight(0xddddff, 1, 5);
	laptop2.position.set(-5, 0.5, 4.5);
	scene.add(laptop2);

	var h = new THREE.PointLightHelper(laptop2, 1);
	// scene.add(h);

	var spotLight = new THREE.SpotLight(0xffffff, 0.4);
	spotLight.position.set(6, 12, -6);
	spotLight.castShadow = true;
	spotLight.shadow.mapSize.width = 1024;
	spotLight.shadow.mapSize.height = 1024;
	scene.add(spotLight);

	var spotLightHelper = new THREE.SpotLightHelper(spotLight);
	// scene.add( spotLightHelper );
}

function initPostProcessing() {
	composer = new THREE.EffectComposer(renderer);
	composer.addPass(new THREE.RenderPass(scene, camera));

	outlinePass = new THREE.OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), scene, camera);
	composer.addPass(outlinePass);

	var effectFXAA = new THREE.ShaderPass(THREE.FXAAShader);
	effectFXAA.uniforms['resolution'].value.set(1 / window.innerWidth, 1 / window.innerHeight);
	composer.addPass(effectFXAA);

	var filmPass = new THREE.FilmPass(0.35, 0.025, 648, false);
	filmPass.renderToScreen = true;
	// composer.addPass( filmPass );

	var bloomPass = new THREE.UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85); //1.0, 9, 0.5, 512);
	bloomPass.renderToScreen = true;
	composer.addPass(bloomPass);

	// glitchPass = new THREE.GlitchPass();
	// glitchPass.renderToScreen = true;
	// composer.addPass( glitchPass );
}

function animate(e) {
	requestAnimationFrame(animate);
	stats.begin();
	controls.update();
	raycaster.setFromCamera(mouse, camera);
	// calculate objects intersecting the picking ray
	var intersects = raycaster.intersectObjects(scene.children);
	outlinePass.selectedObjects = [];
	if (intersects.length > 0) {
		outlinePass.selectedObjects.push(intersects[0].object);
	}
	stats.end();
	composer.render();
	// renderer.render( scene, camera );
	// cssRenderer.render(cssScene, camera);
}

init();
//# sourceMappingURL=scene.js.map

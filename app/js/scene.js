/*
 * ----------------------------------------------------------------------------
 * "THE BEER-WARE LICENSE" (Revision 42):
 * <HakunaMacouta> wrote this file.  As long as you retain this notice you
 * can do whatever you want with this stuff. If we meet some day, and you think
 * this stuff is worth it, you can buy me a beer in return.   Thomas Blanc
 * ----------------------------------------------------------------------------
 */

var prod = true;

var camera, controls, scene, stats, renderer, loadingMananger;
var cssScene, cssRenderer;
var composer, glitchPass, outlinePass, clock;
var poster, headset, bird, controller, laptop;
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
const modelScale = 6;

function init() {
	initScene();
	initRenderers();
	initCSS3D();
	initLights();
	initPostProcessing();
	animate();
}

function initScene() {
	/** CAMERA **/
	camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 1000 );
	camera.position.set( 15, 5, 0 );

	clock = new THREE.Clock();
	/** CONTROLS **/
	controls = new THREE.OrbitControls(camera);
	controls.enableZoom = false;
	controls.enablePan = false;
	controls.maxPolarAngle = Math.PI/2;
	controls.minAzimuthAngle = Math.PI/2;
	controls.maxAzimuthAngle = Math.PI;
	controls.update();

	/** SCENE **/
	scene = new THREE.Scene();
	window.scene = scene;
	cssScene = new THREE.Scene();
	scene.background = new THREE.Color( 0x222222 );

	if(!prod) {
		stats = new Stats();
		document.body.appendChild( stats.dom );
	}

	/** CALLBACKS **/
	/** Scale canvas to window size */
	window.addEventListener( 'resize', function() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize( window.innerWidth, window.innerHeight );
	}, false );
	/** Normalize mouse postion when mooving */
	window.addEventListener( 'mousemove', function() {
		mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
		mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
	}, false );
	/** Call the callback set to object if it exists */
	window.addEventListener('mousedown', function() {
		raycaster.setFromCamera( mouse, camera );
		// calculate objects intersecting the picking ray
		var intersects = raycaster.intersectObjects( scene.children );
		if(intersects.length > 0) {
			if(intersects[0].object.callback) {
				intersects[0].object.callback();
			}
		}
	});

	/** WORKSHOP LOADER **/
	var mtlLoader = new THREE.MTLLoader();
	mtlLoader.load( "../model/workshop/materials.mtl", function( materials ) {
		for(var i = 0; i < materials.getAsArray().length; i++) {
			var mat = materials.getAsArray()[i];
			if(mat.name === "mat2") {
				mat.emissive = new THREE.Color( 0xddddff);
				mat.emissiveLight = 1;
				mat.emissiveIntensity = 1;
			}
			if(mat.name === "mat14") {
				mat.emissive = new THREE.Color( 0x73FBFF);
				mat.emissiveLight = 1;
				mat.emissiveIntensity = 1;
			}
			if(mat.name === "mat12") {
				mat.emissive = mat.color;
				mat.emissiveLight = 1;
				mat.emissiveIntensity = 0.3;
			}
			if(mat.name === "mat9") {
				mat.emissive = mat.color;
				mat.emissiveLight = 1;
				mat.emissiveIntensity = 0.3;
			}
		}
		var objLoader = new THREE.OBJLoader();
		objLoader.setMaterials( materials );
		objLoader.load( "../model/workshop/model.obj", function(object) {
			object.scale.set(object.scale.x * modelScale, object.scale.y * modelScale, object.scale.z * modelScale);
			object.castShadow = true;
			object.receiveShadow = true;
			for(var i = 0; i < object.children.length; i++) {
				var mesh = object.children[i];
				mesh.castShadow = true;
				mesh.receiveShadow = true;
				switch(mesh.name) {
					case "mesh1854588575":
						object.children.splice(i, 1);
						poster = mesh;
						scene.add(poster);
						poster.scale.set(6,6,6);
						poster.callback = function() {
							var html = document.getElementById("graphic");
							closeModal();
							modalOpened = html;
							html.className += ' ' + 'is-active';
							triggerGlitch();

						};
						break;
					case "mesh850969638":
						object.children.splice(i, 1);
						headset = mesh;
						scene.add(headset);
						headset.scale.set(6,6,6);
						headset.callback = function() {
							var html = document.getElementById("spotify");
							closeModal();
							modalOpened = html;
							html.className += ' ' + 'is-active';
							triggerGlitch();

						};
						break;
					case "mesh1079008815":
						object.children.splice(i, 1);
						laptop = mesh;
						scene.add(laptop);
						laptop.callback = function () {
							var html = document.getElementById("work");
							closeModal();
							modalOpened = html;
							html.className += ' ' + 'is-active';
							triggerGlitch();
						};
						laptop.scale.set(6,6,6);
						break;
					case "mesh1592160675" :
					case "mesh2013451613":
						object.children.splice(i, 1);
						scene.remove(mesh);
					default:
				}
			}
			scene.add(object);
		});
	});

	/**
	 * Bird loader
	 * @type {THREE.MTLLoader}
	 */
	mtlLoader = new THREE.MTLLoader();
	mtlLoader.setTexturePath("../model/twitter/");
	mtlLoader.load( "../model/twitter/WesternBluebird.mtl", function( materials ) {
		var objLoader = new THREE.OBJLoader();
		materials.getAsArray()[0].color = new THREE.Color(0xffffff);
		materials.preload();
		objLoader.setMaterials(materials);
		objLoader.load("../model/twitter/WesternBluebird.obj", function(object) {
			bird = object.children[0];
			bird.rotation.y = - Math.PI;
			bird.position.set(0,3.25,7);
			bird.callback = function() {
				var html = document.getElementById("twitter");
				closeModal();
				modalOpened = html;
				html.className += ' ' + 'is-active';
				triggerGlitch();
			};
			scene.add(bird);
		})
	});

	/**
	 * Controller loader
	 */
	mtlLoader = new THREE.MTLLoader();
	mtlLoader.setTexturePath("../model/controller/");
	mtlLoader.load( "../model/controller/controller.mtl", function( materials ) {
		var objLoader = new THREE.OBJLoader();
		materials.getAsArray()[0].color = new THREE.Color(0xffffff);
		materials.preload();
		objLoader.setMaterials(materials);
		objLoader.load("../model/controller/controller.obj", function(object) {
			controller = object.children[0];
			controller.scale.set(0.04,0.04,0.04);
			controller.position.set(-1.2,-1.3,3);
			controller.rotation.y = Math.PI/2;
			controller.callback = function() {
				var html = document.getElementById("gamejam");
				closeModal();
				modalOpened = html;
				html.className += ' ' + 'is-active';
				triggerGlitch();
			};
			scene.add(controller);
		})
	});
}

/**
 * Init normal and css3D renderers and attach them to DOM
 */
function initRenderers() {
	/** RENDERER **/
	renderer = new THREE.WebGLRenderer( { antialias: true });
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	// renderer.shadowMap.type = THREE.BasicShadowMap;
	document.body.appendChild( renderer.domElement );

	/** CSS RENDERER **/
	cssRenderer = new THREE.CSS3DRenderer();
	cssRenderer.setSize( window.innerWidth, window.innerHeight );
	cssRenderer.domElement.style.position = 'absolute';
	cssRenderer.domElement.style.top = 0;
	document.body.appendChild( cssRenderer.domElement );
}

/**
 * Construct CSS3D object containing all html and add it to scene
 */
function initCSS3D() {
	var element = document.getElementById("html");
	var cssObject = new THREE.CSS3DObject( element );
	scene.add(cssObject);
}

/**
 * Construct and add to scene 3 lights : Spotlight, laptop and neon
 */
function initLights() {
	var neon = new THREE.PointLight( 0xddddff, 1, 8 );
	neon.position.set( 0, 3.5, -4 );
	neon.castShadow = true;
	scene.add( neon );

	var laptop = new THREE.PointLight( 0xddddff, 1, 8 );
	laptop.position.set( -3, 0.5, -3 );
	// laptop.castShadow = true;
	scene.add( laptop );

	var laptop2 = new THREE.PointLight( 0xddddff, 1, 5);
	laptop2.position.set( -5, 0.5, 4.5 );
	scene.add( laptop2 );

	var h = new THREE.PointLightHelper(laptop2, 1);
	// scene.add(h);

	var spotLight = new THREE.SpotLight( 0xffffff, 0.4);
	spotLight.position.set( 6, 12, -6);
	spotLight.castShadow = true;
	spotLight.shadow.mapSize.width = 1024;
	spotLight.shadow.mapSize.height = 1024;
	scene.add(spotLight);

	var spotLightHelper = new THREE.SpotLightHelper( spotLight );
	// scene.add( spotLightHelper );
}

/**
 * Construct and add to composer postprocessing : Outline, Film, Bloom
 */
function initPostProcessing() {
	composer = new THREE.EffectComposer( renderer );
	composer.addPass( new THREE.RenderPass( scene, camera ) );

	outlinePass = new THREE.OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), scene, camera);
	composer.addPass( outlinePass );

	var effectFXAA = new THREE.ShaderPass( THREE.FXAAShader );
	effectFXAA.uniforms[ 'resolution' ].value.set( 1 / window.innerWidth, 1 / window.innerHeight );
	composer.addPass( effectFXAA );
  
	var filmPass = new THREE.FilmPass( 0.35, 0.025, 648, false );
	filmPass.renderToScreen = true;
	// composer.addPass( filmPass );

	var bloomPass = new THREE.UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 ); //1.0, 9, 0.5, 512);
	bloomPass.renderToScreen = true;
	composer.addPass( bloomPass );


	glitchPass = new THREE.GlitchPass();
	composer.addPass( glitchPass );
}

function triggerGlitch() {
	glitchPass.goWild = true;
	glitchPass.renderToScreen = true;
	setTimeout(function(){
		glitchPass.goWild = false;
		glitchPass.renderToScreen = false;
	}, 350);

}
/**
 * Called every frame, render scene and raycast the mouse
 * @param e
 */
function animate(e) {
	requestAnimationFrame( animate );
	if(!prod) { stats.begin(); }
	controls.update();
	raycaster.setFromCamera( mouse, camera );
	// calculate objects intersecting the picking ray
	var intersects = raycaster.intersectObjects( scene.children );
	outlinePass.selectedObjects = [];
	if(intersects.length > 0) {
		outlinePass.selectedObjects.push(intersects[0].object);
	}
	if(!prod) { stats.end(); }
	var delta = clock.getDelta();
	composer.render(delta);
	// renderer.render( scene, camera );
	// cssRenderer.render(cssScene, camera);

}

init();

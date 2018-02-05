var camera, controls, scene, stats, renderer;
var cssScene, cssRenderer;
var composer, glitchPass, outlinePass;
var poster;
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

const modelScale = 6;

function init() {
	initScene();
	initCSS3D();
	initLights();
	initPostProcessing();
	animate();
}

function initScene() {
	/** CAMERA **/
	camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 1000 );
	camera.position.set( 15, 5, 0 );

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
	cssScene = new THREE.Scene();
	scene.background = new THREE.Color( 0x000000 );

	/** HELPERS **/
	// X AXIS IS RED // Y AXIS IS GREEN // Z AXIS IS BLUE
	var axesHelper = new THREE.AxesHelper( 100 );
	scene.add( axesHelper );

	stats = new Stats();
	document.body.appendChild( stats.dom );
	/** CALLBACKS **/
	window.addEventListener( 'resize', function() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize( window.innerWidth, window.innerHeight );
	}, false );
	window.addEventListener( 'mousemove', function() {
		mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
		mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

		raycaster.setFromCamera( mouse, camera );
		// calculate objects intersecting the picking ray
		var intersects = raycaster.intersectObjects( scene.children );
		if(intersects.length > 0) {
			outlinePass.selectedObjects = [];
			if(poster !== undefined) {
				outlinePass.selectedObjects.push(poster);
			}
		}
	}, false );

	/** RENDERER **/
	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );

	cssRenderer = new THREE.CSS3DRenderer();
	cssRenderer.setSize( window.innerWidth, window.innerHeight );
	cssRenderer.domElement.style.position = 'absolute';
	cssRenderer.domElement.style.top = 0;
	document.body.appendChild( cssRenderer.domElement );


	var mtlLoader = new THREE.MTLLoader();
	mtlLoader.load( "../model/workshop/materials.mtl", function( materials ) {
		materials.opacity   = 0;
		materials.blending  = THREE.NoBlending;
		materials.preload();
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
				if(mesh.name === "mesh1854588575") {
					poster = mesh;
					poster.callback = function() { console.log( this.name ); }
				}
			}
			poster.scale.set(1,1,1);
			console.log(object);
			scene.add(object);
		});
	});
}

function initLights() {
	var ambiantLight = new THREE.AmbientLight( 0x404040 ); // soft white light
	scene.add( ambiantLight );
	var light = new THREE.PointLight( 0x5555ff, 1, 100 );
	light.position.set( 0, 4, -4 );
	scene.add( light );
	light.castShadow = true;
	var pointLightHelper = new THREE.PointLightHelper( light, 1 );
	scene.add( pointLightHelper );
}
var cube;
function initPostProcessing() {
	composer = new THREE.EffectComposer( renderer );
	composer.addPass( new THREE.RenderPass( scene, camera ) );
	outlinePass = new THREE.OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), scene, camera);
	composer.addPass( outlinePass );
	glitchPass = new THREE.GlitchPass();
	glitchPass.renderToScreen = true;
	composer.addPass( glitchPass );
}

function animate(e) {
	requestAnimationFrame( animate );
	stats.begin();
	controls.update();
	stats.end();
	composer.render();
	// renderer.render( scene, camera );
	// cssRenderer.render(cssScene, camera);

}

init();

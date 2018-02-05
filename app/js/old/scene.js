var camera, scene, renderer, controls, stats;
var seaGeometry, seaShader, seaMesh;
var birds, bird;
var lighthouse, lighthouseLight;
var sky, sunSphere;
const planeSize = 200;

initScene();
initMesh();
initGeometry();
initShader();
initSeaMesh();
animate();

function initScene() {
    /** CAMERA **/
    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 1000 );
    camera.position.set( -15, 10, 22 );

    /** CONTROLS **/
    controls = new THREE.OrbitControls(camera);
    controls.update();
    /** SCENE **/
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xff0000 );

    /** HELPERS **/
    // X AXIS IS RED // Y AXIS IS GREEN // Z AXIS IS BLUE
    let axesHelper = new THREE.AxesHelper( planeSize );
    scene.add( axesHelper );

    let gridHelper = new THREE.GridHelper( planeSize, planeSize );
    // scene.add( gridHelper );

    stats = new Stats();
    document.body.appendChild( stats.dom );
    /** CALLBACKS **/
	window.addEventListener( 'resize', onWindowResize, false );

	/** RENDERER **/
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );


	let light = new THREE.HemisphereLight(0xffffdd, 0x000000, 2);
	scene.add(light);
	let helper = new THREE.HemisphereLightHelper( light, 10 );
	scene.add( helper );

	lighthouseLight = new THREE.SpotLight( 0xffffff, 1, 100, Math.PI/12);
	lighthouseLight.castShadow = true;
	lighthouseLight.position.y = 15;
	lighthouseLight.rotation.x = Math.PI/2;

	lighthouseLight.shadow.mapSize.width = 1024;
	lighthouseLight.shadow.mapSize.height = 1024;
	lighthouseLight.shadowMapVisible = true;

	// scene.add(lighthouseLight);
	var spotLightHelper = new THREE.SpotLightHelper( lighthouseLight );
	// scene.add( spotLightHelper );

    sky = new THREE.Sky();
    sky.scale.setScalar(700);
    scene.add(sky);
    sunSphere = new THREE.Mesh(
    	new THREE.SphereBufferGeometry(200,16,8),
		new THREE.MeshBasicMaterial( {color : 0xffffff })
	);
    sunSphere.position.y = - 700;
    scene.add(sunSphere);

	var effectController  = {
		turbidity: 10,
		rayleigh: 2,
		mieCoefficient: 0.005,
		mieDirectionalG: 0.8,
		luminance: 1,
		inclination: 0.49, // elevation / inclination
		azimuth: 0.25, // Facing front,
		sun: ! true
	};

	var distance = 40000;

	function guiChanged() {
		var uniforms = sky.material.uniforms;
		uniforms.turbidity.value = effectController.turbidity;
		uniforms.rayleigh.value = effectController.rayleigh;
		uniforms.luminance.value = effectController.luminance;
		uniforms.mieCoefficient.value = effectController.mieCoefficient;
		uniforms.mieDirectionalG.value = effectController.mieDirectionalG;
		var theta = Math.PI * ( effectController.inclination - 0.5 );
		var phi = 2 * Math.PI * ( effectController.azimuth - 0.5 );
		sunSphere.position.x = distance * Math.cos( phi );
		sunSphere.position.y = distance * Math.sin( phi ) * Math.sin( theta );
		sunSphere.position.z = distance * Math.sin( phi ) * Math.cos( theta );
		sunSphere.visible = effectController.sun;
		uniforms.sunPosition.value.copy( sunSphere.position );
		renderer.render( scene, camera );
	}

	var gui = new dat.GUI();
	gui.add( effectController, "turbidity", 1.0, 20.0, 0.1 ).onChange( guiChanged );
	gui.add( effectController, "rayleigh", 0.0, 4, 0.001 ).onChange( guiChanged );
	gui.add( effectController, "mieCoefficient", 0.0, 0.1, 0.001 ).onChange( guiChanged );
	gui.add( effectController, "mieDirectionalG", 0.0, 1, 0.001 ).onChange( guiChanged );
	gui.add( effectController, "luminance", 0.0, 2 ).onChange( guiChanged );
	gui.add( effectController, "inclination", 0, 1, 0.0001 ).onChange( guiChanged );
	gui.add( effectController, "azimuth", 0, 1, 0.0001 ).onChange( guiChanged );
	gui.add( effectController, "sun" ).onChange( guiChanged );
	guiChanged();



}

function onWindowResize(){
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}


function initMesh() {

    /** BACKGROUND **/
    // scene.background = new THREE.CubeTextureLoader()
    //     .setPath( '../images/CloudyCrown_01_Midday/Textures/' )
    //     .load( [
    //         'CloudyCrown_Midday_Left.png',
    //         'CloudyCrown_Midday_Front.png',
    //         'CloudyCrown_Midday_Up.png',
    //         'CloudyCrown_Midday_Down.png',
    //         'CloudyCrown_Midday_Right.png',
    //         'CloudyCrown_Midday_Back.png'
    //     ] );
    /** LIGHTHOUSE **/
    loadObj("../model/lighthouse/");
    initBirds();
}
function initBirds() {
    birds = [];
    boids = [];

    for ( var i = 0; i < 200; i ++ ) {

        boid = boids[ i ] = new Boid();
        boid.position.x = Math.random() * 400 - 200;
        boid.position.y = Math.random() * 400 - 200;
        boid.position.z = Math.random() * 400 - 200;
        boid.velocity.x = Math.random() * 2 - 1;
        boid.velocity.y = Math.random() * 2 - 1;
        boid.velocity.z = Math.random() * 2 - 1;
        boid.setAvoidWalls( true );
        boid.setWorldSize( 300, 100, 300 );

        bird = birds[ i ] = new THREE.Mesh( new Bird(), new THREE.MeshBasicMaterial( { color:Math.random() * 0xffffff, side: THREE.DoubleSide } ) );
        bird.phase = Math.floor( Math.random() * 62.83 );
        scene.add( bird );


    }
}

function loadObj(path, callbackOnSuccess) {
    var obj;
    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setTexturePath(path);
    mtlLoader.load( path + "lighthouse.mtl", function( materials ) {
        console.log(materials);
        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials( materials );
        objLoader.load( path + "lighthouse.obj" ,
            //On Success
            function ( object ) {
                obj = object;
                object.receiveShadow = true;
                object.position.set(0,1,0);

                scene.add(obj);
            },
            //On Progress
            function() {
                console.warn("OnProgress");
            },
            //On Error
            function() {
                console.error("Obj not loaded");
            });
    });
}

function animate(e) {
    requestAnimationFrame( animate );
    stats.begin();
    animateBirds();
    seaShader.uniforms.uTime.value = e * 0.001;
    lighthouseLight.rotation.z = e * 0.001;
    stats.end();
    controls.update();
    // console.log(camera.position);

    renderer.render( scene, camera );

}

function animateBirds() {
    for ( var i = 0, il = birds.length; i < il; i++ ) {

        boid = boids[ i ];
        boid.run( boids );

        bird = birds[ i ];
        bird.position.copy( boids[ i ].position );
        bird.position.y += 100;

        var color = bird.material.color;
        color.r = color.g = color.b = ( 500 - bird.position.z ) / 1000;

        bird.rotation.y = Math.atan2( - boid.velocity.z, boid.velocity.x );
        bird.rotation.z = Math.asin( boid.velocity.y / boid.velocity.length() );

        bird.phase = ( bird.phase + ( Math.max( 0, bird.rotation.z ) + 0.1 )  ) % 62.83;
        bird.geometry.vertices[ 5 ].y = bird.geometry.vertices[ 4 ].y = Math.sin( bird.phase ) * 5;
    }
}
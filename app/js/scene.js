var camera, scene, renderer, controls;
var seaGeometry, seaShader, seaMesh;
var birds, bird;

initScene();
initMesh();
initGeometry();
initShader();
initSeaMesh();
animate();

var lightHouse;

function initScene() {
    /** CAMERA **/
    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 1000 );
    camera.position.set( 0, 20, 100 );

    /** CONTROLS **/
    controls = new THREE.OrbitControls(camera);
    controls.update();
    /** SCENE **/
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xff0000 );

    /** HELPERS **/
    var axesHelper = new THREE.AxesHelper( 100 );
    scene.add( axesHelper );

    var gridHelper = new THREE.GridHelper( 100, 100 );
    scene.add( gridHelper );

    /** CALLBACKS **/

    /** RENDERER **/
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
}

function initMesh() {

    /** BACKGROUND **/
    scene.background = new THREE.CubeTextureLoader()
        .setPath( '../images/CloudyCrown_01_Midday/Textures/' )
        .load( [
            'CloudyCrown_Midday_Left.png',
            'CloudyCrown_Midday_Front.png',
            'CloudyCrown_Midday_Up.png',
            'CloudyCrown_Midday_Down.png',
            'CloudyCrown_Midday_Right.png',
            'CloudyCrown_Midday_Back.png'
        ] );
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
        boid.setWorldSize( 500, 500, 400 );

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
        materials.preload();
        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials( materials );
        objLoader.load( path + "lighthouse.obj" ,
            //On Success
            function ( object ) {
                obj = object;
                object.position.set(0,-3,-10);
                object.scale.set(0.4,0.4,0.4);

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
    animateBirds();
    seaShader.uniforms.uTime.value = e * 0.001;
    controls.update();
    renderer.render( scene, camera );

}

function animateBirds() {
    for ( var i = 0, il = birds.length; i < il; i++ ) {

        boid = boids[ i ];
        boid.run( boids );

        bird = birds[ i ];
        bird.position.copy( boids[ i ].position );

        var color = bird.material.color;
        color.r = color.g = color.b = ( 500 - bird.position.z ) / 1000;

        bird.rotation.y = Math.atan2( - boid.velocity.z, boid.velocity.x );
        bird.rotation.z = Math.asin( boid.velocity.y / boid.velocity.length() );

        bird.phase = ( bird.phase + ( Math.max( 0, bird.rotation.z ) + 0.1 )  ) % 62.83;
        bird.geometry.vertices[ 5 ].y = bird.geometry.vertices[ 4 ].y = Math.sin( bird.phase ) * 5;
    }
}
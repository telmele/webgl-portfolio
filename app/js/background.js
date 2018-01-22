var camera, scene, renderer;
var geometry, material, mesh;
var controls;

initScene();
animate();

var lightHouse;

function initScene() {

    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
    camera.position.z = 0;
    controls = new THREE.OrbitControls( camera );
    controls.update();

    scene = new THREE.Scene();

    scene.background = new THREE.CubeTextureLoader()
        .setPath( '../images/CloudyCrown_01_Midday/Textures/' )
        .load( [
            'CloudyCrown_Midday_Up.png',
            'CloudyCrown_Midday_Front.png',
            'CloudyCrown_Midday_Left.png',
            'CloudyCrown_Midday_Down.png',
            'CloudyCrown_Midday_Back.png',
            'CloudyCrown_Midday_Right.png'
        ] );

    lightHouse = loadObj("../model/lighthouse/Lighthouse");

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
}

function loadObj(path, callbackOnSuccess) {
    var obj;
    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.load( path + ".mtl", function( materials ) {
        materials.preload();
        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials( materials );
        objLoader.load( path + ".obj" ,
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

    return obj;
}

function animate() {

    requestAnimationFrame( animate );
    controls.update();
    renderer.render( scene, camera );

}
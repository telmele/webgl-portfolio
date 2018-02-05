function initCSS3D() {
	about();
}

function about() {
	var element = document.getElementById("about");
	element.style.background = "#ff0000";
	var cssObject = new THREE.CSS3DObject( element );
	cssObject.position.set(0,0,0);
	cssObject.scale.set(0.1,0.1,0.1);
	cssObject.rotation.y = Math.PI/3;
	// cssScene.add(cssObject);
}

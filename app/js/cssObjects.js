function initCSS3D() {
	about();
}

function about() {
	var element = document.getElementById("about");
	element.style.background = "#ff0000";
	var cssObject = new THREE.CSS3DObject( element );
	cssScene.add(cssObject);
}

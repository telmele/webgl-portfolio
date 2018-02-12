/*
 * ----------------------------------------------------------------------------
 * "THE BEER-WARE LICENSE" (Revision 42):
 * <HakunaMacouta> wrote this file.  As long as you retain this notice you
 * can do whatever you want with this stuff. If we meet some day, and you think
 * this stuff is worth it, you can buy me a beer in return.   Thomas Blanc
 * ----------------------------------------------------------------------------
 */

function initCSS3D() {
	about();
}

function about() {
	var element = document.getElementById("html");
	var cssObject = new THREE.CSS3DObject( element );
	scene.add(cssObject);
}

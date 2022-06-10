var THREE = require('three');

var World = (function() {
  // Internals

  var camera, scene, renderer, frameCallback, container, self = {};

  var paused = false;

  function render() {    // in oreder to render the scene
    if (paused) return;
    if(frameCallback) {
      if(frameCallback() === false) {
        requestAnimationFrame(render);
        return;
      }
    }
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }

  function onResize() {  //size of the window and camera aspect 
    var width  = container ? container.clientWidth  : window.innerWidth,
        height = container ? container.clientHeight : window.innerHeight;

	camera.aspect = width / height;
	camera.updateProjectionMatrix();

	renderer.setSize( width, height );

  }



  self.init = function(options) {
    if(!options) options = {};

    var width  = options.container ? options.container.clientWidth  : window.innerWidth,
        height = options.container ? options.container.clientHeight : window.innerHeight;

    camera = new THREE.PerspectiveCamera(45, width/height, 1, options.farPlane || 2000);
    camera.position.z = options.camDistance || 100;
    frameCallback = options.renderCallback;
    container = options.container;

    // scene

    scene = new THREE.Scene();

    var ambient = new THREE.AmbientLight(options.ambientLightColor === undefined ? 0xffffff : options.ambientLightColor);
    scene.add(ambient);
	  
     //renderer properties
    renderer = new THREE.WebGLRenderer(options.rendererOpts);
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    if(options.clearColor) renderer.setClearColor(options.clearColor);

    var container = options.container || document.body;
    container.appendChild(renderer.domElement);

    window.addEventListener( 'resize', onResize, false );
  }

	
// to add and remove objects from the world
  self.add = function(object) {   
    scene.add(object);
  }
  self.remove = function(object) {
    scene.remove(object);
  }

  self.recalculateSize = onResize;

	
// functions used for the state of the world
	
  self.start = function() {
    render();
  }

  self.pause = function() {
    paused = true;
  }

  self.resume = function() {
    paused = false;
    render();
  }

  self.isPaused = function() {
    return paused;
  }

  self.getCamera = function() { return camera; };
  self.getRenderer = function() { return renderer; };
  self.getScene = function() { return scene; };

  return self;
})();

module.exports = World;

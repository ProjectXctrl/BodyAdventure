var THREE = require('three'),
    ObjLoader = require('./objloader')

var loader = new ObjLoader()
var virusMtl = new THREE.MeshLambertMaterial({
  map: THREE.ImageUtils.loadTexture('models/covid.png')
})

var Virus = function(virusType) {
  var mesh = new THREE.Object3D(), self = this

  // Speed of motion and rotation
  mesh.velocity = Math.random() * 4 + 2
  mesh.vRotation = new THREE.Vector3(Math.random(), Math.random(), Math.random())

  this.bbox = new THREE.Box3() //collision-detection box

  loader.load('models/covid'  + '.obj', function(obj) {  //load blender virus model
    obj.traverse(function(child) {
      if(child instanceof THREE.Mesh) {
        child.material = virusMtl
        child.castShadow = true
        child.receiveShadow = true
      }
    })

    obj.scale.set(10,10,10)

    mesh.add(obj)
    mesh.position.set(-50 + Math.random() * 100, -50 + Math.random() * 100, -1500 - Math.random() * 1500)

    self.bbox.setFromObject(obj)  //set size of collision detection box based on virus size
    self.loaded = true
  })

  this.reset = function(z) {    //reset them back where they come from
    mesh.velocity = Math.random() * 2 + 2
    mesh.position.set(-50 + Math.random() * 100, -50 + Math.random() * 100, z - 1500 - Math.random() * 1500)
  }

  this.update = function(z) {   //update current position
    mesh.position.z += mesh.velocity
    mesh.rotation.x += mesh.vRotation.x * 0.02;
    mesh.rotation.y += mesh.vRotation.y * 0.02;
    mesh.rotation.z += mesh.vRotation.z * 0.02;

    if(mesh.children.length > 0) this.bbox.setFromObject(mesh.children[0])

    if(mesh.position.z > z) {
      this.reset(z)
    }
  }

  this.getMesh = function() {   // to get the finished product (viruses)
    return mesh
  }

  return this
}

module.exports = Virus


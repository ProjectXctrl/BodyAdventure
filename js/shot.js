var THREE = require('three')

var shotMtl = new THREE.MeshLambertMaterial({
  map: THREE.ImageUtils.loadTexture('models/capsule2.png')
})

var Shot = function(initialPos) {
  this.mesh = new THREE.Mesh(
    new THREE.CylinderGeometry( 5, 5, 20, 32 ),
    shotMtl
  )
  this.mesh.position.copy(initialPos)
  this.mesh.rotateX(Math.PI/2)

  this.bbox = new THREE.Box3()

  this.getMesh = function() {
    return this.mesh
  }

  this.update = function(z) {
    this.mesh.position.z -= 15
    this.bbox.setFromObject(this.mesh)

    if(Math.abs(this.mesh.position.z - z) > 1000) {
      return false
      delete this.mesh
    }

    return true
  }

  return this
}

module.exports = Shot

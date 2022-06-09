var THREE = require('three')

//build half a capsule
function halfcylinder(color){
  const geometry = new THREE.CylinderGeometry( 5, 5, 20, 32 );
  const material = new THREE.MeshPhongMaterial({ color: color });
  const halfcylinder = new THREE.Mesh(geometry, material);
  return halfcylinder;
}

//build full capsule
function createCapsule() {
  const bullet = new THREE.Group();
  
  const capsule1 = halfcylinder("grey");
  capsule1.position.y = 0;
  capsule1.position.x = 0;
  bullet.add(capsule1);
  
  const capsule2 = halfcylinder("blue");
  capsule2.position.y = 20;  
  capsule2.position.x = 0;
  bullet.add(capsule2);

  return bullet;
}

var Shot = function(initialPos) {
  this.mesh = createCapsule()
  this.mesh.position.copy(initialPos)
  this.mesh.rotateX(Math.PI/2)
  this.mesh.scale.set(1,0.5,1)

  this.bbox = new THREE.Box3()

  this.getMesh = function() {
    return this.mesh
  }

  this.update = function(z) {
    this.mesh.position.z -= 25
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

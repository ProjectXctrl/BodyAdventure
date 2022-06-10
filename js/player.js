var THREE = require('three'),
    ObjMtlLoader = require('./objmtlloader'),
    loader = new ObjMtlLoader()

var spaceship = null


var Player = function(parent) {
  this.loaded = false
  var self = this, spaceship = null
  self.bbox = new THREE.Box3()   //collision detection box
    
 //camera effects
  this.firstPerson = () =>{
    spaceship.position.set(0, -10,12)
  }
  this.thirdPerson = () =>{
    spaceship.position.set(0, -25, -100)
  }
  
  this.setZPos=(zPos)=>{ //set z position of spaceship
     spaceship.position.set(0, -25, zPos)
  }

  //get x,y & z position of spaceship
  this.getXPos=()=>{
    return spaceship.position.x
  }
  this.getYPos=()=>{
    return spaceship.position.y
  }
  this.getZPos=()=>{
    return spaceship.position.z;
  }

  if(spaceship === null) {   // to load our spaceship and establish its properties
    loader.load('models/spaceship.obj', 'models/spaceship.mtl', function(mesh) {
      mesh.scale.set(0.2, 0.2, 0.2)
      mesh.rotation.set(0, Math.PI, 0)
      spaceship = mesh
      spaceship.position.set(0, -25, -100)
      parent.add(spaceship)
      self.loaded = true
      self.bbox.setFromObject(spaceship)
      spaceship.traverse(function(child) {
        if(child instanceof THREE.Mesh) {
          child.receiveShadow = true
        }
      })
    })
  } else {
    parent.add(spaceship)
    self.loaded = true
  }

  this.update = function() { 
    if(!spaceship) return
    this.bbox.setFromObject(spaceship)  //sets collision detection box size based of spaceship size
  }
}

module.exports = Player

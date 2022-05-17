var World = require('three-world'),
    THREE = require('three'),
    Tunnel = require('./tunnel'),
    Player = require('./player'),
    Asteroid = require('./asteroid'),
    Shot = require('./shot')

var NUM_ASTEROIDS = 10

var timer = document.getElementById("time").innerHTML;
  if(timer==="EXPIRED" && score>=200 ){ //if timer expires and score is at least 200 
    World.pause();
    alert("You Win!")
    window.location.reload()
  } 
  else if (timer==="EXPIRED" && score<200 ){ //if timer expires and score is less than 200
    World.pause();
    alert("You haven't destroyed enough viruses")
    window.location.reload()

  }


function render() {
  cam.position.z -= 1
  tunnel.update(cam.position.z)
  player.update()

  for(var i=0; i<shots.length; i++) {
    if(!shots[i].update(cam.position.z)) {
      World.getScene().remove(shots[i].getMesh())
      shots.splice(i, 1)
    }
  }

  for(var i=0; i<NUM_ASTEROIDS; i++) {
    if(!asteroids[i].loaded) continue

    asteroids[i].update(cam.position.z)
    if(player.loaded && player.bbox.isIntersectionBox(asteroids[i].bbox)) {   //if spaceship hits a virus
      asteroids[i].reset(cam.position.z)
      health -= 20
      document.getElementById("health").textContent = health
      if(health < 1) {
        World.pause()
        alert("Game over")
        window.location.reload()
      }
    }

    for(var j=0; j<shots.length; j++) {
      if(asteroids[i].bbox.isIntersectionBox(shots[j].bbox)) {  //if shot hits virus
        score += 10
        document.getElementById("score").textContent = score
        asteroids[i].reset(cam.position.z)
        World.getScene().remove(shots[j].getMesh())
        shots.splice(j, 1)
        break
      }
    }
  }
}

var health = 100, score = 0

World.init({ renderCallback: render, clearColor: "#620505"})
var cam = World.getCamera()

var tunnel = new Tunnel()
World.add(tunnel.getMesh())

var player = new Player(cam)
World.add(cam)

var asteroids = [], shots = []

for(var i=0;i<NUM_ASTEROIDS; i++) {
  asteroids.push(new Asteroid(Math.floor(Math.random() * 5) + 1))
  World.add(asteroids[i].getMesh())
}

World.getScene().fog = new THREE.FogExp2("#620505", 0.00110)

World.start()

//key is pressed and let go
window.addEventListener('keyup', function(e) {
  switch(e.keyCode) {
    case 32: // Space
      var shipPosition = cam.position.clone()
      shipPosition.sub(new THREE.Vector3(0, 25, 100))

      var shot = new Shot(shipPosition)
      shots.push(shot)
      World.add(shot.getMesh())
    break
  }
})

//key is pressed
window.addEventListener('keydown', function(e) {
  if(e.key === "ArrowLeft"&& cam.position.x>-55) {   //left

    cam.position.x -= 5
  } 
  else if(e.key === "ArrowRight"&& cam.position.x<55 ) {   //right
   
    cam.position.x += 5 ;
  }

  if(e.key === "ArrowUp" && cam.position.y<60) {   //up
    cam.position.y += 5
  } 
  
  else if(e.key === "ArrowDown" && cam.position.y>-20) {   //down
    
    cam.position.y -= 5
  }
})


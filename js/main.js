var World = require('three-world'),
    THREE = require('three'),
    Tunnel = require('./tunnel'),
    Player = require('./player'),
    Asteroid = require('./asteroid'),
    Shot = require('./shot')

var NUM_ASTEROIDS = 10
var LEVEL = 1
function render() {
  
 
  tunnel.update(cam.position.z)
  player.update()
  document.getElementById("level").textContent=LEVEL;
  
  if(LEVEL==1){
    cam.position.z -= 1.5
    document.getElementById("target").textContent=200;

  }
if(LEVEL==2){
    cam.position.z -= 2.5
    document.getElementById("target").textContent=400;
  }

  if(LEVEL==3){
    cam.position.z -= 4
    document.getElementById("target").textContent=600;
  }


  
  var timer = document.getElementById("time").innerHTML;
  if(timer==="0m 0s" && score>=200 && LEVEL==1 ){ //if timer expires and score is at least 200 
    
    LEVEL+=1
    document.getElementById("target").textContent==400;
    alert("You Win Level 1! ")
 
  } 
  else if (timer==="0m 0s" && score<200 && LEVEL==1){ //if timer expires and score is less than 200
    World.pause();
    alert("You haven't destroyed enough viruses")
    window.location.reload()

  }
  else if (score>=500&& LEVEL==2){
    LEVEL+=1
    alert("You Win Level 2!")

  }

  else if (score>=700 && LEVEL==3){
    World.pause();
    alert("Congrats, you win the game!")
    window.location.reload()

  }
  
  

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
        LEVEL=1;
        World.pause()
        alert("Game over")
        window.location.reload()
      }
    }
    

    for(var j=0; j<shots.length; j++) {
      if(asteroids[i].bbox.isIntersectionBox(shots[j].bbox)) {  //if shot hits virus
        var audio = new Audio('./song/alien3.wav');
        score += 10
        document.getElementById("score").textContent = score
        asteroids[i].reset(cam.position.z)
        World.getScene().remove(shots[j].getMesh())
        shots.splice(j, 1)
        audio.play();
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

//when key is pressed and let go, shoot
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


document.addEventListener("mousedown", function(e) {  //when mouse is clicked, shoot
  var audio = new Audio('./song/hit.mp3');
      audio.play();
      var shipPosition = cam.position.clone()
      shipPosition.sub(new THREE.Vector3(0, 25, 100))
      var shot = new Shot(shipPosition)
      shots.push(shot)
      World.add(shot.getMesh())

});

//when key is pressed
window.addEventListener('keydown', function(e) {
  if(e.key === "ArrowLeft"&& cam.position.x>-55) {   //move left

    cam.position.x -= 5
  } 
  else if(e.key === "ArrowRight"&& cam.position.x<55 ) {   //move right
   
    cam.position.x += 5 ;
  }

  if(e.key === "ArrowUp" && cam.position.y<60) {   //move up
    cam.position.y += 5
  } 
  
  else if(e.key === "ArrowDown" && cam.position.y>-20) {   //move down
    
    cam.position.y -= 5
  }
})


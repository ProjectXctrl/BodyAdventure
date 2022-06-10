var World = require('./world'),
    THREE = require('three'),
    Tunnel = require('./tunnel'),
    Player = require('./player'),
    Virus = require('./Virus'),
    Shot = require('./shot'),
    Timer = require('./timer')
  
    var object;

    //for calulcating next position in movement
    var minY = Number.NEGATIVE_INFINITY;
    var maxY = Number.POSITIVE_INFINITY;
    
    //flags for direction of movement
    var moveLeft = false;
    var moveRight = false;
    var moveUp = false;
    var moveDown = false;

var NUM_VIRUS = 10//number of virus generated at one time
var LEVEL = 1  //level number

//x,y & z positions of shots 
var px=0   
var py=25
var pz=100;
var ammo;
var shipZPos = -100;

var lvl1flag =true;
var lvl2flag =true;
var lvl3flag =true;

/////////////////////////////
function render() {


  update();
  tunnel.update(cam.position.z)
  player.update()
  document.getElementById("level").textContent=LEVEL;

  if(LEVEL==1){

    if(lvl1flag){
      
     var time2 = new Timer(1,2);
      score=0
      ammo=60
      lvl1flag=false;
    }
    cam.position.z -= 4.5
    document.getElementById("target").textContent=400;
  }

  if(LEVEL==2){

    if(lvl2flag){
      var time2 = new Timer(1,2);
      score=0
      ammo=70
      lvl2flag=false;
    }

    cam.position.z -= 5.5
    document.getElementById("target").textContent=500;
  }

  if(LEVEL==3){

    if(lvl3flag){
      var time2 = new Timer(1,2);
      score=0
      ammo=90
      lvl3flag=false
    }
 
    cam.position.z -= 6.5
    document.getElementById("target").textContent=600;
  }


  if(ammo>0){document.getElementById("ammo").textContent=ammo;}

  else{document.getElementById("ammo").textContent="No Ammo";  }

  
  var timer = document.getElementById("time").innerHTML;
  if(timer==="0m 0s" && score>=400 && LEVEL==1 ){ //if timer expires and score is at least 400 
    
    LEVEL+=1
    document.getElementById("target").textContent==400;
   alert("You Win Level 1! ")
 
  } 

  else if (timer==="0m 0s"&& score>=500&& LEVEL==2){   //if timer expires and score is at least 600 
    LEVEL+=1
    alert("You Win Level 2!")

  }

  else if (timer==="0m 0s" && score>=600 && LEVEL==3){  //if timer expires and score is at least 700 
    World.pause();
    alert("Congrats, you win the game!")
    window.location.reload()

  }
  else if ((timer==="0m 1s" && score<400 && LEVEL==1)||(timer==="0m 1s" && score<500 && LEVEL==2)||(timer==="0m 1s" && score<600 && LEVEL==3)){ //if timer expires and score required for each level has not been reached
    World.pause();
    alert("You haven't destroyed enough viruses")
    window.location.reload()

  }
  
  

  for(var i=0; i<shots.length; i++) {
    if(!shots[i].update(cam.position.z)) {
      World.getScene().remove(shots[i].getMesh())
      shots.splice(i, 1)
    }
  }

  for(var i=0; i<NUM_VIRUS; i++) {
    if(!virus[i].loaded) continue

    virus[i].update(cam.position.z)
    if(player.loaded && player.bbox.isIntersectionBox(virus[i].bbox)) {   //if spaceship hits a virus
      virus[i].reset(cam.position.z)
      var time = document.getElementById("time").textContent;
      if(time !="1m 0s" && time !="0m 59s" && time !="0m 58s" && time !="0m 57s" ){
      health -= 20}
      
      document.getElementById("health").textContent = health
      if(health < 1) {
        LEVEL=1;
        World.pause()
       window.location.href = './gameOver.html'; //relative to domain
     
      }
    }
    

    for(var j=0; j<shots.length; j++) {
      if(virus[i].bbox.isIntersectionBox(shots[j].bbox)) {  //if shot hits virus
        var audio = new Audio('./song/alien3.wav');
        audio.play();                                       //play shooting sound
        score += 10
        document.getElementById("score").textContent = score  //change displayed score
        virus[i].reset(cam.position.z)                      //reset virus' position
        World.getScene().remove(shots[j].getMesh())        //remove shots
        shots.splice(j, 1)
        audio.volume = 0.3
        
        break
      }
    }

  }

}
////////////////////////////////////////////////////////////////////

var health = 100, score = 0

World.init({ renderCallback: render, clearColor: "#620505"})

var cam = World.getCamera()
object=cam;


//directional light
const directionalLight = new THREE.DirectionalLight( 0xffffff, 3);
directionalLight.position.set(1,0,0)
World.add(directionalLight )

//point light
const pointlight = new THREE.PointLight(0xffffff, 0.5, 1000);
pointlight.castShadow = true;
pointlight.position.set(0,25, -100); 

//Set up shadow properties for the light
pointlight.shadow.mapSize.width =1000; 
pointlight.shadow.mapSize.height = 1000; 
cam.add(pointlight)


var tunnel = new Tunnel()
World.add(tunnel.getMesh())


var player = new Player(cam)
World.add(cam)

var virus = [], shots = []

// to add viruses to the world
for(var i=0;i<NUM_VIRUS; i++) {
  virus.push(new Virus(Math.floor(Math.random() * 5) + 1))   
  World.add(virus[i].getMesh())
}

World.getScene().fog = new THREE.FogExp2("#620505", 0.00165)

World.start()

//key is pressed and let go
window.addEventListener('keyup', function(e) { 
  switch(e.keyCode) {
      case 32: // if the key is Space, shoot
        ammo--;
        if(ammo>0){
           //establish sound for shot
          var audio = new Audio('./song/hit.mp3');
          audio.volume = 0.2
          audio.play();
          
          //etablish ship position
          var shipPosition = cam.position.clone()
          shipPosition.sub(new THREE.Vector3(px, py, pz))

          //create and shoot the shot
          var shot = new Shot(shipPosition)
          shots.push(shot)
          World.add(shot.getMesh())
        }
      break

      case 37: /*left*/
      case 65: /*A*/ moveLeft = false; break;

      case 39: /*right*/
      case 68: /*D*/ moveRight = false; break;

      case 83: /*S*/
      case 40:/*up*/ moveUp = false; break;
  
      case 87: /*W*/
      case 38: /*down*/ moveDown = false; break;

      case 88: // X
      
      //update starting shot position
        px=0;
        py=10;
        pz=12;
        player.firstPerson(); // for first person camera affect
      break
      
      case 90: // Z
      //update starting shot position
        px=0;
        py=25;
        pz=100;
        player.thirdPerson();  // for default first person camera affect
      break

 
  }
})


document.addEventListener("mousedown", function(e) {  //when mouse is clicked, shoot
    ammo--;
    if(ammo>=0){
      //establish sound for shot
      var audio = new Audio('./song/hit.mp3');       
      audio.volume = 0.2
      audio.play();

      //establish ship position
      var shipPosition = cam.position.clone()        
      shipPosition.sub(new THREE.Vector3(0, 25, 100))

      //create and shoot the shot
      var shot = new Shot(shipPosition)    
      shots.push(shot)
      World.add(shot.getMesh())
    }

});

//when key is pressed
window.addEventListener('keydown', function(e) {
  switch (e.keyCode) {

    case 37: /*left*/
    case 65: /*A*/ moveLeft = true; break;

    case 39: /*right*/
    case 68: /*D*/ moveRight = true; break;

    case 83: /*up*/
    case 40: moveUp = true; break;

    case 87: /*down*/
    case 38: moveDown = true; break;

    
    case 81: /*Q*/
    //forward movement
    if(player.getZPos()>-124){

      shipZPos-=3;
      player.setZPos(shipZPos);

      //update starting shot position
      px = -player.getXPos();
      py = -player.getYPos();
      pz = -player.getZPos();
    } 
    break;

    case 69: /*E*/
    //backward movement
    console.log(player.getXPos());
    console.log(player.getYPos());
    console.log(player.getZPos());

    if(player.getZPos()<-70){        
 
      shipZPos+=3;
      player.setZPos(shipZPos);
      
      //update starting shot positions
      px = -player.getXPos();
      py = -player.getYPos();
      pz = -player.getZPos() 
    }
    break; 


  }
});


function update() {

   
    if ((moveLeft || moveRight)  ) {    // if there is horizontal movement

      const x_contrib =  (Number(moveLeft) - Number(moveRight)) ;
      var nextRightPos = Math.max(minY, Math.min(maxY, (object.position.x - x_contrib)+1));
      var nextLeftPos = Math.max(minY, Math.min(maxY, (object.position.x - x_contrib)-1));
        
      if((nextLeftPos>-54 && nextRightPos<54)){      //if camera is at left and right bounds
      object.position.x = Math.max(minY, Math.min(maxY, object.position.x - x_contrib));  //update horizontal object position
      }
    
    }
 
      if (moveUp || moveDown ) {    // if there is vertical movement

        const y_contrib =  (Number(moveUp) - Number(moveDown)) ;
        var nextUpPos = Math.max(minY, Math.min(maxY, (object.position.y - y_contrib)+1));
        var nextDownPos = Math.max(minY, Math.min((maxY, object.position.y - y_contrib)-1));

        if((nextDownPos>=-20 && nextUpPos<=60)){   //if camera is at top and and bottom bounds
        object.position.y = Math.max(minY, Math.min(maxY, object.position.y - y_contrib));  //update vertical object position
        }

      }
}

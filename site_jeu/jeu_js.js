var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
canvas.width = 900;
canvas.height = 600;



//Global variables
const cellSize = 100;
const cellGap = 3;
const gameGrid = [];
const defenders = [];
const enemies = [];
const enemyPositions = [];
const NO_OF_HIGH_SCORES = 10;
//const winningScore = 50;
let numberOfRessources = 300;
let enemiesInterval =  600;
let frame = 0;
let gameOver = false;
let score = 0;
const projectiles = [];
const ressources = [];
let chosenDefender = 1 ;

//mouse
const mouse = {
    x: 10,
    y: 10,
    width: 0.1,
    height: 0.1,
    clicked : false 
}
canvas.addEventListener('mousedown', function(){
    mouse.clicked = true ;
});
canvas.addEventListener('mouseup', function(){
    mouse.clicked = false ;
});
let canvasPosition = canvas.getBoundingClientRect();
console.log(canvasPosition);
canvas.addEventListener('mousemove', function(e){
    mouse.x = e.x - canvasPosition.left;
    mouse.y = e.y - canvasPosition.top;
});
canvas.addEventListener('mouseleave', function(){
    mouse.x = undefined;
    mouse.y = undefined;
});

//Game board
const field = new Image();
field.src = "./ressources/sand.jpg";

showHighScores();

const controlsBar = {
    width: canvas.width,
    height: cellSize,
}
class Cell {
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.width = cellSize;
        this.height = cellSize;
        this.spriteWidth = 1340 ;
        this.spriteHeight = 1000 ;
    }
    draw() {
        if(mouse.x && mouse.y && collision(this, mouse)){
            ctx.strokeStyle = 'black';
            ctx.strokeRect(this.x, this.y, this.width, this.height);
        }
        ctx.drawImage(field,0,0);
    }
}
function createGrid(){
    for(let y =cellSize; y < canvas.height; y += cellSize){
        for(let x = 0; x < canvas.width; x += cellSize){
            gameGrid.push(new Cell(x, y));
        }
    }
}
createGrid();
function handleGameGrid(){
    for (let i = 0; i < gameGrid.length; i++) {
        gameGrid[i].draw();
    }
}
//projectiles
const imgProjectile = new Image();
imgProjectile.src = './ressources/gemme.png'

class Projectile{
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.width =20;
        this.height = 20;
        this.power = 20;
        this.speed = 10;
	this.spriteWidth = 20 ;
        this.spriteHeight = 20 ;
    }
    update(){
        this.x += this.speed;
    }
    draw(){
        ctx.drawImage(imgProjectile,0,0,this.spriteWidth,this.spriteHeight,this.x,this.y,this.width,this.height);
    }
}
function handleProjectiles(){
    for (let i = 0; i < projectiles.length; i++) {
        projectiles[i].update();
        projectiles[i].draw();

        for(let j = 0; j < enemies.length; j++){
            if (enemies[j] && projectiles[i] && collision(projectiles[i], enemies[j])) {
                enemies[j].health -= projectiles[i].power;
                projectiles.splice(i, 1);
                i--;
            }
        }

        if (projectiles[i] && projectiles[i].x > canvas.width - cellSize) {
            projectiles.splice(i, 1);
            i--;
        }
    }
}

//defenders
const defender1 = new Image();
defender1.src = './ressources/anubis.png';
const defender2 = new Image();
defender2.src = './ressources/nefertiti.png';



class Defender {
    constructor(x,y) {
        this.x = x;
        this.y = y;
        this.width = cellSize - cellGap * 2;
        this.height = cellSize - cellGap * 2;
        this.shooting = false;
        this.health = 100;
        this.projectiles = [];
        this.timer = 0;
        this.spriteWidth = 512 ;
        this.spriteHeight = 512 ;
        this.chosenDefender = chosenDefender ;
    }
    draw(){
        //ctx.fillStyle = 'blue';
        //ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = 'black';
        ctx.font = '20px Arial';
        ctx.fillText(Math.floor(this.health), this.x, this.y + 5);
        if(this.chosenDefender === 1){
            ctx.drawImage(defender1, 0,0,this.spriteWidth,this.spriteHeight,this.x,this.y,this.width,this.height);
        }else if(this.chosenDefender === 2){
            ctx.drawImage(defender2, 0,0,this.spriteWidth,this.spriteHeight,this.x,this.y,this.width,this.height);
        }
        
    }
    update(){
        if (this.shooting) { 
            this.timer++;
            if (this.timer % 100 === 0) {
                projectiles.push(new Projectile(this.x + 70, this.y + 50));
            }   
        } else {
            this.timer = 0;
        }
    }
}
canvas.addEventListener('click', function(){
    const gridPositionX = mouse.x - (mouse.x % cellSize) + cellGap;
    const gridPositionY = mouse.y - (mouse.y % cellSize) + cellGap;
    if(gridPositionY < cellSize) return;
    for(let i = 0; i < defenders.length; i++){
        if(defenders[i].x === gridPositionX && defenders[i].y === gridPositionY)
        return;
    }
    let defenderCost = 100;
    if(numberOfRessources >= defenderCost){
        defenders.push(new Defender(gridPositionX, gridPositionY));
        numberOfRessources -= defenderCost;
    }
});
function handleDefenders(){
    for(let i = 0; i < defenders.length; i++){
        defenders[i].draw();
        defenders[i].update();
        if (enemyPositions.indexOf(defenders[i].y) !== -1) {
            defenders[i].shooting = true;
        } else {
            defenders[i].shooting = false;
        }
        for (let j = 0; j < enemies.length; j++) {
            if (defenders[i] && collision(defenders[i], enemies[j])) {
                enemies[j].movement = 0;
                defenders[i].health -= 0.2;
            }
            if (defenders[i] && defenders[i].health <=0) {
                defenders.splice(i, 1);
                i--;
                enemies[j].movement = enemies[j].speed;
            }
        }
    }
}

const card1 = {
    x : 10 ,
    y : 10 ,
    width : 70,
    height : 85 
}
const card2 = {
    x : 90 ,
    y : 10 ,
    width : 70,
    height : 85 
}

function chooseDefender(){
    let card1stroke = 'black';
    let card2stroke = 'black';
    if(collision(mouse,card1) && mouse.clicked){
        chosenDefender = 1 ;
    }else if(collision(mouse,card2) && mouse.clicked){
        chosenDefender = 2 ;
    }
    
    if(chosenDefender === 1){
        card1stroke = 'gold';
        card2stroke = 'black';
    }else if(chosenDefender === 2){
         card1stroke = 'black';
        card2stroke = 'gold';
    }else{
         card1stroke = 'black';
        card2stroke = 'black';
    }
    
    ctx.lineWidth = 1 ;
    //ctx.fillStyle = 'rgba(0,0,0,0.5)'; 
    ctx.fillRect(card1.x, card1.y, card1.width, card1.height);
    ctx.strokeStyle = card1stroke ;
    ctx.strokeRect(card1.x, card1.y, card1.width, card1.height);
    ctx.drawImage(defender1,0,0,512,512,5,10,165/2,170/2);
    ctx.fillRect(card2.x, card2.y, card2.width, card2.height);
    ctx.drawImage(defender2,0,0,512,512,80,10,165/2,170/2);
    ctx.strokeStyle = card2stroke ;
    ctx.strokeRect(card2.x, card2.y, card2.width, card2.height);
}


//enemies
const enemyTypes = [];
const enemy1 = new Image();
enemy1.src = "./ressources/snake.png" ;
enemyTypes.push(enemy1);
const enemy2 = new Image();
enemy2.src = "./ressources/scarab.png";
enemyTypes.push(enemy2);



class Enemy{
    constructor(verticalPosition){
        this.x = canvas.width;
        this.y = verticalPosition;
        this.width = cellSize - cellGap * 2;
        this.height = cellSize - cellGap * 2;
        this.speed = Math.random() * 0.2 + 0.5;
        this.movement = this.speed;
        this.health = 100;
        this.maxHealth = this.health;
        this.enemyType = enemyTypes[Math.floor(Math.random() * enemyTypes.length)] ;
        this.spriteWidth = 512 ;
        this.spriteHeight = 512 ;
    }
    update() {
        this.x -= this.movement;
    }
    draw(){
        //ctx.fillStyle= 'red';
        //ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = 'black';
        ctx.font = '20px Arial';
        ctx.fillText(Math.floor(this.health), this.x + 15, this.y + 20);
        //ctx.drawImage(img, sx,sy,sw,sh,dx,dy,dw,dh);
        ctx.drawImage(this.enemyType, 0,0,this.spriteWidth,this.spriteHeight,this.x,this.y,this.width,this.height);

    }
}

function handleEnemies(){
    for (let i = 0; i < enemies.length; i++) {
        enemies[i].update();
        enemies[i].draw();
        if (enemies[i].x < 0) {
            gameOver = true;
        }
        if (enemies[i].health <= 0 ) {
            let gainedRessources = enemies[i].maxHealth/10;
            numberOfRessources += gainedRessources;
            score += gainedRessources;
            const findThisIndex = enemyPositions.indexOf(enemies[i].y);
            enemyPositions.splice(findThisIndex,1);
            enemies.splice(i, 1);
            i--;
        }
    }
    if(frame % enemiesInterval === 0 /*&& score < winningScore*/){
        let verticalPosition = Math.floor(Math.random() * 5 + 1) * cellSize + cellGap;
        enemies.push(new Enemy(verticalPosition));
        enemyPositions.push(verticalPosition);
        if(enemiesInterval > 120) enemiesInterval -= 100;
    }
}
//ressources
const resourceTypes = [];
const resource1 = new Image();
resource1.src = "./ressources/lotus.png" ;
resourceTypes.push(resource1);
const resource2 = new Image();
resource2.src = "./ressources/pipe.png";
resourceTypes.push(resource2);


const amounts = [20, 30, 40];
class Ressource{
    constructor(){
        this.x = Math.random() * (canvas.width -cellSize);
        this.y = (Math.floor(Math.random() *5) + 1) * cellSize + 25;
        this.width = cellSize * 0.6;
        this.height = cellSize * 0.6;
        this.amount = amounts[Math.floor(Math.random() * amounts.length)];
        this.resourceType = resourceTypes[Math.floor(Math.random() * resourceTypes.length)] ;
        this.spriteWidth = 512 ;
        this.spriteHeight = 512 ;
    }
    draw(){
    //ctx.fillStyle = 'yellow';
    //ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText(this.amount, this.x, this.y + 5);
    ctx.drawImage(this.resourceType, 0,0,this.spriteWidth,this.spriteHeight,this.x,this.y,this.width,this.height);
    }
}
function handleRessources(){
    if (frame % 500 === 0 /*&& score < winningScore*/) {
        ressources.push(new Ressource());
    }
    for(let i=0; i < ressources.length; i++){
        ressources[i].draw();
        if (ressources[i] && mouse.x && mouse.y && collision(ressources[i], mouse)) {
            numberOfRessources += ressources[i].amount;
            ressources.splice(i, 1);
            i--;
        }
    }
}

//utilities
function handleGameStatus(){
    ctx.fillStyle = 'black';
    ctx.font = '30px Papyrus';
    ctx.fillText('Score: ' + score, 180, 40);
    ctx.fillText('Resources: ' + numberOfRessources, 180, 80);
    if (gameOver) {
        ctx.fillStyle = 'black';
        ctx.font = '80px Papyrus';
        ctx.fillText('Game Over', 150, 330);
        checkHighScore(score);
    }
    // if (score > winningScore && enemies.length === 0) {
    //     ctx.fillStyle = 'black';
    //     ctx.font = '60px Papyrus';
    //     ctx.fillText('Level complete', 130, 300);
    //     ctx.font = '30px Arial';
    //     ctx.fillText('You win with ' + score  + ' points !', 134, 340);
    // }
}
function animate(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'blue';
    ctx.fillRect(0, 0, controlsBar.width, controlsBar.height);
    handleGameGrid();
    handleDefenders();
    handleRessources();
    handleProjectiles();
    handleEnemies();
    chooseDefender();
    handleGameStatus();
    frame++;
    if (!gameOver) requestAnimationFrame(animate);
}
animate();


function collision(first, second){
    if (    !( first.x > second.x + second.width ||
            first.x + first.width < second.x ||
            first.y > second.y + second.height ||
            first.y + first.height < second.y)
    ) {
        return true;
    };
};

window.addEventListener('resize', function(){
    canvasPosition = canvas.getBoundingClientRect();
})

//musique
let music = new Audio("./ressources/Chiraz-Wisper.mp3");
music.loop = true ;
music.volume = 0.3 ;
music.play();


//score
function showHighScores(){
    const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
    const highScoreList = document.getElementById('highScores');

    highScoreList.innerHTML = highScores
    .map((score) => `<li>${score.name} - ${score.score}`)
    .join('');
}

function checkHighScore(score) {
    const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
    const lowestScore = highScores[NO_OF_HIGH_SCORES - 1]?.scoreFinal ?? 0;
    
    if (score > lowestScore) {
     const name = localStorage.getItem("username");
     const newScore = {score, name};
      saveHighScore(newScore, highScores); 
      showHighScores(); 
    }
  }

  function saveHighScore(score, highScores) {
      highScores.push(score);
      highScores.sort((a, b) => b.score -a.score);
      highScores.splice(NO_OF_HIGH_SCORES);

      localStorage.setItem('highScores', JSON.stringify(highScores));
  }

  document.getElementById("restart").onclick = function () {
      location.href = "site_jeu.html";
  };

  document.getElementById("change").onclick = function () {
    location.href = "menu.html";
};


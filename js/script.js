'use strict'
const area = document.querySelector('.area');

const gameSettings = {
    step: 20,
    speed: 200,
    segment: '19px'
}

let scoreCount = 0;
let levelCount = 1;
let scoreCountLevelUp = 0;

let applePosition = {
    x: 10,
    y: 0    
};

let interval; 

const snake = {
    body: [
        {x : 2, y : 0},
        {x : 1, y : 0},
        {x : 0, y : 0}
    ],

    direction : 'right',
    head : {},
     

//position calculate
    calcPositionX(i) {
        return `${this.body[i]['x'] * gameSettings.step}px`
    },
    calcPositionY(i) {
        return `${this.body[i]['y'] * gameSettings.step}px`
    },

//render
    snakeRender (){
        this.body.forEach((item, i) => {
            let box = document.createElement('div');
            box.classList.add('box');
            box.style.height = gameSettings.segment;
            box.style.width = gameSettings.segment;
            // box.textContent = [i];
            box.style.left = this.calcPositionX(i);
            box.style.top = this.calcPositionY(i);
            area.append(box);
            });
    },
   
//direction
    changeDirection(keyCode){
        if (keyCode === 37 && this.direction !== "right") {
        this.direction = "left";
        } else if (keyCode === 38 && this.direction !== "down") {
        this.direction = "up";
        } else if (keyCode === 39 && this.direction !== "left") {
        this.direction = "right";
         } else if (keyCode === 40 && this.direction !== "up") {
        this.direction = "down";
        } 
    },   
//movement
    movement(keyCode) {
        this.head = {
            x : snake.body[0]['x'],
            y : snake.body[0]['y']
        }

        if (this.direction === "right") {
            this.head.x++;
          } else if (this.direction === "left") {
            this.head.x--;
          } else if (this.direction === "up") {
            this.head.y--;
          } else if (this.direction === "down") {
            this.head.y++;
          }
        if (this.collisionBorder()) {
            clearInterval(interval);
            clearArea();
        } else if (this.collisionSnake()) {
            clearInterval(interval);
            clearArea();
        } else if (this.collisionsApple()) {
            this.body.unshift(this.head);
            document.querySelector('.apple').remove();
            randomGenApple(0, 25);
            scoreCount++;
            scoreCountLevelUp++;
            score.textContent = `Ваш счет: ${scoreCount}`;
            this.snakeRender();
        } else {
            this.body.unshift(this.head);
            this.body.pop();
            this.snakeRender();
            
        }
    },
//Collisions bodred, snake, apple
    collisionBorder(){
        if (this.head.x > 24 || 
            this.head.x < 0  ||
            this.head.y > 24 || 
            this.head.y < 0){
            modalToggle();
            return true;
        }
    },

    collisionSnake (){
        for (let i = 0; i< this.body.length; i++){
            if (this.head.x == this.body[i]['x'] && 
                this.head.y == this.body[i]['y']){
                    modalToggle();
                    return true;
                }
        }            
    },

    collisionsApple(){
        if (this.head.x == applePosition.x && 
            this.head.y == applePosition.y){
                return true;
            }
    }
    
}

let score = document.createElement('div');
    score.classList.add('score');
    score.textContent = `Ваш счет: ${scoreCount}`;
    area.before(score);

let level = document.createElement('div');
    level.classList.add('score');
    level.textContent = `Ваш уровень: ${levelCount}`;
    area.before(level);

//generate random position apple
function randomGenApple(min, max){
    min = Math.ceil(min);
    max = Math.floor(max);
    applePosition.x = Math.floor(Math.random() * (max - min) + min);
    applePosition.y = Math.floor(Math.random() * (max - min) + min);
    for (let i = 0; i< snake.body.length; i++){
        if (applePosition.x == snake.body[i]['x'] && 
            applePosition.x == snake.body[i]['y']){
                randomGenApple(0, 25);
            }
    }  
}

// render apple
function renderApple(){
    if (!document.querySelector('.apple'))    {
        let apple = document.createElement('div');
        apple.classList.add('apple');
        apple.style.height = gameSettings.segment;
        apple.style.width = gameSettings.segment;
        apple.style.left = `${applePosition.x*gameSettings.step}px`;
        apple.style.top = `${applePosition.y*gameSettings.step}px`;
        area.append(apple);
    }
}

//clear area
function clearArea(){
    let oldSnake = document.querySelectorAll('.box');
    console.log(oldSnake);
    oldSnake.forEach(element => {
    element.remove();        
    });
}

//level up
function levelUp(){
    if (scoreCountLevelUp === 3 ) {
        levelCount++;
        gameSettings.speed = gameSettings.speed - (gameSettings.speed/100*10);
        scoreCountLevelUp = 0;
        level.textContent = `Ваш уровень: ${levelCount}`;
        clearInterval(interval);
        startGame(gameSettings.speed)
        
    }
}

//start game
function startGame(speed){
    interval = setInterval(gameLoop, speed);
}

//reset game - reload page
function resetGame (){
    location.reload();
    
}

//show modal reset game
function modalToggle(){
    let modal = document.querySelector('.modal');
    modal.classList.toggle('show');
}

//event keyboard
document.addEventListener('keydown',(event) => {
    if (event.code == 'Space') {
                clearInterval(interval);
    } else {snake.changeDirection(event.keyCode);

    }   
});

//event button
let button = document.querySelector('button');
button.addEventListener('click', () => {
    resetGame();
});



//gamer loop   
function gameLoop (){
    clearArea();
    renderApple();
    snake.movement();
    levelUp();
    
}

//start game
startGame(gameSettings.speed);






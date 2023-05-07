let x, y, diameter
let friction = .75   
let moveSpeed = 3
let velocityX = 0
let velocityY = 0
let rectH, rectW, rect1X, rect2X, rect3X, rect1Y, rect2Y, rect3Y
let rectSpeed = 8
let score = 0
let gameStatus = true
let bullets = []
let face
let presscounter = 0
let once = true

let clientSocket

function preload(){
    face = loadImage('assets/face.png')
    bg = loadImage('assets/background2.jpg')
    pickle = loadImage('assets/pickle.png')
    missile = loadImage('assets/missile.png')
    // bg = 'blue'
}

function setup(){
    createCanvas(windowWidth, windowHeight)
    
    // background(bg)

    diameter = 90
    x = windowWidth/2
    y = windowHeight*0.8
    rectH = 50
    rectW = 50
    rect1X = Math.random()*(windowWidth - rectW)
    rect2X = Math.random()*(windowWidth - rectW)
    rect3X = Math.random()*(windowWidth - rectW)
    rect1Y = 0
    rect2Y = -100
    rect3Y = -200


    clientSocket = io.connect()

    clientSocket.on('movement', data => {      
        console.log(data)      
        //Movement controls
        if(data == "LEFT"){
            velocityX = velocityX - moveSpeed
        }
        if(data == "RIGHT"){
            velocityX = velocityX + moveSpeed
        }
        if(data == "UP"){
            velocityY = velocityY - moveSpeed
        }
        if(data == "DOWN"){
            velocityY = velocityY + moveSpeed
        }
        if(data == "SHOOT"){
            let b = new Bullet(x, y);
            bullets.push(b);
        }
        if(data == "PRESS"){
            presscounter++
        }

        if(presscounter == 3){
            diameter = 20
            presscounter = 0
            setTimeout(() => {
                diameter = 90
            }, 5000);
        }
    })
}

function draw(){
    clear();
    if(gameStatus){
        imageMode(CORNER)
        background(bg)
        imageMode(CENTER)
        update()
        show()
        showRect()
        updateRect()
        collission()
        select('#info').html(Math.round(score))

    }else{
        background('black')
        select('#info').html('')
        if(keyIsDown(82)){
            location.reload()
        }
    }


}

function showRect(){
    // rect(rect1X, rect1Y, rectW, rectH)
    // rect(rect2X, rect2Y, rectW, rectH)
    // rect(rect3X, rect3Y, rectW, rectH)
    imageMode(CENTER)
    image(pickle, rect1X, rect1Y, rectW, rectH)
    image(pickle, rect2X, rect2Y, rectW, rectH)
    image(pickle, rect3X, rect3Y, rectW, rectH)
}

function updateRect(){
    rect1Y += rectSpeed 
    rect2Y += rectSpeed 
    rect3Y += rectSpeed 
    if(rect1Y >= windowHeight){
        rect1Y = 0
        rect1X = Math.random() * (windowWidth - rectW)
    }
    if(rect2Y >= windowHeight){
        rect2Y = 0
        rect2X = Math.random() * (windowWidth - rectW)
    }
    if(rect3Y >= windowHeight){
        rect3Y = 0
        rect3X = Math.random() * (windowWidth - rectW)
    }
}

function show(){
    ellipseMode(CENTER)
    imageMode(CENTER)
    image(face, x, y, diameter, diameter*1.325)
    // ellipse(x, y, diameter)
}

function update(){
    velocityX *= friction
    velocityY *= friction
    x += velocityX 
    y += velocityY 

    score += 1/60
    

    //player collision with walls
    if(x > windowWidth - diameter/2){
        x = windowWidth - diameter/2
    }
    if(x < diameter/2){
        x = diameter/2
    }

    //player collision with top and bot
    if(y > windowHeight - diameter/2){
        y = windowHeight - diameter/2
    }
    if(y < diameter/2){
        y = diameter/2
    }

    //movement controls
    if(keyIsDown(65) || keyIsDown(LEFT_ARROW)){
        velocityX = velocityX - moveSpeed
    }
    if(keyIsDown(68) || keyIsDown(RIGHT_ARROW)){
        velocityX = velocityX + moveSpeed
    }
    if(keyIsDown(87) || keyIsDown(UP_ARROW)){
        velocityY = velocityY - moveSpeed
    }
    if(keyIsDown(83) || keyIsDown(DOWN_ARROW)){
        velocityY = velocityY + moveSpeed
    }


    for (var j = bullets.length - 1; j >= 0; j--) {
        bullets[j].display();
        bullets[j].move();
    
        if(bullets[j].y < y - windowHeight/2){
          bullets.splice(j,1);
          break;
        }

        if((bullets[j].x + bullets[j].r > rect1X && bullets[j].x - bullets[j].r < rect1X + rectW)&&(bullets[j].y + bullets[j].r > rect1Y && bullets[j].y - bullets[j].r < rect1Y+rectH)){
            rect1Y = -rectH
            rect1X = Math.random() * (windowWidth - rectW)
            rectSpeed = rectSpeed + 0.33
        }
        if((bullets[j].x + bullets[j].r > rect2X && bullets[j].x - bullets[j].r < rect2X + rectW)&&(bullets[j].y + bullets[j].r > rect2Y && bullets[j].y - bullets[j].r < rect2Y+rectH)){
            rect2Y = -rectH
            rect2X = Math.random() * (windowWidth - rectW)
            rectSpeed = rectSpeed + 0.33
        }
        if((bullets[j].x + bullets[j].r > rect3X && bullets[j].x - bullets[j].r < rect3X + rectW)&&(bullets[j].y + bullets[j].r > rect3Y && bullets[j].y - bullets[j].r < rect3Y+rectH)){
            rect3Y = -rectH
            rect3X = Math.random() * (windowWidth - rectW)
            rectSpeed = rectSpeed + 0.33
        }
}}

function collission(){
    if((x + diameter/2 > rect1X && x - diameter/2 < rect1X + rectW)&&(y + diameter/2 > rect1Y && y - diameter/2 < rect1Y+rectH)){
            
         gameStatus = false
         select('#score').html('Score: ' + Math.round(score))   
         select('#deathMessage').html('You lost')   
         select('#refresh').html('Press R to try again!')   
        
    }
    if((x + diameter/2 > rect2X && x - diameter/2 < rect2X + rectW)&&(y + diameter/2 > rect2Y && y - diameter/2 < rect2Y+rectH)){
            
         gameStatus = false
         select('#score').html('Score: ' + Math.round(score))   
         select('#deathMessage').html('You lost')   
         select('#refresh').html('Press R to try again!')   
        
    }
    if((x + diameter/2 > rect3X && x - diameter/2 < rect3X + rectW)&&(y + diameter/2 > rect3Y && y - diameter/2 < rect3Y+rectH)){
            
         gameStatus = false
         select('#score').html('Score: ' + Math.round(score))   
         select('#deathMessage').html('You lost')   
         select('#refresh').html('Press R to try again!')   
        
    }
}



function keyPressed(){
    if(keyCode == 32){
        let b = new Bullet(x, y, missile);
        bullets.push(b);

    }
}
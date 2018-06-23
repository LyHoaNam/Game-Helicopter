 var myGamePiece;
        var myObstacle = [];
        var myBackground;
        var myScore;
        var mySound;
        var myMusic;
        var reStart;

        function startGame()
        {
           
            myScore = new component("30px","Consolas","green",280,40,"text");
            myBackground = new component(625,270, "img/landspace.jpg",0,0,"background");
            myGamePiece = new component(60, 30, "img/helicopter1.png", 10, 120, "image");
           mySound = new sound("sound/broken.wav");
           myMusic = new sound("sound/bg.wav");
           myMusic.play();
           myGameArea.start();
            reStart= new reStartGame();
        }
        var myGameArea = {
            canvas : document.createElement("canvas"),
            start : function() {
                this.canvas.width = 480;
                this.canvas.height = 270;
                this.context = this.canvas.getContext("2d");
                document.body.insertBefore(this.canvas, document.body.childNodes[0]);
                this.frameNo = 0;
                this.interval = setInterval(updateGameArea, 20);
            },
            clear : function() {
                this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            },
            stop : function() {
                clearInterval(this.interval);
            }    
        }

        function component(width, height, color, x, y,type){
            this.type= type;
            if (type == "image" || type=="background") {
                this.image = new Image();
                this.image.src = color;
            }
            this.width=width;
            this.height=height;
            this.speedX = 0;
            this.speedY = 0;
            this.x=x;
            this.y=y;
            this.grativy = 0.05;
            this.grativySpeed = 0;
            this.update = function() {
                ctx = myGameArea.context;
                if (type == "image" || type =="background") {
                  ctx.drawImage(this.image, 
                    this.x, 
                    this.y,
                    this.width, this.height);
                  if(type == "background") {
                    ctx.drawImage(this.image, this.x +this.width,
                        this.y,this.width, this.height);
                  }
                } 
                  else if(this.type == "text") {
                    ctx.font = this.width + " " + this.height;
                    ctx.fillStyle = color;
                    ctx.fillText(this.text, this.x, this.y);
                   }
           
                else  if(this.type == null) {
                    ctx.fillStyle = color;
                    ctx.fillRect(this.x, this.y, this.width, this.height);
                }
            }
        this.newPos = function() {
            
            this.x +=this.speedX;
            this.y +=this.speedY;
            if(this.type == "image")
            {
                this.grativySpeed +=this.grativy;
                
            }
           if(this.type == "background") {
            if(this.x == -(this.width)) {
                this.x=0;
            }
           }
           this.hitFrame();
        } 
        this.hitFrame = function() {
            var rockbottom = myGameArea.canvas.height - this.height;
            if(this.y > rockbottom) {
                this.y = rockbottom;
            }
            /*var rocktop = myGameArea.canvas.height + this.height;
            if(this.y < rocktop)
            {
                this.y = rocktop;
            }*/
            }
        
        this.crashWith = function(otherobj) {
            var myleft = this.x;
            var myright= this.x + (this.width);
            var mytop =this.y;
            var mybottom = this.y + (this.height);
            var otherleft = otherobj.x;
            var othertop = otherobj.y;
            var otherright = otherobj.x + otherobj.width;
            var otherbottom = otherobj.y + otherobj.height;
            var crash =true;
            if ((mybottom < othertop) ||
                (mytop  > otherbottom) ||
                (myright < otherleft) ||
                (myleft > otherright)) {
                crash = false;
        }
        return crash;
    }
}

function updateGameArea() {

    var x, y;
    
    for (i = 0; i < myObstacle.length; i += 1) {
        if (myGamePiece.crashWith(myObstacle[i])) {
            mySound.play();
            myMusic.stop();
            myScore.update();
          
            myGameArea.stop();
            reStart.Show();
            //return;
        } 
    }
    myGameArea.clear();
    myBackground.speedX = -1;
    myBackground.newPos();
    myBackground.update();
    myGameArea.frameNo += 1;
    if(myGameArea.frameNo %2==0)
        myGamePiece.image.src="img/helicopter1.png";
    else
         myGamePiece.image.src="img/helicopter2.png";
    if (myGameArea.frameNo == 1 || everyinterval(150)) {
        x = myGameArea.canvas.width;
        minHeight = 20;
        maxHeight = 200;
        height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
        minGap=50;
        maxGap=200;
        gap=Math.floor(Math.random()*(maxGap=minGap+1)+minGap);
        myObstacle.push(new component(10, height, "green", x, 0));
        myObstacle.push(new component(10, x-height-gap, "green", x, height+gap));

    }
    for (i = 0; i < myObstacle.length; i += 1) {
        myObstacle[i].x += -1;
        myObstacle[i].update();
    }
   
    myScore.text = "SCORE: " +myGameArea.frameNo;
    myScore.update();
    myMusic.loop();
    myGamePiece.newPos();    
    myGamePiece.update();

}

function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }
    this.loop = function() {
     if( typeof this.sound.loop == "boolean") {
        this.sound.loop = true;
     }
     else {
        this.sound.addEventListener('ended' , function() {
            this.currentTime = 0;
            this.play();
        },false);
     }

    }
}
function reStartGame() {
    
    this.Start = document.createElement("button");
    var textT = document.createTextNode("RESTART");
    this.Start.appendChild(textT);
    this.Start.id="reStart";
        this.Start.addEventListener("click",function(){
            startGame();
            this.style.display ="none";
        });
  
    
    this.Show = function(){
        document.body.appendChild(this.Start);
    }
}


function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
}

function moveup() {
    myGamePiece.speedY -= 1;
}
function movedown() {
    myGamePiece.speedY += 1;
}
function moveleft() {
    myGamePiece.speedX -=1;
}
function moveright() {
    myGamePiece.speedX +=1;
}

function clearmove() {
    myGamePiece.speedX = 0; 
    myGamePiece.speedY = 0; 
}
document.onkeydown = checKey;
function checKey(e) {
    e = e || window.event;
     switch (e.keyCode) {
        case 37:
            myGamePiece.speedX -=1;
            break;
        case 38:
            myGamePiece.speedY -= 1;
            break;
        case 39:
            myGamePiece.speedX +=1;
            break;
        case 40:
            myGamePiece.speedY += 1;
            break;
            }
}
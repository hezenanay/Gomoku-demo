var chessBoard = [];
var player = true;
var over=false;

for (var i = 0; i < 15; i++) {
  chessBoard[i] = [];
  for (var j = 0; j < 15; j++) {
    chessBoard[i][j] = 0;
  }
}

// win methods array
var wins = [];

// the array of counted win methods ( for palyer and computer)
var myWin = [];
var computerWin = [];

// initialize array
for (var i = 0; i < 15; i++) {
  wins[i] = [];
  for (var j = 0; j < 15; j++) {
    wins[i][j] = [];
  }
}

//Vertical
var count = 0;
for (var i = 0; i < 15; i++) {
  for (var j = 0; j < 11; j++) {
    for (var k = 0; k < 5; k++) {
      wins[i][j + k][count] = true;
    }
    count++;
  }
}

//horizontal
for (var i = 0; i < 15; i++) {
  for (var j = 0; j < 11; j++) {
    for (var k = 0; k < 5; k++) {
      wins[j + k][i][count] = true;
    }
    count++;
  }
}

//45°
for (var i = 0; i < 11; i++) {
  for (var j = 0; j < 11; j++) {
    for (var k = 0; k < 5; k++) {
      wins[i + k][j + k][count] = true;
    }
    count++;
  }
}

//135°
for (var i = 0; i < 11; i++) {
  for (var j = 14; j > 3; j--) {
    for (var k = 0; k < 5; k++) {
      wins[i + k][j - k][count] = true;
    }
    count++;
  }
}

// compute how many win methods
console.log(count);

for (var i = 0; i < count; i++) {
  myWin[i] = 0;
  computerWin[i]=0;
}


//create chessboard and chess pieces
var chess = document.getElementById('chess');
var context = chess.getContext('2d');

context.strokeStyle = "#6e595e";
var background = new Image();
background.src = "images/bg.jpg";
background.onload = function() {
  context.drawImage(background, 0, 0, 450, 450);
  drawCheese();
}

var drawCheese = function() {
  for (var i = 0; i < 15; i++) {
    context.moveTo(15 + i * 30, 15);
    context.lineTo(15 + i * 30, 435);
    context.stroke();
    context.moveTo(15, 15 + i * 30);
    context.lineTo(435, 15 + i * 30);
    context.stroke();
  }
}

var oneStep = function(i, j, player) {
  context.beginPath();
  context.arc(15 + i * 30, 15 + j * 30, 13, 0, 2 * Math.PI);
  context.closePath();
  var gradient = context.createRadialGradient(15 + i * 30 + 2, 15 + j * 30 - 2, 13, 15 + i * 30 + 2, 15 + j * 30 - 2, 0);
  if (player) {
    gradient.addColorStop(0, "#000000");
    gradient.addColorStop(1, "#c8dbdd");
  } else {
    gradient.addColorStop(0, "#D1D1D1");
    gradient.addColorStop(1, "#F9F9F9");
  }
  context.fillStyle = gradient;
  context.fill();
}

//player puts pieces
chess.onclick = function(e) {
  if(over){
    return;
  }
  if(!player){
    return;
  }
  var x = e.offsetX;
  var y = e.offsetY;
  var i = Math.floor(x / 30);
  var j = Math.floor(y / 30);
  if (chessBoard[i][j] == 0) {
    oneStep(i, j, player);
      chessBoard[i][j] = 1;
    for(var k=0;k<count;k++){
      if(wins[i][j][k]){
        myWin[k]++;
        computerWin[k]=7;
        if(myWin[k]==5){
          window.alert("you win");
          over=true;
        }
      }
    }
    if(!over){
      player = !player;
      computerAI();
    }
  }
}

//AI algorithm
var computerAI=function(){
  var myScore=[];
  var computerScore=[];
  var max=0;
  var u=0,v=0;

  for(var i=0;i<15;i++){
    myScore[i]=[];
    computerScore[i]=[];
    for(var j=0;j<15;j++){
      myScore[i][j]=0;
      computerScore[i][j]=0;
    }
  }
  for(var i=0;i<15;i++){
    for(var j=0;j<15;j++){
      if(chessBoard[i][j]==0){
        for(var k=0;k<count;k++){
          if(wins[i][j][k]){
            if(myWin[k]==1){
              myScore[i][j]+=100;
            }else if(myWin[k]==2){
              myScore[i][j]+=300;
            }else if(myWin[k]==3){
              myScore[i][j]==500;
            }else if(myWin[k]==4){
              myScore[i][j]+=1000;
            }

            if(computerWin[k]==1){
              computerScore[i][j]+=90;
            }else if(computerWin[k]==2){
              computerScore[i][j]+=290;
            }else if(computerWin[k]==3){
              computerScore[i][j]==700;
            }else if(computerWin[k]==4){
              computerScore[i][j]+=2000;
            }
          }
        }
        if(myScore[i][j]>max){
          max=myScore[i][j];
          u=i;
          v=j;
        }else if(myScore[i][j]=max){
          if(computerScore[i][j]>computerScore[u][v]){
            u=i;
            v=j;
          }
        }

        if(computerScore[i][j]>max){
          max=myScore[i][j];
          u=i;
          v=j;
        }else if(computerScore[i][j]=max){
          if(myScore[i][j]>myScore[u][v]){
            u=i;
            v=j;
          }
        }

      }
    }
  }
  //computer puts pieces
  oneStep(u,v,false);
  chessBoard[u][v]=2;
  for(var k=0;k<count;k++){
    if(wins[u][v][k]){
      computerWin[k]++;
      myWin[k]=7;
      if(computerWin[k]==5){
        window.alert("computer win");
        over=true;
      }
    }
  }
  if(!over){
    player = !player;
  }

}

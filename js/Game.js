class Game {
  constructor() {
    this.resetDatabase = createElement("h2");
    this.resetButton = createButton("Reset");
    this.leaderboard = createElement("h2");
    this.leader1 = createElement("h2");
    this.leader2 = createElement("h2");
  }

  getState() {
    var gameStateRef = database.ref("gameState");
    gameStateRef.on("value", function(data) {
      gameState = data.val();
    });
  }
  update(state) {
    database.ref("/").update({
      gameState: state
    });
  }

  start() {
    player = new Player();
    playerCount = player.getCount();

    form = new Form();
    form.display();

    car1 = createSprite(width / 2 - 50, height - 100);
    car1.addImage("car1", car1_img);
    car1.scale = 0.07;

    car2 = createSprite(width / 2 + 100, height - 100);
    car2.addImage("car2", car2_img);
    car2.scale = 0.07;

    cars = [car1, car2];
  }

  handleElements() {
    form.hide();
    form.titleImg.position(40, 50);
    form.titleImg.class("gameTitleAfterEffect");

    this.resetDatabase.html("Reset Game")
    this.resetDatabase.class("resetText")
    this.resetDatabase.position(width / 2 + 200, 40)

    this.resetButton.class("resetButton");
    this.resetButton.position(width/2 + 200, 100)

    this.leaderboard.html("Leaderboard");
    this.leaderboard.class("resetText")
    this.leaderboard.position(width / 3 - 60, 40)
    
    this.leader1.class("leadersText"); 
    this.leader1.position(width / 3 - 50, 80); 

    this.leader2.class("leadersText"); 
    this.leader2.position(width / 3 - 50, 130);
  }

  play() {
    this.handleElements();
    this.handleResetButton();

    Player.getPlayersInfo();

    if (allPlayers !== undefined) {
      image(track, 0, -height * 5, width, height * 6);

      this.showLeaderboard();

      //index of the array
      var index = 0;
      for (var plr in allPlayers) {
        //add 1 to the index for every loop
        index = index + 1;

        //use data form the database to display the cars in x and y direction
        var x = allPlayers[plr].positionX;
        var y = height - allPlayers[plr].positionY;

        cars[index - 1].position.x = x;
        cars[index - 1].position.y = y;

        if (index === player.index) {
          stroke(10);
          fill("red");
          ellipse(x, y, 60, 60);

          // Changing camera position in y direction
          camera.position.x = cars[index - 1].position.x;
          camera.position.y = cars[index - 1].position.y;
        }
      }

      this.handlePlayerControls();

      drawSprites();
    }
  }

  handlePlayerControls() {
    // handling keyboard events
    if (keyIsDown(UP_ARROW)) {
      player.positionY += 10;
      player.update();
    }
    if (keyIsDown(LEFT_ARROW) && player.position.x > width/3 - 50) {
      player.positionX -= 5;
      player.update();
    }
    if (keyIsDown(RIGHT_ARROW) && player.position.x < width/2 + 300) {
      player.positionX += 5;
      player.update();
    }
  }

  showLeaderboard() {
    var leader1, leader2;
    var players = Object.values(allPlayers);
    if(players[0].rank === 0 && players[1].rank === 1
      || players[0].rank === 1) {
        leader1 = 
        player[0].rank + "&emsp" +
        player[0].name + "&emsp" +
        player[0].score + "&emsp";
        
        leader2 = 
        player[1].rank + "&emsp" +
        player[1].name + "&emsp" +
        player[1].score + "&emsp";
      }
    else if(players[1].rank === 1) {
      leader1 = 
        player[1].rank + "&emsp" +
        player[1].name + "&emsp" +
        player[1].score + "&emsp";
        
        leader2 = 
        player[0].rank + "&emsp" +
        player[0].name + "&emsp" +
        player[0].score + "&emsp";
    }
    this.leader1.html(leader1);
    this.leader2.html(leader2);
  }

  handleResetButton(){
    this.resetButton.mousePressed(()=>{
      database.ref("/").update({
        gameState : 0,
        playerCount : 0,
        players : {}
      })
    });
  }
}

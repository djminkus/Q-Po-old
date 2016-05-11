/* TUTORIAL Sequence
  ========
 [x]  1. Welcome to QPO! (scene)
 [x]  2. Units (scene)
 [x]  3. Turns (scene)
 [x]  4. Control Panel (scene)
 [x]  5. Execution (scene)
 [x]  6. Keyboard Controls (SCREEN)
 [x]  7. Practice (game)
*/

qpo.Scene = function(headline, body, x, y, highx, highy, highSizeModx, highSizeMody, hideHigh, promptt){
  //black pane, title text, body texts (array), prompt text, orange highlight -- 1 Scene.
  this.WIDTH = 300;
  this.HEIGHT = 200;
  this.Y = 200
  this.X = 600
  this.CENTERS = [this.X + this.WIDTH/2, this.Y + this.HEIGHT/2]; //x,y centers
  // var PADDING = 10;
  var bs = 30 //body spacing (from other body strings)
  this.pane = c.rect(600,200,this.WIDTH, this.HEIGHT).attr({"fill":"black"});
  this.head = c.text(this.CENTERS[0], this.Y+30, headline).attr({qpoText:[30,"white"]});
  this.bod = new Array();
  // for (var i=0; i<3; i++){this.bod[i]=c.text(this.CENTERS[0], (y+50) + (i+1)*bs, body[i]).attr({qpoText:[18,"white"]});}
  this.bod1 = c.text(this.CENTERS[0], this.Y+80, body[0]).attr({qpoText:[18,"white"]}); //bod for body
  this.bod2 = c.text(this.CENTERS[0], this.Y+105, body[1]).attr({qpoText:[18,"white"]});
  this.bod3 = c.text(this.CENTERS[0], this.Y+130, body[2]).attr({qpoText:[18,"white"]});
  this.promptt = c.text(this.CENTERS[0], this.Y+170, promptt).attr({qpoText:[20, qpo.COLOR_DICT['red']]});
  this.high = c.rect(highx, highy, 70+highSizeModx, 70+highSizeMody); //high for highlight
  this.high.attr({"fill":"none", "stroke":qpo.COLOR_DICT["orange"], "stroke-width":4});

  this.all = c.set().push(this.pane, this.head, this.bod1, this.bod2, this.bod3, this.promptt, this.high);
  if (hideHigh) { this.high.hide(); } //hide the highlight, or don't

  return this;
}

qpo.Tut = function(){
  c.setSize(qpo.guiDimens.gpWidth + 300, qpo.guiDimens.gpHeight);
  drawGUI(7,1); //q=7, po=1;
  controlPanel.resetIcons();
  activeScreen = "tut";
  this.status = -1;
  // var blue0, red0, turnNumber;
  this.blue0;
  this.red0;
  this.turnNumber;

  this.scenes = [ //Generate all scenes (in side panel.)
    new qpo.Scene("Welcome!",["Hi! Welcome to Q-Po. Let's", "get you up to speed.",""],50,50,0,0,0,0,true,
        "Press enter to continue."),
    new qpo.Scene("Units",["This is a unit. Destroy enemy", "units to win the round.",""],150,50,65,115,0,0,false,
      "Press enter to continue."),
    new qpo.Scene("Turns",["This is the turn timer.", "One turn takes 3 seconds.",
      "Each unit gets one move per turn."],250,50,380,180,70,70,false,
      "Press enter to continue."),
    new qpo.Scene("Control Panel",["This is the control panel. It shows", "you your plans. Every command",
      "you give shows up here."],100,250,10,410,320,60,false,
      "Press enter to continue."),
    new qpo.Scene("Moving",["When the turn timer hits 0, your", "units follow your commands. Let's",
      'learn the commands!'],100,250,10,410,320,60,false,
      "Press enter to continue.")
  ];

  // this.scenes = [ //Generate all scenes (in main panel).
  //   new qpo.Scene("Welcome!",["Hi! You must be new. We'll get", "you up to speed in no time.",""],50,50,0,0,0,0,true,
  //       "Press enter to continue."),
  //   new qpo.Scene("Units",["This is a unit. Destroy enemy", "units to win the round.",""],150,50,65,115,0,0,false,
  //     "Press enter to continue."),
  //   new qpo.Scene("Turns",["This is the turn timer.", "One turn takes 3 seconds.",
  //     "Each unit gets one move per turn."],250,50,380,180,70,70,false,
  //     "Press enter to continue."),
  //   new qpo.Scene("Control Panel",["This is the control panel. It shows", "you your plans. Every command",
  //     "you give shows up here."],100,250,10,410,320,60,false,
  //     "Press enter to continue."),
  //   new qpo.Scene("Moving",["When the turn timer hits 0, your", "units follow your commands. Let's",
  //     'learn the commands!'],100,250,10,410,320,60,false,
  //     "Press enter to continue.")
  // ];

  for(i=1; i<this.scenes.length; i++){this.scenes[i].all.hide();}//hide all except the first one
  this.status=0;
  controlPanel.orange.hide();

  this.transition = function(){ // Transition between scenes, and increment this. status
    if(this.status < 4){ // Remove raphs from old scene, update this.status, show the raphs from the new one
      this.scenes[this.status].all.remove();
      this.status++;
      this.scenes[this.status].all.show();
    }
    else { // Just update this.status
      this.status++;
    }
  }

  this.tutFuncs = { //functions to be called on "enter" keypress and "escape" keypress
    "enter": function(){ // enter/return key (transition to next scene)
      switch(qpo.tut.status){
        case 0: //transition from "welcome" to "units"
          qpo.tut.blue0 = new makeUnit("blue",1,1,0);
          qpo.tut.red0 = new makeUnit("red",1,5,0);
          qpo.tut.red0.rect.toBack();
          controlPanel.changeIcon("stay");
          break;
        case 1: //transition from "units" to "turns"
          var timerAnim = Raphael.animation({
            "0%" : {segment: [450, 250, 50, -90, 269]},
            "100%" : {segment: [450, 250, 50, -90, -90]}
          }, 3000).repeat("Infinity");
          qpo.timer.pie.animate(timerAnim);
          break;
        case 2: //transition from "turns" to "control panel 1"
          qpo.timer.pie.stop();
          qpo.timer.pie.attr({segment: [450, 250, 50, -90, 269]});
          break;
        case 3: //transition from "control panel" to "moving"
          break;
        case 4: //transition from "moving" (scene) to keyboard controls (screen)
          qpo.gui.remove(); //remove the game gui
          qpo.tut.scenes[4].all.remove();
          qpo.tut.controlsScreen = qpo.tut.makeControlsScreen(this);
          break;
        case 5: //transition from keyboard controls to "try it out"
          qpo.tut.controlsScreen.all.remove();
          qpo.tut.blackness = c.rect(0,0,600,600).attr({"fill":"black"});
          qpo.tut.scenes[5] = new qpo.Scene("Try It Out",["Those are the basics. Go", "ahead and play your first game.",
            'Good luck!'], 170, 250, 10,410,320,60,true, "Press enter to continue.");
          break;
        case 6: //start a game.
          qpo.tut.scenes[5].all.remove();
          qpo.tut.blackness.remove();
          c.setSize(qpo.guiDimens.gpWidth, qpo.guiDimens.gpHeight);
          qpo.countdownScreen([7,1,false,false,true]);
          break;
        default: //nada
          console.log("You forgot a 'break', David.");
          break;
      }
      qpo.tut.transition();
    },
    "ekey": function(){ // "e" (shoot)
      //qpo.tut.blue0.shoot();
    }
  };

  this.makeControlsScreen = function(tutt){
    this.blackness = c.rect(0,0,600,600).attr({"fill":"black"});
    this.keys = c.set().push(
      c.rect(40, 40, 50, 50, 10).attr({"stroke":"white","stroke-width":2}),
      c.rect(100, 40, 50, 50, 10).attr({"stroke":"white","stroke-width":2}),
      c.rect(160, 40, 50, 50, 10).attr({"stroke":"white","stroke-width":2}),
      c.rect(50, 100, 50, 50, 10).attr({"stroke":"white","stroke-width":2}),
      c.rect(110, 100, 50, 50, 10).attr({"stroke":"white","stroke-width":2}),
      c.rect(170, 100, 50, 50, 10).attr({"stroke":"white","stroke-width":2}),
      c.text(65, 65, "Q").attr({qpoText:[20]}),
      c.text(125, 65, "W").attr({"fill":"white","font-size":20,"font-family":"'Open Sans',sans-serif"}),
      c.text(185, 65, "E").attr({"fill":"white","font-size":20,"font-family":"'Open Sans',sans-serif"}),
      c.text(75, 125, "A").attr({"fill":"white","font-size":20,"font-family":"'Open Sans',sans-serif"}),
      c.text(135, 125, "S").attr({"fill":"white","font-size":20,"font-family":"'Open Sans',sans-serif"}),
      c.text(195, 125, "D").attr({"fill":"white","font-size":20,"font-family":"'Open Sans',sans-serif"})
    );
    this.labels = c.set().push(
      c.path("M50,30 L-20,-20").attr({"stroke":"white","stroke-width":2}),
      c.path("M125,30 L125,-10").attr({"stroke":"white","stroke-width":2}),
      c.path("M190,30 L240,-10").attr({"stroke":"white","stroke-width":2}),
      c.path("M40,150 L-20,200").attr({"stroke":"white","stroke-width":2}),
      c.path("M130,160 L130,200").attr({"stroke":"white","stroke-width":2}),
      c.path("M200,160 L240,200").attr({"stroke":"white","stroke-width":2}),
      c.text(55 - 3*30, 35 - 3*30 + 20, "Bomb").attr({"fill":"white","font-size":20,"font-family":"'Open Sans',sans-serif"}),
      c.text(125, 65 - 3*30, "Move Up").attr({"fill":"white","font-size":20,"font-family":"'Open Sans',sans-serif"}),
      c.text(185 + 3*30, 65 - 3*30, "Shoot").attr({"fill":"white","font-size":20,"font-family":"'Open Sans',sans-serif"}),
      c.text(65 - 3*30, 155 + 3*30 - 20, "Move Left").attr({"fill":"white","font-size":20,"font-family":"'Open Sans',sans-serif"}),
      c.text(135, 125 + 3*30, "Move Down").attr({"fill":"white","font-size":20,"font-family":"'Open Sans',sans-serif"}),
      c.text(195 + 3*30, 125 + 3*30, "Move Right").attr({"fill":"white","font-size":20,"font-family":"'Open Sans',sans-serif"})
    );

    this.keys.transform("t170,170");
    this.labels.transform("t170,170");

    this.shot = c.rect(460,100,6,20).attr({"fill":qpo.COLOR_DICT["green"]});
    this.bomb = c.rect(140,100,14,14).attr({"fill":qpo.COLOR_DICT["purple"]});

    this.promptt = c.text(300,500, "Press enter to continue.")
      .attr({qpoText:[20, qpo.COLOR_DICT["red"]]});

    this.all = c.set().push(this.blackness, this.keys, this.labels, this.promptt, this.shot, this.bomb);
    return this;
  };
};

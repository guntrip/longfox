var fox = {l:0, dir:"R", speed:5, location:{x:0,y:0}, history:[]};
var fps = 1, startlength = 5, gap=10;

/*
 * fox.history = [{x:200,y:500}, {x:150, y:500}]
 * move the head, add the location to the start
 * of history, all blobs follow that.
 */

$(window).load(function() {

  // Create objects
  init_fox();

  // Set keyboard input
  $(document).keydown(function( event ) {
    switch(event.which) {
        case 37: // left
        fox.dir="L";
        break;

        case 38: // up
        fox.dir="U";
        break;

        case 39: // right
        fox.dir="R";
        break;

        case 40: // down
        fox.dir="D";
        break;

        default: return; // exit this handler for other keys
    }
    event.preventDefault();
  });

  // How often do we call update()
  var fps_time=(1000/fps);
  var game_update = setInterval(update, fps_time);

});

function update() {

  // Pop previous location at beginning of history
  fox.history.unshift({x:fox.location.x, y:fox.location.y});

  // Trim the history
  fox.history=fox.history.slice(0,fox.l);

  // MOVE THE FOX
  if (fox.dir==="R") {
    fox.location.x=fox.location.x+gap;
    //fox.location.y
  }
  if (fox.dir==="L") {
    fox.location.x=fox.location.x-gap;
    //fox.location.y
  }
  if (fox.dir==="U") {
    fox.location.y=fox.location.y-gap;
    //fox.location.y
  }
  if (fox.dir==="D") {
    fox.location.y=fox.location.y+gap;
    //fox.location.y
  }



  // Position items.
  $(".fox.head").offset({left:fox.location.x,top:fox.location.y});

  for (i = 0; i < fox.l; i++) {
      var newpos=fox.history[i];
      $("#fox-"+i).offset({left:newpos.x, top:newpos.y});
  }


}

function init_fox() {
  $(".gamearea").append("<div class=\"fox head\"></div>");
  $(".gamearea").append("<div class=\"fox end\"></div>");
  for (i = 0; i < startlength; i++) {
     increase_fox();
   }

  // Set locations
  fox.location={x:200, y:200};
  for (i = 0; i < startlength; i++) {
      fox.history.push({x:fox.location.x-((i+1)*gap), y:fox.location.y});
  }
}

function increase_fox() {
  // Add a blob
  $(".gamearea").append("<div class=\"fox blob\" id=\"fox-"+fox.l+"\"></div>");
  fox.l++;
}

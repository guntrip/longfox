var fox = {l:0, dir:"R", speed:5, location:{x:0,y:0}, history:[]};
var fps = 12, startlength = 25, gap=10;

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

  var collision=collision_detect();

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

  if (collision) { console.log('eeeeee'); }

}

function collision_detect() {
  // Is anything ahead of the fox head?
  // This is called at the beginning of update(), we
  // make the move anyway.
  var collision=false;

    // Define small area ahead of the fox.
    var crash={x:0,y:0,w:5,h:5}, obj={x:0,y:0,w:5,h:5}, size=40;

    if (fox.dir==="R") {
      crash.x=fox.location.x+size;
      crash.w=(size/10);
      crash.y=fox.location.y+(size/2)-(size/5);
      crash.h=(size/10);
    }

    // Are any of our objects within the crash boundaries?
    for (i = 0; i < fox.l; i++) {
      obj.x=fox.history[i].x;
      obj.w=size;
      obj.y=fox.history[i].y;
      obj.h=size;
      collision=collision_detect_compare(crash, obj);
    }

    return collision;
}

function collision_detect_compare(crash,obj) {

  // is crash within obj?
  if (  (crash.x < (obj.x+obj.w) ) &&
        ( (crash.x+crash.w) > obj.x ) &&
        (crash.y < (obj.y+obj.h) ) &&
        ( (crash.y+crash.h) > obj.y ) ) {
          return true;
        } else {
          return false;
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

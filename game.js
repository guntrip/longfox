var fox = {l:0, dir:"R", speed:5, location:{x:0,y:0}, history:[]};
var fps = 15, startlength = 20, gap=10;
var noms=[], nommed=false;

/*
 * fox.history = [{x:200,y:500}, {x:150, y:500}]
 * move the head, add the location to the start
 * of history, all blobs follow that.
 */

 function rand(min,max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

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

        case 32: // down
        fox.dir="PAUSE";
        break;

        default: return; // exit this handler for other keys
    }
    event.preventDefault();
  });

  // How often do we call update()
  var fps_time=(1000/fps);
  var game_update = setInterval(update, fps_time);

  add_nom();
  add_nom();
  add_nom();
  add_nom();
  add_nom();

});

function update() {

  var collision=collision_detect();

  // Eaten?
  nom_detect();

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

  // Update classes
  $('.fox.head').removeClass('L').removeClass('U').removeClass('R').removeClass('D');
  $('.fox.head').addClass(fox.dir);

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
  var collision=false, collision_check=false;

    // Define small area ahead of the fox.
    var crash={x:0,y:0,w:5,h:5}, obj={x:0,y:0,w:5,h:5}, size=40;

    if (fox.dir==="R") {
      crash.x=fox.location.x+size+gap;
      crash.w=(size/4);
      crash.y=fox.location.y+(size/2)-(size/5)+3;
      crash.h=(size/4);
    }

    if (fox.dir==="L") {
      crash.x=fox.location.x-gap-gap;
      crash.w=(size/4);
      crash.y=fox.location.y+(size/2)-(size/5)+3;
      crash.h=(size/4);
    }

    if (fox.dir==="U") {
      crash.x=fox.location.x+(size/2)-(size/5)+3;
      crash.w=(size/4);
      crash.y=fox.location.y-gap-gap
      crash.h=(size/4);
    }

    if (fox.dir==="D") {
      crash.x=fox.location.x+(size/2)-(size/5)+3;
      crash.w=(size/4);
      crash.y=fox.location.y+size+gap;;
      crash.h=(size/4);
    }

    $('.fox.nose').offset({left:crash.x,top:crash.y});
    $('.fox.nose').width(crash.w);
    $('.fox.nose').height(crash.h);

    // Are any of our fox-objects within the nose boundaries?
    for (i = 0; i < (fox.l); i++) {
      var checkpos = fox.history[i];
      obj.x=checkpos.x;
      obj.w=size;
      obj.y=checkpos.y;
      obj.h=size;
      collision_check=collision_detect_compare(crash, obj);
      if (collision_check) { collision=true; }
    }

    return collision;
}

function nom_detect() {
  // Compare position of head to any noms.
  var head_pos={};
  head_pos.x=fox.location.x;
  head_pos.y=fox.location.y;
  head_pos.w=40;
  head_pos.h=40;

  // Check for any noms!
  for (i = 0; i < (noms.length); i++) {
    nom=noms[i];
    if (!nom.eaten) {

      // Collision?
      var collision=collision_detect_compare(nom, head_pos);

      if (collision) {

        // Set the nom as eaten.
        noms[i].eaten=true;

        // Remove it from dom
        $('#nom-'+i).remove();

        // Add a new nom
        add_nom();

        // Increase the fox!
        increase_fox(false);

      }

    }
  }
}

function collision_detect_compare(crash,obj) {

  if (  (crash.x < (obj.x+obj.w) ) &&
        ( (crash.x+crash.w) > obj.x ) &&
        (crash.y < (obj.y+obj.h) ) &&
        ( (crash.y+crash.h) > obj.y ) ) {
          return true;
        } else {
          return false;
        }

}

function show_collision_box(obj) {
  $('.fox.check').offset({left:obj.x,top:obj.y});
  $('.fox.check').width(obj.w);
  $('.fox.check').height(obj.h);
  console.log(obj.x);
}

function init_fox() {
  $(".gamearea").append("<div class=\"fox head\"></div>");
  $(".gamearea").append("<div class=\"fox end\"></div>");
  for (i = 0; i < startlength; i++) {
     increase_fox(false);
   }

  // Set locations
  fox.location={x:300, y:200};
  for (i = 0; i < startlength; i++) {
      fox.history.push({x:fox.location.x-((i+1)*gap), y:fox.location.y});
  }

  $(".gamearea").append("<div class=\"fox nose\"></div>");
}

function increase_fox(init) {
  // Add a blob
  $(".gamearea").append("<div class=\"fox blob\" id=\"fox-"+fox.l+"\"></div>");
  fox.l++;
  nommed=true;
  if (!init) {
    // Position the new blob, two blobs will overlap until they
    // cycle to the end of the fox.
    fox.history.unshift({x:fox.location.x, y:fox.location.y});
  }
}

function add_nom() {

  // Pick a x/y, check for foxes.
  var foxy=true, c=0;
  while (foxy) {

    // grab gameplay area
    var max_x=$('.gamearea').width()-30, max_y=$('.gamearea').height()-30;
    var new_nom={x:rand(10,max_x), y:rand(10,max_y), w:10, h:10, eaten:false};

    // Collision detect
    var collision=false;
    for (i = 0; i < (fox.l); i++) {
      var checkpos = fox.history[i], obj={};
      obj.x=checkpos.x;
      obj.w=40;
      obj.y=checkpos.y;
      obj.h=40;
      var collision_check=collision_detect_compare(new_nom, obj);
      if (collision_check) { collision=true; }
    }

    if (!collision) { foxy=false; } else { console.log('eee :O');}
    if (c>100) { foxy=false; }

    c++;

  }

  var nomid=noms.length;
  noms.push(new_nom);
  $(".gamearea").append("<div class=\"nom\" id=\"nom-"+nomid+"\"></div>");

  $('#nom-'+nomid).offset({left:new_nom.x,top:new_nom.y});
  $('#nom-'+nomid).width(new_nom.w);
  $('#nom-'+nomid).height(new_nom.h);

}

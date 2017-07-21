function Tools(type)
{
  this.type = type;
  this.selected = false;
}

Tools.prototype.options = {
  strokeStyle : 'black',
  fillStyle: 'black',
  lineJoin: 'round',
  lineWidth: 1
  
};
Tools.prototype.plotCoordinate = function(x,y)
{
  var position = 'left:'+(x - 2)+'px; top:'+(y-2)+'px;';
  var attr = 'data-x="'+(x - 2)+'" data-y="'+(y-2)+'"';
  var div = '<div class="dot" '+attr+' style="'+position+'"></div>';
  project.artBoard.append(div);
}
Tools.prototype.hoverCoordinate = function(e)
{
  e = $(e.target);
  var left = e.attr('data-x') - 3;
  var top = e.attr('data-y') - 3;
  var style = e.attr('style');
  
  e.attr('style','left:'+left+'px; top:'+top+'px;');
  
  e.on('mouseleave',function(){
    $(this).attr('style',style);
    $(this).off('mouseleave');
  });              
}
Tools.prototype.drag = function(f1,f2)
{
  project.artBoard.on('mousemove',function(e){
    f1.call(this);
  });              

  project.artBoard.on('mouseup mouseleave',function(e){
    $(this).off('mousemove mouseup mouseleave');
     f2.call(this);
  });
}

function Line(type)
{
  Tools.call(this,type);
  this.continuous = false;
  this.position = {x1:null, y1:null, x2:null, y2:null};
}

Line.prototype = Object.create(Tools.prototype)
Line.prototype.constructor = Line;
Line.prototype.draw = function()
{  
  var canvas = project.canvas;
  canvas.beginPath();
  canvas.lineWidth = this.options.lineWidth;
  canvas.strokeStyle = this.options.strokeStyle;             
  canvas.moveTo(this.position.x1, this.position.y1);
  canvas.lineTo(this.position.x2, this.position.y2);
  canvas.stroke();

  if(this.continuous)
  {
    this.position.x1 = this.position.x2;
    this.position.y1 = this.position.y2;    
  }
  
};

var pencil = new Line('pencil');

pencil.active = function(e){
  this.position.x1 = e.offsetX;
  this.position.y1 = e.offsetY;
  
  this.drag(function(){
    this.position.x2 = e.offsetX;
    this.position.y2 = e.offsetY;
    this.draw();
  },function(){null}
           );
};

var line = new Line('brush');
console.log(pencil)









/*
  THE OOP MECHANISM CAN BE USED FOR THE DRAW APP
  
  LIST OF TOOLS:

  - LINE
    - PENCIL
    - MARKER
  - SHAPE 
    - SQUARE 
    - CIRCLE  
    - TRIANGLE
    - POLYGON(HAS SOME INHERITANCE FROM LINE)
  - ERASER
  - TEXT
  
    ####################################
     ALL TOOLS MUST SHARE THE FOLLOWING
    ####################################
    # - A DRAG FUNCTION
    # - A DRAW FUNCTION
       - A DIFFERENT FUNCTION WILL BE RETURNED 
        DEPPENDING ON THE PARAMETER PASSED,THAT
        SHALL BE ANY OF THE FOLLOWING TOOLS NAME 
        IN A TEXT OR NUMBER
    # - OPTIONS
       - ALL OPTIONS AVIALABLE TO EVERY OBJECT
         THEN WE MAP THESE METHODS
         ANY OBJECT THAT HAS THIS INTERFACE CAN MAKE USE OF THEM
         
         
    
  HISTORY:
  - UNDO
  - REDO
  - ADD
  - EDIT
  -
  
*/

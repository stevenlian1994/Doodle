$(document).ready(function(e){

    var project = (function(){

        var menu =  (function(){

            var toogleTab = function(e){

                e = $(e.currentTarget);
                if(e.attr('data-menu') == "open")
                {
                    e.children('ul').addClass('hide');
                    e.attr('data-menu','closed');
                }
                else if(e.attr('data-menu') == "closed")
                {
                    e.children('ul').removeClass('hide');
                    e.attr('data-menu','open');
                }
            };

            /******************************************
                            CONSTRUCTORS
            *******************************************/

            function Options(type,template){
                this.type = type;
                this.template = template;
                };

            /******************************************
                            PROTOTYPES
            *******************************************/

            Options.prototype.init = function(e,callback){
                var modal = (function(){
                    var html = '<section class="modal" data-menu-option-method="'+this.type+'" >'
                        +'<div class="dragable-header">'
                            +'<button data-modal="decline" class="close"></button>'
                        +'</div>'
                        +'<div class="container">'
                        + this.template()
                        +'</div>'
                    +'</section>';

                    $('.modal[data-menu-option-method="'+this.type+'"]').remove();

                    $('main').append(html);

                }.bind(this))();
                $('.modal[data-menu-option-method="'+this.type+'"]').on('mousedown',function(e){
                    if(callback != undefined){
                        this.tasks(e,callback);
                    }
                    else{
                        this.tasks(e);
                    }
                }.bind(this));
            };
            Options.prototype.drag = function(e){
                var position = {x: null, y:null};
                position.x = e.target.parentElement.offsetLeft - e.pageX;
                position.y = e.target.parentElement.offsetTop - e.pageY;

                var target = $(e.target);

                $(document).on('mousemove',function(e){
                        target.parent().css({
                            'left':(position.x + e.pageX) + 'px',
                            'top':(position.y + e.pageY) + 'px',
                        });
                    });

                $(document).on('mouseup',function(){
                    $(this).off('mouseup mousemove');
                });

            }
            Options.prototype.close = function(){
                    $('.modal[data-menu-option-method="'+this.type+'"]').remove();
                    $('.modal[data-menu-option-method="'+this.type+'"]').off('mousedown');
                }

            /******************************************/

            var fileNew = new Options('new');
            fileNew.template = function(){

                    return'<div id="new-file">'
                            +'<div class="row">'
                                +'<label>Title :</label>'
                                +'<input name="art-board-title" type="text" placeholder="Untitled">'
                            +'</div>'
                            +'<div>'
                                +'<label>Width : </label>'
                                +'<input name="art-board-width" type="text" placeholder="in pixels">'
                            +'</div>'
                            +'<div>'
                                +'<label>Height :</label>'
                                +'<input name="art-board-height" type="text" placeholder="in pixels">'
                            +'</div>'
                            +'<div class="row">'
                                +'<button class="accept">'
                                    +'DONE'
                                +'</button>'
                                +'<button data-modal="decline" class="decline">'
                                    +'CANCEL'
                                +'</button>'
                            +'</div>'
                            +'<div class="row error">'
                                +'<p></p>'
                            +'</div>'
                        +'</div>';


                };
            fileNew.tasks = function(e){
                var target = $(e.target);

                if(target.hasClass('decline') || target.hasClass('close')){
                    this.close();
                }

                else if(target.hasClass('dragable-header')){
                    this.drag(e);
                }

                else if(target.hasClass('accept')){
                    var validate = function(e){
                        var values = {};
                        var create = function(){
                            project.history.bin = [];
                            project.history.tmp = [];

                            project.details.width = values.width;
                            project.details.height = values.height;
                            project.details.title = values.title;

                            var size = 'width="'+values.width+'" height="'+values.height+'"';

                            var canvas ='<canvas id="main-canvas" data-saved="false" '+size+'></canvas>'
                                +'<canvas id="edit-canvas" '+size+'></canvas>';


                            project.artBoard.css('width',(values.width + 'px'));
                            project.artBoard.css('height',(values.height + 'px'));
                            project.artBoard.empty();
                            project.artBoard.append(canvas);
                            project.artBoard.removeClass('hide');
                            project.canvas.main = document.getElementById('main-canvas').getContext('2d');
                            project.canvas.edit = document.getElementById('edit-canvas').getContext('2d');


                        }.bind(this);
                        var unSavedWork = function(){
                            var canvas = project.artBoard.children('#main-canvas');
                            canvas = canvas.attr('data-saved')

                            this.close();

                            if(canvas == 'false')
                            {
                                notSaved.init(e,create);
                            }
                            else
                            {
                                create(values)
                            }



                        }.bind(this);
                        var input = (function(){
                            var valid = true;

                            ['width','height','title'].forEach(function(string,i){

                                var input = (

                                    i != 2

                                    ?

                                    Number($('[name="art-board-'+string+'"]').val())

                                    :

                                    String($('[name="art-board-'+string+'"]').val())
                                );

                                if(!input || typeof input == 'number' && input < 25 || input == ' '){

                                    valid = false;
                                    $('[name="art-board-'+string+'"]').css('border-color','red');
                                }
                                else{

                                    values[string] = input;
                                    $('[name="art-board-'+string+'"]').attr('style','')

                                }


                            });

                            if(valid){
                                unSavedWork();
                            }

                        })();
                    }.bind(this);
                    validate();
                }



            };

            /******************************************/

            var notSaved = new Options('notSaved');
            notSaved.template = function(){
                return '<div id="not-saved">'
                        +'<p>Your current project is not saved, do you wish to save it ?</p>'
                            +'<div class="row">'
                                +'<button class="accept">'
                                    +'YES'
                                +'</button>'
                                +'<button class="decline">'
                                    +'NO'
                                +'</button>'
                            +'</div>'
                        +'</div>'
            };
            notSaved.tasks = function(e,call){
                var target = $(e.target);
                if(target.hasClass('close')){
                    this.close();
                }
                else if(target.hasClass('decline')){
                    this.close();
                    call();
                }
                else if(target.hasClass('dragable-header')){
                    this.drag(e);
                }
                else if(target.hasClass('accept')){
                    var canvas = project.artBoard.children('#main-canvas');
                    call();
                    canvas = canvas.attr('data-saved','true');
                    this.close();
                }

            }

            /******************************************/

            var editClear = new Options('editClear');
            editClear.init = function(){
               project.tools.clear.exe('main');
            }

            /******************************************/

            var editUndo = new Options('undo');
            editUndo.init = function(){
                var item = project.history.bin[project.history.bin.length - 1];
                if(item != undefined){
                    project.history.tmp.push(item);
                    project.history.bin.pop();
                    project.tools.clear.draw('main');
                    project.history.bin.forEach(function(obj){
                        project.tools[obj.type].redraw(obj.data);
                    });
                    if(item.type == 'line' && project.tools.selected == 'line')
                    {
                        if(item == undefined || item.type != 'line')
                        {
                          project.tools.line.position = {x1: null, y1: null, x2: null, y2: null};
                        }
                        else
                        {
                          project.tools.line.position = {x1:item.data[0].position.x1,y1:item.data[0].position.y1,x2:null,y2:null};
                          project.tools.line.coordinate.show();
                        }

                    }
                }
            }

            /******************************************/

            var editRedo = new Options('redo');
            editRedo.init = function(){
                var item = project.history.tmp[project.history.tmp.length - 1];
                if(item != undefined){
                    project.history.bin.push(item);
                    project.history.tmp.pop();
                    project.tools.clear.draw('main');
                    project.history.bin.forEach(function(obj){
                        project.tools[obj.type].redraw(obj.data);
                    });
                    if(item.type == 'line' && project.tools.selected == 'line')
                    {
                        if( item == undefined || item.type != 'line')
                        {
                          project.tools.line.position = {x1: null, y1: null, x2: null, y2: null};
                        }
                        else
                        {
                          project.tools.line.position = {x1:item.data[0].position.x1,y1:item.data[0].position.y1,x2:null,y2:null};
                          project.tools.line.coordinate.show();
                        }

                    }
                }
            }

            /******************************************
                       INSTANCES OF OBJECTS
            *******************************************/

            return {
                    file: {
                        new: fileNew,
                        notSaved: notSaved
                    },
                    edit: {
                        clear: editClear,
                        undo: editUndo,
                        redo: editRedo
                    },
                    toogle: toogleTab
                };

        })();

        var tools = (function(){

              /******************************************
                              CONSTRUCTORS
              *******************************************/

              function Tools(type){
                  this.type = type;
              }
              function Line(type){
                  Tools.call(this,type);
                  this.continuous = true;
                  this.array = [];
                  this.position = {x1:null, y1:null, x2:null, y2:null};
              }

              /******************************************
                              PROTOTYPES
              *******************************************/

              Tools.prototype.options = {
                  strokeStyle : 'rgba(25,25,25,1)',
                  fillStyle: 'black',
                  lineJoin: 'round',
                  lineCap: 'round',
                  lineWidth: 1
              };
              Tools.prototype.coordinate = {};
              Tools.prototype.coordinate.size = 5;
              Tools.prototype.coordinate.plot = function(x,y){

                  x = x - 2;
                  y = y - 2;

                  var position = 'left:'+(x)+'px; top:'+(y)+'px;';
                  var attr = 'data-x="'+(x)+'" data-y="'+(y)+'"';
                  var div = '<div class="coordinate" '+attr+' style="'+position+'"></div>';
                  project.artBoard.append(div);

              };
              Tools.prototype.coordinate.hover= function(e){
                  project.artBoard.on('mouseenter','.coordinate',function(e){

                      e = $(e.target);

                      var left = Number(e.attr('data-x')) - 3;
                      var top = Number(e.attr('data-y')) - 3;
                      e.attr('style','left:'+left+'px; top:'+top+'px;');

                      project.artBoard.on('mouseleave','.coordinate',function(){
                          left += 3;
                          top +=  3;
                          $(this).attr('style','left:'+left+'px; top:'+top+'px;');
                          $(this).off('mouseleave mouseenter','.coordinate');
                      });


                  });
              };
              Tools.prototype.coordinate.show = function(e){
                  $('.coordinate').remove();
                  var sorted = [];
                  for (var i = project.history.bin.length; i > 0 ; i--) {
                    var obj = project.history.bin[i - 1];
                    if(obj.type == 'clear'){ break; }
                    if (obj.type == 'line') {
                        sorted.push({x: obj.data[0].position.x1, y: obj.data[0].position.y1});
                        sorted.push({x: obj.data[0].position.x2, y: obj.data[0].position.y2});
                    }
                  }
                  sorted.forEach(function(position){
                      this.plot(position.x,position.y)
                  }.bind(this));
              }
              Tools.prototype.drag = function(e){
                  project.artBoard.on('mousemove',function(e){
                      this.init(e);
                  }.bind(this));
                  project.artBoard.on('mouseup mouseleave',function(e){
                      project.artBoard.off('mousemove mouseup mouseleave');
                      this.fin(e);
                  }.bind(this));
              };
              Tools.prototype.details = {
                  list:[],
                  collect: function(){
                      this.details.list.push({
                          options: {
                          strokeStyle: this.options.strokeStyle,
                          fillStyle: this.options.fillStyle,
                          lineJoin: this.options.lineJoin,
                          lineCap: this.options.lineCap,
                          lineWidth: this.options.lineWidth
                      },
                          position: {
                                  x1:this.position.x1,
                                  y1:this.position.y1,
                                  x2:this.position.x2,
                                  y2:this.position.y2
                                }
                      });
                  },
                  addToHistory: function(){
                      if(this.details.list.length > 0){
                          project.history.bin.push({
                              type: this.type,
                              data: this.details.list
                          });
                          this.details.list = [];

                      }
                  }
              };

              /******************************************/

              Line.prototype = Object.create(Tools.prototype);
              Line.prototype.constructor = Line;
              Line.prototype.draw = function(){
                  var canvas = project.canvas.main;

                  canvas.beginPath();
                  canvas.lineWidth = this.options.lineWidth;
                  canvas.lineCap = this.options.lineCap;
                  canvas.strokeStyle = this.options.strokeStyle;
                  canvas.moveTo(this.position.x1, this.position.y1);
                  canvas.lineTo(this.position.x2, this.position.y2);
                  canvas.stroke();


              };
              Line.prototype.redraw = function(array){
                  var canvas = project.canvas.main;

                  canvas.beginPath();
                  canvas.lineWidth = array[0].options.lineWidth;
                  canvas.lineCap = array[0].options.lineCap;
                  canvas.lineJoin = array[0].options.lineJoin;
                  canvas.strokeStyle = array[0].options.strokeStyle;
                  canvas.moveTo(array[0].position.x1, array[0].position.y1);
                  array.forEach(function(obj){
                      canvas.lineTo(obj.position.x2, obj.position.y2);
                  })
                  canvas.stroke();
              }
              Line.prototype.init = function(e){

                  var x = ($(e.target).hasClass('coordinate') ? Number($(e.target).attr('data-x')) + 2 : e.offsetX);
                  var y = ($(e.target).hasClass('coordinate') ? Number($(e.target).attr('data-y')) + 2 : e.offsetY);

                  if(this.position.x1 == null)
                  {
                      this.position.x1 = x;
                      this.position.y1 = y;
                  }

                  else
                  {
                      this.position.x2 = x;
                      this.position.y2 = y;
                  }
                  this.exe(e,x,y);

              }
              Line.prototype.fin = function(e,x,y){
                  this.position = {x1:null, y1:null, x2:null, y2:null};
                  this.end(e,x,y);
              }

              /******************************************
                          INSTANCES OF OBJECTS
              *******************************************/

              var line = new Line('line');
              line.exe = function(e,x,y){

                  this.coordinate.hover(e);

                  if(this.position.x1 != this.position.x2 &&
                  this.position.y1 != this.position.y2 &&
                  this.position.x2 != null
                  )
                  {
                      this.draw();
                      this.details.collect.call(this);
                      this.details.addToHistory.call(this);
                  }

                  this.position.x1 = x;
                  this.position.y1 = y;

                  if(!$(e.target).hasClass('coordinate'))
                  {
                      this.coordinate.plot(x,y);
                  }

                  project.artBoard.on('dblclick','.coordinate',function(){
                      this.fin();
                  }.bind(this));

              };
              line.end = function(e){
                  $('.coordinate').remove();
              }
              line.active = function(e){
                  this.init(e);
              };

              /*******************************************/

              var pencil = new Line('pencil');
              pencil.exe = function(e,x,y){
                if(this.position.x2 != null){
                  this.details.collect.call(this);
                  this.draw();
                  this.position.x1 = x;
                  this.position.y1 = y;
                }

              };
              pencil.end = function(e,x,y){
                  this.details.addToHistory.call(this);
              }
              pencil.active = function(e){
                  this.drag(e);
              };

              /*******************************************/

              var brush = Object.create(pencil);
              brush.type = 'brush';
              brush.redraw =  function(array){
                  var canvas = project.canvas.main;
                  array.forEach(function(obj){
                      canvas.beginPath();
                      canvas.lineWidth = obj.options.lineWidth;
                      canvas.lineCap = obj.options.lineCap;
                      canvas.lineJoin = obj.options.lineJoin;
                      canvas.strokeStyle = obj.options.strokeStyle;
                      canvas.moveTo(obj.position.x1, obj.position.y1);
                      canvas.lineTo(obj.position.x2, obj.position.y2);
                      canvas.stroke();
                  })

              }
              brush.lineWidth = brush.options.lineWidth + 1.5;
              brush.exe = function(e,x,y){

                  if(this.options.lineWidth < this.lineWidth)
                  {
                      this.options.lineWidth += .15;
                  }

                  this.details.collect.call(this);
                  this.draw();
                  this.position.x1 = x;
                  this.position.y1 = y;

              }
              brush.end = function(e,x,y){
                  this.options.lineWidth = this.lineWidth - 1.5;
                  this.details.addToHistory.call(this);
              }

              /*******************************************/

              var marker = Object.create(pencil);
              marker.type = 'marker';
              marker.draw = function(array,canvas){
                  var canvas = project.canvas[canvas];

                  canvas.beginPath();
                  canvas.lineWidth = array[0].options.lineWidth;
                  canvas.lineCap = array[0].options.lineCap;
                  canvas.lineJoin = array[0].options.lineJoin;
                  canvas.strokeStyle = array[0].options.strokeStyle;
                  canvas.moveTo(array[0].position.x1, array[0].position.y1);
                  array.forEach(function(obj){
                      canvas.lineTo(obj.position.x2, obj.position.y2);
                  })
                  canvas.stroke();

              }
              marker.exe = function(e,x,y){
                if(this.position.x2 != null)
                {
                  // this is a temp fix you will have to create the color picker
                  this.options.strokeStyle = 'rgba(25,25,25,.5)';
                  project.tools.clear.draw('edit');
                  this.details.collect.call(this);
                  this.draw(this.details.list,'edit');
                  this.position.x1 = x;
                  this.position.y1 = y;
                }
              }
              marker.end = function(e,x,y){
                  project.canvas.main.globalCompositeOperation = 'source-over';
                  project.tools.clear.draw('edit')
                  this.draw(this.details.list,'main');
                  this.details.addToHistory.call(this);
                  this.options.strokeStyle = 'rgba(25,25,25,1)';


              }


              /*******************************************/

              var eraser = new Line('eraser')
              eraser.exe = function(e,x,y){
                if(this.position.x2 != null)
                {
                  this.details.collect.call(this); project.canvas.main.globalCompositeOperation = 'destination-out';
                  this.options.strokeStyle = 'rgba(225,25,25,1)';
                  this.draw();
                  this.position.x1 = x;
                  this.position.y1 = y;
                }
              }
              eraser.end = function(e,x,y){
                  project.canvas.main.globalCompositeOperation = 'source-over';
                  this.details.addToHistory.call(this)
              }
              eraser.redraw = function(array){

                  project.canvas.main.globalCompositeOperation = 'destination-out';
                  this.__proto__.redraw(array);
                  project.canvas.main.globalCompositeOperation = 'source-over';

              }
              eraser.active = function(e){
                  this.drag(e);
              };

              /*******************************************/

              var clear = new Tools('clear');
              clear.draw = function(canvas){
                  project.canvas[canvas].clearRect(
                      0,0,project.details.width,project.details.height
                  );
              };
              clear.redraw = function(){
                  project.canvas.main.clearRect(
                      0,0,project.details.width,project.details.height
                  );
              }
              clear.addToHistory = function(){
                  project.history.bin.push({
                      type: this.type,
                      data: {
                              position: {x:0,y:0},
                              width: project.details.width,
                              height: project.details.height
                            }
                  });
              };
              clear.exe = function(canvas){
                  clear.draw(canvas);
                  clear.addToHistory();
              }

              /*******************************************
                              FINAL OBJECT
              *******************************************/

              return {
                  selected: 'pencil',
                  line: line,
                  brush: brush,
                  pencil: pencil,
                  eraser: eraser,
                  marker: marker,
                  clear: clear
              };
        })();

        return {
            details: {
                author: null,
                width: null,
                height: null,
                title:null
            },
            artBoard: $('#art-board'),
            canvas: {
                main:null,
                edit:null
            },
            menu: menu,
            tools: tools,
            history: {
                bin:[],
                tmp:[]
            }
        }

        })();

    project.artBoard.on('mousedown',function(e){
        project.tools[project.tools.selected].active(e);
    });
    $(document).on('keydown',function(e){
        var key = e.originalEvent.key;
        var shift = e.originalEvent.shiftKey;

        if(key == "Z" && shift)
        {
            project.menu.edit.undo.init();
        }if(key == "Y" && shift)
        {
            project.menu.edit.redo.init();
        }
        if(key == "E"){
            project.tools.selected = 'eraser';

        }

        if(key == "C"){
            project.menu.edit.clear.init();

        }

        if(key == "V")
        {
             console.log(project.history.bin)
        }

    })
    $('nav > ul > li > ul > li').on('click',function(e){
        var method = $(this).attr('data-menu-option-method');
        var option = $(this).parent().attr('data-menu-option');
        project.menu[option][method].init(e);
    });
    $('nav > ul > li').on('click',function(e){
        project.menu.toogle(e);
    })


    /*
       create a hot keys object and this function will call
       the correct function accoriding to the input recieved and this wy
       you can set

       you need to add a history to your plot and work with the Z hot key
    */






function start(project){project.history.bin = [];
  project.history.tmp = [];

  project.details.width = 500;
  project.details.height = 500;
  project.details.title = 500;

  var size = 'width="'+500+'" height="'+500+'"';

  var canvas ='<canvas id="main-canvas" data-saved="false" '+size+'></canvas>'
      +'<canvas id="edit-canvas" '+size+'></canvas>';


  project.artBoard.css('width',(500 + 'px'));
  project.artBoard.css('height',(500 + 'px'));
  project.artBoard.empty();
  project.artBoard.append(canvas);
  project.artBoard.removeClass('hide');
  project.canvas.main = document.getElementById('main-canvas').getContext('2d');
  project.canvas.edit = document.getElementById('edit-canvas').getContext('2d');

          } start(project);

});

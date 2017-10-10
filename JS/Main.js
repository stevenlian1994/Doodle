$(document).ready(function(e){
    var project = (function(){
        function drag(init,fin){
                    $(document).on('mousemove',function(e){
                        init.exe.apply(init.context,[e]);
                        $(document).on('mouseup',function(e){
                            //fin.exe.apply(fin.context,[e]);
                            $(this).off('mousemove mouseup');
                        });
                    });
                }
        
        function Modal(id){
            var id = 'data-modal-id="'+id+'"';
            function render(){
               var html =   '<div class="modal" '+id+'>'+
                                '<div class="row modal-header">'+
                                    '<button class="close" type="button"></button>'+
                                '</div>'+
                                '<div class="modal-body">'+
                                    this.template() +
                                '</div>'+
                            '</div>';
                
                $('main').append(html)
            }
            function events(){
                var  selector = $('['+id+']');
                selector.on('mousedown',function(e){
                    function hasClass(text){
                        
                        if( e.target.className.indexOf(text) != -1)
                        {
                            return true;
                        }
                        else{
                            return false;
                        
                        }
                    };
                    
                    if(hasClass('close') || hasClass('cancel'))
                    {
                        selector.remove();
                        selector.off('mousedown');
                    }
                    else if(hasClass('modal-header')){
                        var init = {};
                        var fin = {}
                        init.position = {x: null, y:null};
                        init.position.x = e.target.parentElement.offsetLeft - e.pageX;
                        init.position.y = e.target.parentElement.offsetTop - e.pageY;
                        init.target = $(e.target);
                        init.context = init;
                        init.exe = function(e){
                            this.target.parent().css({
                                'left':(this.position.x + e.pageX) + 'px',
                                'top':(this.position.y + e.pageY) + 'px',
                            });
                        }
                        drag(init,fin)
                       
                    }
                    else if(hasClass('accept'))
                    {
                        this.exe(e);
                    }

                }.bind(this))
            }
            
            return {
                init: function(){
                    $('['+id+']').remove();
                    render.call(this);
                    events.call(this);
                },
                close: function(){
                    $('['+id+']').remove()
                }
            }
        }
        
        function Form(){
            function getData(data){
                var obj = {};
                for (var i = 0; i < data.length; i++)
                {
                    obj[data[i].attributes.name.value] = data[i].value;
                }
                return obj;
            };
            function validate(data){
                var valid = true;
                
                for(var rule in this.rules)
                {
                    rule = this.rules[rule](data);
                   
                    if(!rule.valid)
                    {
                        valid = false;
                        this.error.html(rule.error);
                        break;
                    }
                }
                
                return valid;
            };
            return {
                rules : {},
                init : function(){
                    
                    this.error.html('');
                    
                    var data = getData(this.get);
                    
                    if(validate.call(this,data))
                    {
                        this.exe(data);
                        return true;
                    }
                    else
                    {
                        if(this.failed)
                        {
                            this.failed();
                           
                        }
                        
                        return false;
                    };
                    
                }
            };
        }
        
        var History = function(){
            /*
                The history object is in charge of recording data for each interaction the 
                canvas has. This will allow us to record user interactions, store them to be used 
                later. Each item stored must be a procedince of Tools object. 
                
                Each object stored must have the following data.

                refrence to layer -> layer id
                refrence to artboard -> artboard id
                Type of tool - > string
                Tools Data ->  data 
                
                this is done through a collect function 
                
                The objects will be kept inside an array.
                we will have a tmp list and a current list
                the tmp list will be used for corrections
                
                The interface that this object will permit us 
                to add and remove objects from a list.
                
                Each object will have its on unique data
                the History object only cares about keeping an
                index in the order they were created and modified.
                the data of the actual object is for the the object being
                stored.
                
                this means that its only priority will be adding and creating 
                index list of object also creating a sorted list of all the tools
                on the fly.
            */
            
            var list = [];
            var tmp = [];
            function clone(data){ 
                var obj = {};
                for(var value in data)
                {
                    obj[value] = data[value];
                }

                return obj;
                    
            };
            
           
            
            
            return {
                add: function(data){
                    list.push({
                    artboard: data.artboard,
                    canvas: clone(data.canvas),
                    position: clone(data.position)
                          });
                    console.log(list)
                },
                
                remove: function(){
                tmp.push(list.pop());
            },
                
            }
        }();
        
        var Tools = function(){
            var canvas  = {};
            var artboard = null;
            function context(data){
                artboard = data.board;
                canvas.current = data.current.id[0].getContext('2d');
                canvas.edit = data.edit.id[0].getContext('2d');        
            }
            var Tool = {
                drag: drag,
                coordinate: {
                    plot: function(data){
                        /*
                            we have to subtract 2 pixels so the div can be 
                            centered. Since the total width is 5 and the pointer uses
                            a squares corner as the click area.
                        */
                        var position = 'left:'+(data.x - 2)+'px; top:'+(data.y - 2)+'px;';
                        var attr = 'data-x="'+(data.x - 2)+'" data-y="'+(data.y - 2)+'"';
                        var div = '<div class="coordinate" '+attr+' style="'+position+'"></div>';

                        artboard.append(div);
                    },
                    hover: function(toggle){
                        if(toggle)
                        {
                            artboard.on('mouseenter','.coordinate',function(e){
                                e = $(e.target);
                                var left = Number(e.attr('data-x')) - 3;
                                var top = Number(e.attr('data-y')) - 3;
                                e.css({'left': left +'px',
                                        'top': top +'px'
                                      });
                                artboard.on('mouseleave','.coordinate',function(e){
                                  left += 3;
                                  top +=  3;
                                  $(this).css({'left': left+'px',
                                        'top': top+'px'
                                      });
                                  $(this).off('mouseleave');
                                });

                            });
                        }
                        else
                        {
                            artboard.off('mouseenter mouseleave','.coordinate');
                        }
                    }
                },
                settings: {
                    fillStyle: 'rgba(0,0,0,1)',
                    strokeStyle: 'rgba(0,0,0,1)',
                    shadowColor: 'rgba(0,0,0,1)',
                    shadowBlur: null,
                    lineCap: 'round',
                    lineJoin: 'round',
                    lineWidth: 1,
                    miterLimit: 10
                }
            }
            
            /**************************************
                        CONSTRUCTORS
            ***************************************/
            
            function Line(type){
                this.type = type;
                this.position = {
                    x1: null, x2: null, y1: null, y2: null
                };
                this.init = function(data){
                    context(data);
                    this.coordinate.hover(data,true);
                    artboard.on('mousedown',function(e){
                        var data = {};
                        if(e.originalEvent.detail == 2){
                            this.position.x1 = null;
                            this.position.y1 = null;
                            this.position.x2 = null;
                            this.position.y2 = null;
                        }
                        else
                        {
                            ($(e.target).hasClass('coordinate') ? 

                                (
                                    data.x = Number($(e.target).attr('data-x')) + 2 ,
                                    data.y = Number($(e.target).attr('data-y')) + 2,
                                    data.plot = false

                                ) 

                                :

                                ( data.x = e.offsetX, data.y = e.offsetY, data.plot = true)

                            );

                            data.isFirst = true;
                            data.event = e;

                            if(this.position.x1 == null)
                            {
                                this.position.x1 = data.x;
                                this.position.y1 = data.y;
                            }
                            else
                            {
                                this.position.x2 = data.x;
                                this.position.y2 = data.y;
                                data.isFirst = false;
                            }

                            this.exe(data);
                        }
                    }.bind(this));
                    
                }
                this.fin = function(){
                    this.coordinate.hover(false);
                    artboard.off('mousedown')
                }
                
            }
            Line.prototype = Object.create(Tool);
            Line.prototype.draw =  function(){
                // this loop adds all config to the canvas
                for(var setting in this.settings)
                {
                    canvas[setting] = this.settings[setting];
                }
                canvas.edit.beginPath();
                canvas.edit.moveTo(this.position.x1,this.position.y1);
                canvas.edit.lineTo(this.position.x2,this.position.y2);
                canvas.edit.stroke();
             
            }
                    
            
            /**************************************
                          INSTANCES
            ***************************************/
                        
            var line = new Line('line');
            line.exe = function(data){
                if(data.plot)
                {
                   this.coordinate.plot(data);
                }
                if(!data.isFirst){
                    History.add({
                        artboard:artboard,
                        canvas: canvas,
                        position: this.position,
                        settings: this.settings
                    });
                    this.draw()
                    this.position.x1 = data.x;
                    this.position.y1 = data.y;
                }
                
            }

            return {'line':line};
        }();
         
        var Artboards = function(){
           
            var boardCont = $('#art-board-cont');
            var boardID = 0;
            var boards = {};            
            
            /*
                A function that is called once, to allow the
                ability of listening for the mouseenter event.
                this will allow us to pick up information of the
                current art-board we are on. This data is important
                as it lets us adress the correct canvas we have to
                work on and what edit canvas to use.
            */
           
            $('#art-board-cont').on('mouseenter','.art-board',function(e){
                var currentBoard = 'artboard-'+String(e.currentTarget.attributes['data-artboard-id'].value);                    
                Tools.line.init(boards[currentBoard].layers)
                $(this).on('mouseleave',function(e){
                   Tools.line.fin();
                })
            });
            
            function Layer(data){
                    /*
                        This object will return an interface that will permit
                        interaction. the interface is based on perfoming basic CRUD
                        functionality. It permits the creation of layers and stores
                        their refrence in a list. This is a depandant of the Board
                        object.
                    */
                    this.counter = 0;
                    this.board = function(data){
                        return $('[data-artboard-id="'+data.id+'"]')
                    }.apply(this,[data]);
                    this.height = data.height;
                    this.width = data.width;
                    this.list = {};
                    this.current = null;
               
            }
            Layer.prototype.addToDOM = function(){
                var id = 'data-layer-id="'+this.counter+'"';
                var size =  'height="'+this.height+'px" width="'+this.width+'px"';
                var layer = '<canvas '+size+id+'></canvas>';
                this.board.prepend(layer);
                
            }
            Layer.prototype.create = function(data){
                this.addToDOM();
                var layer = {};
                layer.index = function(){
                  return 'layer-'+this.counter
                }.apply(this);
                layer.id = function(){
                  return $(this.board).children('[data-layer-id="'+this.counter+'"]');
                }.apply(this);
                layer.title = function(data){
                    return (data.title ? data.title : 'Untitled-'+this.counter)
                }.apply(this,[data]);
                
                
         
                if(!data.edit)
                {
                    /*
                        If the object is not edit, add it to our
                        list of canvas. otherwise don't but add the
                        refrence of our edeting layer to our Layer object.
                    */
                    this.list[layer.index] = layer;
                    this.current = function(){ return this.list[layer.index]; }.apply(this);
                    
                }
                else
                {
                    this.edit = layer;
                    
                }
                
                this.counter++;
                   
            }
            
            function Board(data){
                /*
                    This board object allows the creation of
                    an object that containts data to refrence
                    an Artboard. A file can have more than one artboard
                    therefor this Object will permit the creations of an artboard.
                    In the essence the board board object is used to create an artboard
                    this is done by appending it to the the DOM and then adding it to a list.
                    
                    The layers object are related directly to its container which is the artboard
                    when you hover over the artboard we will check the boards for the artboard that
                    mactches the artboard ID with this we will then check what is the current artboard
                    we are working with.
            
                */
                boardID++;
                this.id = boardID;
                this.title = 'untitled';
                this.width = data.width;
                this.height = data.height;
            }
            Board.prototype.index = function(data){
                var size = ' style=" height:'+this.height+'px; width:'+this.width+'px; "'
             
                boardCont.append('<div class="art-board"'+size+'data-artboard-id="'+this.id+'"></div>');
                
                data.id = this.id;
                
                this.layers = new Layer(data);
                
                this.layers.create({edit:true,title:'EDIT'});
                this.layers.create(data);
                
                boards['artboard-'+this.id] = {
                    id : this.id,
                    title : this.title,
                    width : this.width,
                    height : this.height,
                    layers: this.layers
                };
                
            }

            function create(data){
                var modal = new Modal('new-art-board');
                modal.template = function(){
                    return '<form id="new-art-board">'+
                                '<div class="inputs col">'+
                                    '<div class="cont row">'+
                                        '<label for="width">Width:</label>'+
                                        '<input type="text" name="width" value="" placeholder="Numbers only">'+
                                    '</div>'+
                                    '<div class="cont row">'+
                                        '<label for="height">Height:</label>'+
                                        '<input type="text" name="height" value="" placeholder="Numbers only">'+
                                    '</div>'+
                                '</div>'+
                                '<div class="errors">'+
                                '</div>'+
                                '<div class="buttons row">'+
                                    '<button class="accept" type="button">Done</button>'+
                                    '<button class="cancel" type="button">Cancel</button>'+
                                '</div>'+
                            '</form>';
                }
                modal.exe = function(){
                    var form = new Form();
                    form.get = $("#new-art-board input");
                    form.error = $('#new-art-board .errors');
                    form.rules['notEmpty'] = function(data){
                        var response = {valid: true, error: 'Empty'}
                        for(var value in data)
                        {
                            if(data[value] == '' || data[value] == undefined)
                            {
                                response.valid = false;
                                break;
                            }
                            
                        }
                        
                        return response;

                    };
                    form.rules['NaN'] = function(data){
                        var response = {valid: true, error: 'Please enter a valid number'};
                        for(var value in data)
                        {
                            if(isNaN(data[value])){
                                response.valid = false;
                                break;
                            }
                        }
                        
                        return response;
                    }
                    form.rules['sizeLimit'] = function(data){
                        if(Number(data['height']) > 2000 || Number(data['width']) > 2000)
                        {
                            return {valid: false, error: 'The size limit is 2000px'};
                        }
                        
                        return {valid:true}
                    }
                    form.exe = function(data){
                        var board = new Board(data);
                        board.index(data);
                        modal.close();
                    };
                    
                    form.init();
                    
                }
                modal.init()
            }
            
            return {
                create: create
            }
        
        }
       
        return {
           ArtBoard: Artboards()
       };
        
    }());
    
    $('nav').on('click',function(){
        project.ArtBoard.create();
    });
    
});


/*
*****************************
         TODO LIST
*****************************.

- CREATE A WAY TO HIDE AND SHOW ALL THE COORDINATES IN THAT ARTBOARD 

- 

*****************************
    
*/
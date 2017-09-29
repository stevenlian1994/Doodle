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
        
        function Modal(){
            
            var counter = 0;
            var id = 'data-modal-id="'+String(counter++)+'"';
            
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
                        fin.context = null; 
                        fin.exe = function(e){
                            console.log(e)
                        }
                        
                        drag(init,fin)
                       
                    }
                    else if(hasClass('accept'))
                    {
                        this.exe(e);
                    }

                }.bind(this))
            }
            
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
            
            return {
                init: function(){                     
                    render.call(this);
                    events.call(this);
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
        
        var Tools = function(){
            var Tool = {
                drag: function(init,fin){
                    $(document).on('mousemove',function(e){
                        init.exe.apply(init.context,[init.arg]);
                        $(document).on('mouseup',function(e){
                            fin.exe.apply(fin.context,[fin.arg]);
                            $(this).off('mousemove mouseup');
                        });
                    });
                },
                coordinate: {
                    plot: function(data){
                        data.x = data.x - 2;
                        data.y = data.y - 2;
                        var position = 'left:'+(data.x)+'px; top:'+(data.y)+'px;';
                        var attr = 'data-x="'+(data.x)+'" data-y="'+(data.y)+'"';
                        var div = '<div class="coordinate" '+attr+' style="'+position+'"></div>';

                        data.artboard.append(div);
                    },
                    hover: function(data,toggle){
                        if(toggle)
                        {
                            data.artBoard.on('mouseenter','.coordinate',function(e){
                                e = $(e.target);
                                var left = Number(e.attr('data-x')) - 3;
                                var top = Number(e.attr('data-y')) - 3;
                                e.css({'left': left +'px',
                                        'top': top +'px'
                                      });

                                e.on('mouseleave','.coordinate',function(e){
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
                            data.artBoard.off('mouseenter mouseleave','.coordinate');
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
                    this.coordinate.hover(data,true)
                    data.artboard.on('click',function(e){
                        
                        var x = ($(e.target).hasClass('coordinate') ? Number($(e.target).attr('data-x')) + 2 : e.offsetX);
                    
                        var y = ($(e.target).hasClass('coordinate') ? Number($(e.target).attr('data-y')) + 2 : e.offsetY);
                        
                        
                        data.x = x;
                        data.y = y;
                        data.isFirst = true;
                        data.event = e;
                        
                        if(this.position.x1 == null) 
                        {
                            this.position.x1 = x;
                            this.position.y1 = y;  
                        }
                        else
                        {
                            this.position.x2 = x;
                            this.position.y2 = y;
                            data.isFirst = false;
                        }                        
                        
                        this.exe(data);
                        
                    });
                }
                this.fin = function(data){
                    this.coordinate.hover(data,false);
                    data.artBoard.off('click')
                }

            }
            Line.prototype = Object.create(Tool);
            Line.prototype.draw =  function(data){
                var canvas  = data.layer;
                canvas = canvas.getContext('2d');
                for(var setting in this.settings)
                {
                    canvas[setting] = this.settings[setting];
                }
                canvas.beginPath();
                canvas.moveTo(this.position.x1,this.position.y1);
                canvas.lineTo(this.position.x2,this.position.y2);
                canvas.closePath();
                canvas.stroke();
            }
                    
            
            /**************************************
                          INSTANCES  
            ***************************************/
                        
            var line = new Line('line');
            line.exe = function(data){
                this.coordinate.plot(data.x,data.y);
            }

        }
        
        var Artboards = function(){
            /*
                When an artboard is initialized it must have a list of all artboards
                and each artboard has a layers object
                the layer object will create a layers
                
                The Layer Object will provide an art board with with a list of all the existing
                canvas on this artboard you can have more than one canvas per artboard
                this means that when creating an artboard it automatically gets intialized with one
                layer the base layer, each layer will have an id according to each artboard
            */
            var boardCont = $('#art-board-cont');
            var boardID = 0;
            var boards = [];
            
            function Layer(data){
                /*
                    Layers is an object that will permit the creation of canvas to append o the current artboar
                    as well as to delete update and read the canvas inside an artboard
                    when the Layer object is first initialized you must create two layers force fully 
                    this Object will return an interface that will allow the artboard to make use of.
                    
                    It will be able to reade the 
                    
                    object that will be created and only inumerable and numerable items will shopw up
                    to do this we have to have an edit layer that is a canvas
                    
                    A layer is a representation of a canvas the canvas has properties 
                    like its id
                    
                    two layers that store refrence to thier DOM location
                    
                    a layer that 
                    
                    
                    ID
                    TITLE
                    DOM Refrence
                    
                    Create a prototype for the functions all layers will perfom
                    such as create and deleting a layer and editing
                    this will mean the functions will need input and not assume data
                    some animals lay eggs thefore some horses lay egges.
                    
                    
                    Does the c onculsion follow from the premise all horses are animals some animals lay eggs
                    
                    
                */  
                this.counter = 0;
                this.parent = function(data){
                    return $('[data-artboard-id="'+data.id+'"]') 
                }.apply(this,[data]);
                this.width = data.width;
                this.height = data.height;
                this.list = [];
                this.current = null;
                this.edit = null;
                
            }
            
            Layer.prototype.addToDOM = function(){
                var id = 'data-layer-id="'+this.counter+'"';
                var size =  'height="'+this.height+'" width="'+this.width+'"';
                var layer = '<canvas '+size+id+'></canvas>';
                this.parent.prepend(layer);
            }
            
            Layer.prototype.index = function(){
                this.counter++;
                this.addToDOM();
                
                return this.list.length;
            }
            
            Layer.prototype.create = function(data){
                var layer = {};
                layer.index = this.index();
                layer.id = $('[data-layer-id="'+this.counter+'"]');
                layer.title = function(data){
                    return (data.title ? data.title : 'Untitled-'+this.counter)
                }.apply(this,[data]);
                layer.edit = function(data){ 
                    if(data.edit){
                        this.edit = layer.id;
                        return true;
                    }
                    else{
                        this.current = this.list[layer.index];
                        return false;
                    }
                }.apply(this,[data]);
                
                this.list.push(layer)
                   
            }
            
            function Board(data){
                /*
                    This board objet allows the creation of 
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
                this.title = 'a';
                this.width = data.width;
                this.height = data.height;
                this.layers = new Layer(data);
            }
            Board.prototype.index = function(){
                var size = ' style=" height:'+this.height+'px; width:'+this.width+'px; "'
                boardCont.append('<div class="art-board"'+size+'data-artboard-id="'+this.id+'"></div>');
                boards.push({
                    id : this.id,
                    title : this.title,
                    width : this.width,
                    height : this.height
                })
                console.log(boards)
            }

            function create(data){
                var modal = new Modal();
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
                    form.exe = function(data){
                        var board = new Board(data);
                        board.index();
                    };
                    
                    form.init();
                }
                modal.init()
            }
            
            return create
        }

       return Artboards();
        
    }());
    project();
});


/*
 Work on the modal close setting it needs to be a function 
 that you can call itself, this way you can close it even from outside its scope
    
    
*/
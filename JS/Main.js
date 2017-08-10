$(document).ready(function(e){
    var project = (function(){
        var Tools = function(){
            var Tool = {
                drag: function(init,fin){
                    $(document).on('mousemove',function(e){
                        init.exe.apply(init.context,[init.arg,e]);
                        $(document).on('mouseup',function(e){
                            fin.exe.apply(fin.context,[fin.arg,e]);
                            $(this).off('mousemove mouseup');
                        });
                    });
                },
                coordinate: {
                    plot: function(data){
                        var position = 'left:'+(x - 2)+'px; top:'+(y-2)+'px;';
                        var attr = 'data-left="'+(x - 2)+'" data-top="'+(y-2)+'"';
                        var div = '<div class="coordinate" '+attr+' style="'+position+'"></div>';

                        $(data.artboard).append(div)
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
                    $(data.artboard).on('click',function(e){
                        
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
                if(data.isFirst)
                {   
                    this.coordinate.plot(data.x,data.y);
                }
            }
            
            
        }
        
    }());
});

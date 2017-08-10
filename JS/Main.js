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
                settings: {
                    fillStyle: 'rgba(0,0,0,1)',
                    strokeStyle: 'rgba(0,0,0,1)',
                    shadowColor: 'rgba(0,0,0,1)',
                    shadowBlur: null,
                    lineCap: 'round',
                    lineJoin: 'round',
                    lineWidth: 1,
                    miterLimit: 10
                },
                /*
                    where it was used
                    what artboard id
                    what layer id
                    what index number
                    what type string
                    data collect
                    data collection
                */ 
            }
            
            function Line(type){
                this.type = type;
                this.position = { 
                    x1: null, x2: null, y1: null, y2: null
                };
                this.init = function(data){
                    $(data.artboard).on('click',function(e){
                        this.exe(e);
                    });
                }
            }
            Line.prototype.draw =  function(data){
                var canvas  = data.canvas;
                
            }
            
        
            var line = new Line('line');
            
        }
        
    }());
});

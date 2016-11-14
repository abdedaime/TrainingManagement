angular
    .module('MainApp')
    .directive('columnChart',
    function ($filter) {
        return {
            restrict: 'AE',
            scope: {
                data: '=',
                updateChart: '&chartFn'
            },
            link : function (scope,element, attrs) {
                
                attrs.height = parseInt(attrs.height);
                var render = function(data){
                    

                    d3.select("#"+attrs.id).select("svg").remove();
                   
                    var svg = d3.select("#"+attrs.id).append("svg").attr("width", attrs.width).attr("height", attrs.height + 5);
                    var shapes = svg.selectAll(".shapes").data(_.range(5)).enter();
                    var width = attrs.width/10;
                    var height = 3*attrs.height/10;
                    var varforY = (attrs.height)/5;
                   
                    var random = generateRandomString(20);
                    shapes.append("rect")
                        .attr('class',function(d,i){return random+i})
                        .attr("x", function(d, i){ return (i+1) * (width + 3) })
                        .attr("y", function(d,i){ return 1+(4-i)*varforY } )
                        .attr("width", width)
                        .attr("height", function(d,i){ return attrs.height - (4-i)*(attrs.height/5); })
                        .attr("stroke", data.color)
                        .attr("stroke-width", "0.5")
                        .style("fill",function(d,i){return data.mark >= (i+1) ? data.color : "white";})
                        .on("click",function(d,i) {
                           
                            scope.updateChart({item:  i+1});
                        })
                        .on("dblclick",function(d,i){
                            scope.updateChart({item:  d});
                        })
                        
                }
                scope.$watch("data",function(newValue,oldValue){
                    
                    render(newValue);
                })
            }
        };
    }
);
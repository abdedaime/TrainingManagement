angular
    .module('MainApp')
    .directive('radarChart',
    function($filter,$state) {
        return {
            restrict : 'AE',
            scope    : {
                data : '=',
                refreshChart: '&chartFn'
            },
            link     : function(scope,element,attrs) {

                var render = function(d,options) {
                    var cfg = {
                        radius: 3.5,
                        w: parseFloat(attrs.width),
                        h: parseFloat(attrs.height),
                        factor: 1,
                        factorLegend: .85,
                        levels: 5,
                        maxValue: 5,
                        levelTick: true,
                        radians: options.radian,
                        opacityArea: 0.5,
                        ToRight: 8,
                        TranslateX: 80,
                        TranslateY: 30,
                        ExtraWidthX: 250,
                        ExtraWidthY: 100,
                        color: options.colors
                    };


                    cfg.maxValue = Math.max(cfg.maxValue, d3.max(d, function(i){return d3.max(i.map(function(o){return o.value;}))}));
                    var allAxis = (d[0].map(function(i, j){return i.axis}));
                    var total = allAxis.length;
                    var radius = cfg.factor*Math.min(cfg.w/2, cfg.h/2);
                    var circularSegmentsAxisHolder = allAxis.slice(0, -1); // remove the last element to build the Circular segments for the left axes (MS)

                    d3.select(element[0]).select("svg").remove();

                    var g = d3.select(element[0])
                        .append("svg")
                        .attr("width", cfg.w+cfg.ExtraWidthX)
                        .attr("height", cfg.h+cfg.ExtraWidthY)
                        .append("g")
                        .attr("transform", "translate(" + cfg.TranslateX + "," + cfg.TranslateY + ")");

                    var tooltip;

                    //Circular segments
                    for(var j=0; j<cfg.levels-1; j++){
                        var levelFactor = cfg.factor*radius*((j+1)/cfg.levels);

                        g.selectAll(".levels")
                            .data(circularSegmentsAxisHolder)
                            .enter()
                            .append("svg:line")
                            .attr("x1", function(d, i){return levelFactor*(1-cfg.factor*Math.sin(i*cfg.radians/(total-1)));})
                            .attr("y1", function(d, i){return levelFactor*(1-cfg.factor*Math.cos(i*cfg.radians/(total-1)));})
                            .attr("x2", function(d, i){return levelFactor*(1-cfg.factor*Math.sin((i+1)*cfg.radians/(total-1)));})
                            .attr("y2", function(d, i){return levelFactor*(1-cfg.factor*Math.cos((i+1)*cfg.radians/(total-1)));})
                            .attr("class", "line")
                            .style("stroke", "grey")
                            .style("stroke-opacity", "0.75")
                            .style("stroke-width", "0.3px")
                            .attr("transform", "translate(" + (cfg.w/2-levelFactor) + ", " + (cfg.h/2-levelFactor) + ")");
                    }

                    //Text indicating at what value each level is
                    if (cfg.levelTick){
                        for(var j=0; j<cfg.levels; j++){
                            var levelFactor = cfg.factor*radius*((j+1)/cfg.levels);
                            g.selectAll(".levels")
                                .data([1,2]) //dummy data
                                .enter()
                                .append("svg:text")
                                .attr("x", function(d){return levelFactor*(1-cfg.factor*Math.sin(0));})
                                .attr("y", function(d){return levelFactor*(1-cfg.factor*Math.cos(0));})
                                .attr("class", "legend tick")
                                .style("font-family", "sans-serif")
                                .style("font-size", "10px")
                                .attr("transform", function(d){
                                   return "translate(" + (cfg.w/2-levelFactor + (options.radian === Math.PI ? cfg.ToRight : -cfg.ToRight*2)) + ", " + (cfg.h/2 + (d === 1 ? (levelFactor+5) : -(levelFactor-5)) ) + ")"
                                })
                                .attr("fill", "#737373")
                                .text(((j+1)*cfg.maxValue/cfg.levels).toFixed(0));
                        }
                    }


                    series = 0;

                    var axis = g.selectAll(".axis")
                        .data(allAxis)
                        .enter()
                        .append("g")
                        .attr("class", "axis");

                    axis.append("line")
                        .attr("x1", cfg.w/2)
                        .attr("y1", cfg.h/2)
                        .attr("x2", function(d, i){
                            if(i+1 === total){
                                return cfg.w/2;
                            }
                            return cfg.w/2*(1-cfg.factor*Math.sin(i*cfg.radians/(total-1)));
                        })
                        .attr("y2", function(d, i){
                            if(i+1 === total) {
                                return cfg.h;
                            }
                            return cfg.h/2*(1-cfg.factor*Math.cos(i*cfg.radians/(total-1)));
                        })
                        .attr("class", "line")
                        .style("stroke", "grey")
                        .style("stroke-width", "1px");

                    axis.append("text")
                        .attr("class", "legend")
                        .text(function(d,i){return d.split(' ',2).join(' ');})
                        .style("font-family", "sans-serif")
                        .style("font-size", "11px")
                        .attr("text-anchor", "middle")
                        .attr("dy", "1.5em")
                        .attr("transform", function(d, i){return "translate(0, -10)"})
                        .attr("x", function(d, i){
                            if(i+1 === total){
                                return cfg.w/2;
                            }
                            return cfg.w/2*(1-cfg.factorLegend*Math.sin(i*cfg.radians/(total-1)))-60*Math.sin(i*cfg.radians/(total-1));
                        })
                        .attr("y", function(d, i){
                            if(i+1 === total) {
                                return cfg.h + cfg.ToRight;
                            } else if (Math.cos(i*cfg.radians/(total-1)) > 0) {
                                return cfg.h/2*(1-Math.cos(i*cfg.radians/(total-1)))-10*Math.cos(i*cfg.radians/(total-1)) - 5;
                            } else {
                                return (cfg.h/2*(1-Math.cos(i*cfg.radians/(total-1)))-20*Math.cos(i*cfg.radians/(total-1))) - 10;
                            }


                        })


                    d.forEach(function(y, x){
                        dataValues = [];
                        g.selectAll(".nodes")
                            .data(y, function(j, i){
                                dataValues.push([
                                        total === i+1 ? cfg.w /2 : cfg.w/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/(total-1))),
                                        cfg.h/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/(total-1)))
                                ]);
                            });
                        dataValues.push(dataValues[0]);
                        g.selectAll(".area")
                            .data([dataValues])
                            .enter()
                            .append("polygon")
                            .attr("class", "radar-chart-serie"+series)
                            .style("stroke-width", function(d,i){
                                return d3.select(this).attr("class") === 'radar-chart-serie0' ? "2px" : "0px";
                            })
                            .style("stroke", function(d,i){
                                return options.radian === Math.PI ? cfg.color.first[i] : cfg.color.second[i]
                            })
                            .attr("points",function(d) {
                                var str="";
                                for(var pti=0;pti<d.length;pti++){
                                    str=str+d[pti][0]+","+d[pti][1]+" ";
                                }
                                return str;
                            })
                            .style("fill", function(j, i){
                                return options.radian === Math.PI ? cfg.color.first[i] : cfg.color.second[i]
                            })
                            .style("fill-opacity", function(d,i){
                                return d3.select(this).attr("class") === 'radar-chart-serie0' ? 0 : 0.2;
                            })
                            /*.on('mouseover', function (d){
                                z = "polygon."+d3.select(this).attr("class");
                                g.selectAll("polygon")
                                    .transition(200)
                                    .style("fill-opacity", 0.1);
                                g.selectAll(z)
                                    .transition(200)
                                    .style("fill-opacity", .7);
                            })
                            .on('mouseout', function(){
                                g.selectAll("polygon")
                                    .transition(200)
                                    .style("fill-opacity", cfg.opacityArea);
                            });*/
                        series++;
                    });
                    series=0;


                    d.forEach(function(y, x){
                        g.selectAll(".nodes")
                            .data(y).enter()
                            .append("svg:circle")
                            .attr("class", "radar-chart-serie"+series)
                            .attr('r', function(d){
                                return d3.select(this).attr("class") === 'radar-chart-serie1' ? 0 : cfg.radius;
                            })
                            .attr("alt", function(j){return Math.max(j.value, 0)})
                            .attr("cx", function(j, i){
                                dataValues.push([
                                        cfg.w/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/(total-1))),
                                        cfg.h/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/(total-1)))
                                ]);
                                if(i+1 === total){
                                    return cfg.w/2;
                                }
                                return cfg.w/2*(1-(Math.max(j.value, 0)/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/(total-1)));
                            })
                            .attr("cy", function(j, i){
                                return cfg.h/2*(1-(Math.max(j.value, 0)/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/(total-1)));
                            })
                            .attr("data-id", function(j){return j.axis})
                            .style("fill", function(d,i,j){
                                return options.radian === Math.PI ? cfg.color.first[j] : cfg.color.second[j]
                            })
                            .style("fill-opacity", .9)
                            .on('mouseover', function (d){
                                newX =  parseFloat(d3.select(this).attr('cx')) - 10;
                                newY =  parseFloat(d3.select(this).attr('cy')) - 5;

                                tooltip
                                    .attr('x', newX)
                                    .attr('y', newY)
                                    .text(d.value)
                                    .transition(200)
                                    .style('opacity', 1);

                                /*z = "polygon."+d3.select(this).attr("class");
                                g.selectAll("polygon")
                                    .transition(200)
                                    .style("fill-opacity", 0.1);
                                g.selectAll(z)
                                    .transition(200)
                                    .style("fill-opacity", .7);*/
                            })
                            .on('mouseout', function(){
                                tooltip
                                    .transition(200)
                                    .style('opacity', 0);
                                /*g.selectAll("polygon")
                                    .transition(200)
                                    .style("fill-opacity", cfg.opacityArea);*/
                            })
                            .append("svg:title")
                            .text(function(j){return Math.max(j.value, 0)});

                        series++;
                    });
                    //Tooltip
                    tooltip = g.append('text')
                        .style('opacity', 0)
                        .style('font-family', 'sans-serif')
                        .style('font-size', '13px');

                    var LegendOptions = ['Score'];
                    if( d.length === 2){
                        LegendOptions.push('Target');
                    }

                    // legend
                    var svg = d3.select(element[0])
                        .selectAll('svg')
                        .append('svg')
                        .attr("class","ignoreOnPrint")
                        .attr("width", cfg.w+300)
                        .attr("height", cfg.h)

                    var legend = svg.append("g")
                        .attr("class", "legend")
                        .attr("height", 100)
                        .attr("width", 200)
                        .attr('transform', 'translate(90,20)')

                    legend.selectAll('rect')
                        .data(LegendOptions)
                        .enter()
                        .append("rect")
                        .attr("x", options.radian === Math.PI ? cfg.w /1.3 : (-0.9*cfg.TranslateX))
                        .attr("y", function(d, i){ return (i+0.5) * 20;})
                        .attr("width", 10)
                        .attr("height", 10)
                        .style("fill", function(d, i){
                            return options.radian === Math.PI ? cfg.color.first[i] : cfg.color.second[i];
                        })


                    legend.selectAll('text')
                        .data(LegendOptions)
                        .enter()
                        .append("text")
                        .attr("x", (options.radian === Math.PI ? cfg.w /1.3 : (-0.9*cfg.TranslateX)) + 15)
                        .attr("y", function(d, i){ return (i+0.5) * 20 + 9;})
                        .attr("font-size", "11px")
                        .attr("fill", "#737373")
                        .text(function(d) { return d; })




                }
                scope.$watch('data',function() {
                    if(scope.data.data){
                        var data = [
                            _.map(scope.data.data,function(d){
                                return {axis: d.name,value: d.mark};
                            }),
                            _.map(scope.data.data,function(d){
                                return {axis: d.name,value: d.target};
                            })
                        ];
                        render(data,scope.data.options);
                    }
                },true)
            }
        };
    }
);
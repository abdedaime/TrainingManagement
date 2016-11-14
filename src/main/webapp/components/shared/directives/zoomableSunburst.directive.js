
angular
    .module('MainApp')
    .directive('zoomableSunburst',
    function($timeout) {
    
        return {
            restrict : 'AE',
            scope : {
              dataForZommable : '=datazommable',
              piedata : '=datapie',
              refresh : '&refresh'
            },
            link     : function(scope,element,attrs) {
             var render = function(data){

                        var width = parseInt(attrs.width),
                        height = width,
                        radius = width / 2,
                        x = d3.scale.linear().range([0, 2 * Math.PI]),
                        y = d3.scale.pow().exponent(1.3).domain([0, 1]).range([0, radius]),
                        padding = 5,
                        duration = 1000;
                        var color = d3.scale.category20c();
                    // Remove loading image
                    var div = d3.select("zoomable-sunburst#"+attrs.id);
                      d3.select("zoomable-sunburst#"+attrs.id+" > svg").remove();
                      d3.select("zoomable-sunburst#"+attrs.id+" > img").remove();

                    // setup html markup for sunburst                                  
                    var vis = div.append("svg")
                        .attr("width", width + padding * 2)
                        .attr("height", height + padding * 2)
                        .append("g")
                        .attr("transform", "translate(" + [radius + padding, radius + padding] + ")");

                    // setup the partitions variable
                   var partition = d3.layout.partition()
                                   .value(function(d) { return d.size; });
                    // setup the arch variable
                    var arc = d3.svg.arc()
                        .startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x))); })
                        .endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx))); })
                        .innerRadius(function(d) { return Math.max(0, d.y ? y(d.y) : d.y); })
                        .outerRadius(function(d) { return Math.max(0, y(d.y + d.dy)); });

                      // load the data
                //d3.json("http://codepen.io/KenFalcon/pen/XJJYqy.js", function(error, json) {

                      var nodes = partition.nodes(data);
                      // nodes, highest first, but excluding the root.
                      function getAncestors(node) {
                        var path = [];
                        var current = node;
                        while (current.parent) {
                          path.unshift(current);
                          current = current.parent;
                        }
                        return path;
                      }
                        
                       vis.selectAll("path")
                          .filter(function(node) {
                             return (sequenceArray.indexOf(node) >= 0);
                                  });
                         // .style("opacity", 1);
                        
                      
                    //});

                    function isParentOf(p, c) {
                      if (p === c) return true;
                      if (p.children) {
                        return p.children.some(function(d) {
                          return isParentOf(d, c);
                        });
                      }
                      return false;
                    }

                    function colour(d) {
                      if (d.children) {
                        // There is a maximum of two children!
                        var colours = d.children.map(colour),
                            a = d3.hsl(colours[0]),
                            b = d3.hsl(colours[1]);
                        // L*a*b* might be better here...
                        return d3.hsl((a.h + b.h) / 2, a.s * 1.2, a.l / 1.2);
                      }
                      return d.colour || "#fff";
                    }

                    // Interpolate the scales!
                    function arcTween(d) {

                      var my = maxY(d),
                          xd = d3.interpolate(x.domain(), [d.x, d.x + d.dx]),
                          yd = d3.interpolate(y.domain(), [d.y, my]),
                          yr = d3.interpolate(y.range(), [d.y ? 20 : 0, radius]);
                          
                      return function(d) {
                        return function(t) { x.domain(xd(t)); y.domain(yd(t)).range(yr(t)); return arc(d); };
                      };
                      
                    }

                    function maxY(d) {
                      return d.children ? Math.max.apply(Math, d.children.map(maxY)) : d.y + d.dy;
                    }

                    
                    //
                    // Start My Custom Code Below
                    //
                    // Breadcrumb dimensions: width, height, spacing, width of tip/tail.
                    var b = {
                        w: 75, h: 30, s: 3, t: 10
                    };

                    // Given a node in a partition layout, return an array of all of its ancestor
                    // nodes, highest first, but excluding the root.
                    function getAncestors(node) {
                      var path = [];
                      var current = node;
                      while (current.parent) {
                        path.unshift(current);
                        current = current.parent;
                      }
                      return path;
                    }

                    function initializeBreadcrumbTrail() {
                      // Add the svg area.
                      var trail = d3.select("#sequence").append("svg:svg")
                          .attr("width", width)
                          .attr("height", 50)
                          .attr("id", "trail");
                      // Add the label at the end, for the percentage.
                      trail.append("svg:text")
                        .attr("id", "endlabel")
                        .style("fill", "#000");
                    }

                    // Generate a string that describes the points of a breadcrumb polygon.
                    function breadcrumbPoints(d, i) {
                      var points = [];
                      points.push("0,0");
                      points.push(b.w + ",0");
                      points.push(b.w + b.t + "," + (b.h / 2));
                      points.push(b.w + "," + b.h);
                      points.push("0," + b.h);
                      if (i > 0) { // Leftmost breadcrumb; don't include 6th vertex.
                        points.push(b.t + "," + (b.h / 2));
                      }
                      return points.join(" ");
                    }

                      function click(d) {
                        if(d._id)
                            scope.refresh({'data':d._id,depth:d.depth});
                        path.transition()
                          .duration(duration)
                          .attrTween("d", arcTween(d));

                        // Somewhat of a hack as we rely on arcTween updating the scales.
                        text.style("visibility", function(e) {
                              return isParentOf(d, e) ? null : d3.select(this).style("visibility");
                            })
                          .transition()
                            .duration(duration)
                            .attrTween("text-anchor", function(d) {
                              return function() {
                                return x(d.x + d.dx / 2) > Math.PI ? "end" : "start";
                              };
                            })
                            .attrTween("transform", function(d) {
                              var multiline = (d.name || "").split(" ").length > 1;
                              return function() {
                                var angle = x(d.x + d.dx / 2) * 180 / Math.PI - 90,
                                    rotate = angle + (multiline ? -.5 : 0);
                                return "rotate(" + rotate + ")translate(" + (y(d.y) + padding) + ")rotate(" + (angle > 90 ? -180 : 0) + ")";
                              };
                            })
                           // .style("fill-opacity", function(e) { return isParentOf(d, e) ? 1 : 1e-6; })
                            .each("end", function(e) {
                              d3.select(this).style("visibility", isParentOf(d, e) ? null : "hidden");
                            });
                      }
                                  
                      var path = vis.selectAll("path")
                          .data(nodes)
                        .enter().append("path")
                          .attr("id", function(d, i) { return "path-" + i; })
                          .attr("d", arc)
                          .attr("fill-rule", "evenodd")
                          .style("fill",function(d) { return color((d.children ? d : d.parent).name); })
                          .on("click", click);
                       
                        
                        
                      // Select all the visible labels
                      var text = vis.selectAll("text").data(nodes);
                      var textEnter = text.enter().append("text")
                          //.style("fill-opacity", 1)
                          .style("fill", function() {
                            return 'black';
                            //return brightness(d3.rgb(colour(d))) < 125 ? "#eee" : "#000";
                            //return color((d.children ? d : d.parent).name);
                          })
                          .attr("text-anchor", function(d) {
                            return x(d.x + d.dx / 2) > Math.PI ? "end" : "start";
                          })
                          .attr("dy", ".2em")
                      
                         // rotate the lable text dependign where it is
                          .attr("transform", function(d) {
                            
                            var multiline = ((d.name+d.size) || "").split(" ").length > 1,
                                angle = x(d.x + d.dx / 2) * 180 / Math.PI - 90,
                                rotate = angle + (multiline ? -.5 : 0);
                            return "rotate(" + rotate + ")translate(" + (y(d.y) + padding) + ")rotate(" + (angle > 90 ? -180 : 0) + ")";
                          })
                      
                         // Add the mouse clic handler to the bounding circle.
                          .on("click", click)
                        
                       
                          
                      textEnter.append("tspan")
                          .attr("x", 0)
                          .text(function(d) { 
                            
                            return d.depth ?  d.name.split(" ")[0] : "";
                             });
                      textEnter.append("tspan")
                          .attr("x", 0)
                          .attr("dy", "1em")
                          .text(function(d) { return d.depth ? d.name.split(" ")[1] || "" : ""; });

                           textEnter.append("tspan")
                          .attr("x", 0)
                          .attr("dy", "1em")
                          .text(function(d) { return d.depth ? "("+d.size+"%)" || "" : ""; });
                          
                        
                      
                      
                        // Then highlight only those that are an ancestor of the current segment.
                       var sequenceArray = getAncestors(d3);
                        
                          // Given a node in a partition layout, return an array of all of its ancestor
                      

                    // Update the breadcrumb trail to show the current sequence and percentage.
                    function updateBreadcrumbs(nodeArray, percentageString) {

                      // Data join; key function combines name and depth (= position in sequence).
                      var g = d3.select("#trail")
                          .selectAll("g")
                          .data(nodeArray, function(d) { return d.name + d.depth; });

                      // Add breadcrumb and label for entering nodes.
                      var entering = g.enter().append("svg:g");

                      entering.append("svg:polygon")
                          .attr("points", breadcrumbPoints)
                          .style("fill", function(d) { return colors(d.name); });

                      entering.append("svg:text")
                          .attr("x", (b.w + b.t) / 2)
                          .attr("y", b.h / 2)
                          .attr("dy", "0.35em")
                          .attr("text-anchor", "middle")
                          .text(function(d) { return d.name; });

                      // Set position for entering and updating nodes.
                      g.attr("transform", function(d, i) {
                        return "translate(" + i * (b.w + b.s) + ", 0)";
                      });

                      // Remove exiting nodes.
                      g.exit().remove();

                      // Now move and update the percentage at the end.
                      d3.select("#trail").select("#endlabel")
                          .attr("x", (nodeArray.length + 0.5) * (b.w + b.s))
                          .attr("y", b.h / 2)
                          .attr("dy", "0.35em")
                          .attr("text-anchor", "middle")
                          .text(percentageString);

                      // Make the breadcrumb trail visible, if it's hidden.
                      d3.select("#trail")
                          .style("visibility", "");

                    }
              }
              scope.$watch('dataForZommable',function(newVal,oldVal){
                 
                  if(newVal)
                    if(newVal.name)
                       render(angular.copy(newVal));
              },true);
                   
            }
        };
    }
);
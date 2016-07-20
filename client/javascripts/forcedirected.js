(function(){
	
	angular
		.module('coolrelation')
		.directive('forceDirectedChart', function($window){
			return {
				restrict:'A',
				scope: {
					chartData: '<',
					chartOption:'<',
					removeNode:'&',
				},
				template:"<svg id='mySvg' width='980' height='520'></svg>",
				link:function(scope, elem, attrs){
					// inject d3
					var d3 = $window.d3;
					var force = d3.layout.force()

					// WATCH "chartData":
					scope.$watchGroup(['chartData'],function(newValue, oldValue, scope){
						if(newValue!==oldValue){
							scope.removeNode()();
							var chartData = scope.chartData;
							var chartOption = scope.chartOption;

							runD3(chartData,chartOption,force)
						}
					})

					// WATCH "chartOption":
					scope.$watchCollection('chartOption.option[0]',function(newValue, oldValue){
						if(newValue!==oldValue){
							scope.removeNode()();
							//debugger
							var chartData = scope.chartData;
							var chartOption = scope.chartOption;
							runD3(chartData,chartOption,force)
						}
					})

					
					function runD3(chartData,chartOption, force){
						force.stop();
						var user_option = chartOption.option[0];

						// Constants for the SVG
						var width = 900,
						    height = 500,
						    margin = 25,
						    padding = 1;
						 

						// ========== USER OPTIONS OR DEFAULT CHART OPTIONS ============
						var radius = +user_option.radius || 5,
								link_width = user_option.link_width || 1,
								cutoff = Number(user_option.cutoff) || .5,
								node_size = user_option.node_size || 4,
								link_strength = Number(user_option.link_strength) || 1,
						 		schema_size = Number(user_option.schema_size) || 1,
						 		edge_bundle = Number(user_option.edge_bundle) || 0.7;



						var min_dist = 200*schema_size;   // ## user option : schema_size

						if(user_option.cutoff==="0"){ cutoff = 0};
						if(user_option.edge_bundle==="0"){ edge_bundle = 0};

						var color = d3.scale.category20();
						if(user_option.color==="category20b"){color = d3.scale.category20b()};
						if(user_option.color==="category20c"){color = d3.scale.category20c()};




						// FIRST D3 GRAPH
						// =========================================================
						if(chartOption.option[0]["chart_type"] === "structure_graph")	{


							force.charge(-2000) 
								    .linkDistance(30) 
								    .gravity(.3)
								    .size([width, height]);

							//Append a SVG to the body of the html page. Assign this SVG as an object to svg
							var rawSvg = elem.find('svg');
							var svg = d3.select(rawSvg[0])
													.attr("width", width)
													.attr("height", height)

							var graph = chartData;

							//Creates the graph data structure out of the json data
							force.nodes(graph.nodes)
									 .links(graph.links)
									 .start();

						 	//Force Strength
						 	force.linkStrength(function(link) {
						 		return link.value/15*link_strength   // ## user option : Strength
						 	});

						 	//Create all the line svgs but without locations yet
						 	var link = svg.selectAll(".link")
						 	    .data(graph.links)
						 	    .enter().append("line")
						 	    .attr("class", "link")
						 	    .style("stroke-width", function (d) {  
							 	    		return Math.max(0.1 ,(d.value-cutoff)*10)*link_width;  // ## user option: cutoff
						 	    });


						 	//Do the same with the circles for the nodes - no 
						 	var node = svg.selectAll(".node")
						 	    .data(graph.nodes)
						 	    .enter().append("g")
						 	    .attr("class", "node")
						 	    .call(force.drag);

						 	node.append("circle")
						 	    .attr("r", node_size)  // ## user option : node size
						 	    .style("fill", function (d){
						 	    	return color(d.group);
						 	    });

						 	node.append("text")
						 			.attr("dx", 10)
						 			.attr("dy", ".35em")
						 			.text(function(d) { return d.name })
						 			// .attr('transform', function(e){
						 			// 		return "rotate(25)";
						 			// 	})


						 	// Now we are giving the SVGs co-ordinates - the force layout is 
						 	// generating the co-ordinates which this code is using to update 
						 	// the attributes of the SVG elements
						 	force.on("tick", function () {
						 		node.attr("cx", function(d) { return d.x = Math.max(10, Math.min(width -10, d.x)); })
						 				.attr("cy", function(d) { return d.y = Math.max(10, Math.min(height -10, d.y)); });
						 		link.attr("x1", function (d) {return d.source.x;})
						 				.attr("y1", function (d) {return d.source.y;})
						 				.attr("x2", function (d) {return d.target.x;})
						 				.attr("y2", function (d) {return d.target.y;});
								
								d3.selectAll("circle").attr("cx", function (d) {return d.x;})
									.attr("cy", function (d) {return d.y;});

								d3.selectAll("text").attr("x", function (d) {return d.x;})
									.attr("y", function (d) {return d.y;});

							});

						 	force.start();
						}	// 	structure_graph


						// SECOND D3 GRAPH
						// =========================================================
						if(chartOption.option[0]["chart_type"] === "force_directed"){
			
							force .charge(-5000)
										.linkDistance(2*radius + padding)
										.gravity(0.8)
										.size([width, height]);
							
							//Append a SVG to the body of the html page. Assign this SVG as an object to svg
							var rawSvg = elem.find('svg');
							var svg = d3.select(rawSvg[0])
													.attr("width", width)
													.attr("height", height)


							graph = chartData;

							//Force Strength
							force.linkStrength(function(link) {
								return link.value/15*link_strength;   // ## user option : Strength
							});

							//Create all the line svgs but without locations yet
							display_links = [];
							itm_nodes = [];
							n=0;

							//Pick only the links with positive value
							graph.links.forEach(function (link,index){

								if (link.value>0.5) {
									link.index = n;
									n++;
									display_links.push(link);
									itm_nodes.push({
										x:0.5*(link.target.x + link.source.x),
										y:0.5*(link.target.y + link.source.y),
										index:index 
									});
								}
							});

							
							var link = svg.selectAll(".link")
														.data(display_links)
														.enter().append("path")
														.attr("class", "link")
														.style("stroke-width", function (d) {
															return Math.max(0.0, (d.value-cutoff)*10)*link_width;
														});

							//Creates the graph data structure out of the json data
							force.nodes(graph.nodes)
								 .links(graph.links)
								 .start();
						
							//Do the same with the circles for the nodes - no 
							var node = svg.selectAll(".node")
														.data(graph.nodes)
														.enter().append("g")
														.attr("class", "node")
														.call(force.drag);

							node.append("circle")
							    .attr("r", node_size)
							    .style("fill", function (d) {
							    	return color(d.group);
							    })

							node.append("text")
						      .attr("dx", 10)
						      .attr("dy", ".35em")
						      .text(function(d) { return d.name })

						  

						  // Now we are giving the SVGs co-ordinates - the force 
						  // layout is generating the co-ordinates which this code 
						  // is using to update the attributes of the SVG elements
						  force.on('end', function() { 
						  });

						  force.on("tick", function () {

						  	link_force(1-edge_bundle,1);

					      d3.selectAll("circle")
					          .each(circular(0.8))
					          // .each(split(0.5,width/2,height/2))
					          .attr("cx", function (d) {return d.x;})
					          .attr("cy", function (d) {return d.y;});

					       // what does this line do??????
						    link.attr("d",function(d){ 
						    	return "M "+d.source.x + " "+d.source.y + " Q " + itm_nodes[d.index].x + " " + itm_nodes[d.index].y +" "+  d.target.x + " "  + d.target.y;});

					      // d3.selectAll("text")
					      //   .attr("x", function (d) {return d.x;})
					      //   .attr("y", function (d) {return d.y;});

					      d3.selectAll("text")
					      	.attr("x", function (d) {return width/2 + (d.x-width/2)*(12+Math.sqrt((d.x-width/2)*(d.x-width/2) + (d.y-height/2)*(d.y-height/2)))/Math.sqrt((d.x-width/2)*(d.x-width/2) + (d.y-height/2)*(d.y-height/2)) ;})
					      	.attr("y", function (d) {return height/2 + (d.y-height/2)*(12+Math.sqrt((d.x-width/2)*(d.x-width/2) + (d.y-height/2)*(d.y-height/2)))/Math.sqrt((d.x-width/2)*(d.x-width/2) + (d.y-height/2)*(d.y-height/2)) ;})
						      .attr("dx", function(d) { return 0; })
						      .attr("dy", ".35em")
						      .attr("text-anchor", function(d) { return d.x < width/2 ? "end" : "start"; });
						      // .attr("transform", function(d) { "rotate(180," +d.x+","+d.y+ ")"; });
						  });

						  // Alpha1 is the force to source and target nodes. 
						  // Alpha2 is the force to other links.
						  function link_force(alpha1,alpha2){

						  	itm_nodes.forEach(function(item,index){

						  		itm_nodes.forEach(function(item2,index2){
						        if(index != index2){
						          var l = Math.sqrt(Math.pow(item2.x - item.x,2) + Math.pow(item2.y - item.y,2) );
						          item.x += alpha2/l*(item2.x - item.x);
						          item.y += alpha2/l*(item2.y - item.y);  
						        }
						      });

						      item.x += Math.min(Math.max(alpha1,0.01),0.99)*(display_links[index].source.x - item.x);
						      item.y += Math.min(Math.max(alpha1,0.01),0.99)*(display_links[index].source.y - item.y);
						      item.x += Math.min(Math.max(alpha1,0.01),0.99)*(display_links[index].target.x - item.x);
						      item.y += Math.min(Math.max(alpha1,0.01),0.99)*(display_links[index].target.y - item.y);
						    });
						  } // link_force

						  function collide(alpha){
						    var quadtree = d3.geom.quadtree(graph.nodes);
						    return function(d){
						    	var rb = 2*radius + padding,
						    			nx1 = d.x - rb,
						          nx2 = d.x + rb,
						          ny1 = d.y - rb,
						          ny2 = d.y + rb;

						      quadtree.visit(function(quad, x1, y1, x2, y2){
						      	if (quad.point && (quad.point !== d)){
						      		var x = d.x - quad.point.x,
						              y = d.y - quad.point.y,
						              l = Math.sqrt(x * x + y * y);

						          if(l<rb){
						          	l = (l - rb) / l * alpha;
						            d.x -= x *= l;
						            d.y -= y *= l;
						          }
						        }

						        return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
						      });
						    };
						  } // collide

						  function split(alpha,cx,cy) {
						  	var quadtree = d3.geom.quadtree(graph.nodes);
						  	return function(d){
						  		var rb = 2*radius + padding,
						          nx1 = d.x - rb,
						          nx2 = d.x + rb,
						          ny1 = d.y - rb,
						          ny2 = d.y + rb;

						      quadtree.visit(function(quad, x1, y1, x2, y2) {
						      	if (quad.point && (quad.point !== d)) {
						      		var x = d.x - quad.point.x,
						              y = d.y - quad.point.y,
						              l = Math.sqrt(x * x + y * y),
						              mx = (d.x + quad.point.x)/2 -cx,
						              my = (d.y + quad.point.y)/2 -cy,
						              ml = Math.sqrt(mx * mx + my * my) ,
						              rx =0,
						              ry =0;

						          if (l < rb) {
						          	rx = cx + mx * (mx*(d.x -cx) + my*(d.y -cy))/ml/ml;
						            ry = cy + my * (mx*(d.x -cx) + my*(d.y -cy))/ml/ml;
						            d.x = rx + (d.x-rx) * rb/2 / Math.sqrt( (d.x-rx) * (d.x-rx) + (d.y-ry) * (d.y-ry));
						            d.y = ry + (d.y-ry) * rb/2 / Math.sqrt( (d.x-rx) * (d.x-rx) + (d.y-ry) * (d.y-ry));
						            rx = cx + mx * (mx*(quad.point.x -cx) + my*(quad.point.y -cy))/ml/ml;
						            ry = cy + my * (mx*(quad.point.x -cx) + my*(quad.point.y -cy))/ml/ml;

						            quad.point.x = rx + (quad.point.x-rx) * rb/2 / Math.sqrt( (quad.point.x-rx) * (quad.point.x-rx) + (quad.point.y-ry) * (quad.point.y-ry));
						            quad.point.y = ry + (quad.point.y-ry) * rb/2 / Math.sqrt( (quad.point.x-rx) * (quad.point.x-rx) + (quad.point.y-ry) * (quad.point.y-ry));
						          }
						        }
						        return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
						      });
						    };
						  } // split

						  function circular(alpha) {
						  	return function(d){
						  		var origin={x: width/2,y: height/2};
						      var x = d.x - origin.x,
						          y = d.y - origin.y,
						          l = Math.sqrt(x * x + y * y);

						      if (l < min_dist - 0.005 | l > min_dist + 0.005 ){
						          l = (l - min_dist) / l ;
						          l = 1 * (1-alpha*Math.exp(-1*Math.abs(l))) + alpha*Math.exp(-1*Math.abs(l))* (1-l); 
						          d.x = origin.x + (d.x-origin.x)*l;
						          d.y = origin.y + (d.y-origin.y)*l;
						      }
						    };
						  } // circular

						  force.start();
						} // chart_type == force_directed
					} // runD3 function
				} // link function

			} // return
		}) // directive


})()
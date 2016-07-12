(function(){
	angular
		.module('coolrelation')
		.controller("forceDirectedController", forceDirectedController)

		.directive('forceDirectedChart', function($window){
			return {
				restrict:'A',
				template:"<svg width='980' height='520'></svg>",
				link:function(scope, elem, attrs){
					var chartData = scope[attrs.chartData];

					// inject d3
					var d3 = $window.d3;

					// Constants for the SVG
					var width = 1000,
					    height = 1000;

					var padding = 2, // separation between circles
					    radius=10;

					var min_dist = 250;

					var color = d3.scale.category20();

					var force = d3.layout.force()
					    .charge(-5000)
					    .linkDistance(2*radius + padding)
					    .gravity(0.8)
					    .size([width, height]);

					//Append a SVG to the body of the html page. Assign this SVG as an object to svg
					var rawSvg = elem.find('svg');
					var svg = d3.select(rawSvg[0])
											.attr("width", width)
											.attr("height", height)

					// PROBABLY DON'T NEED THIS:
					// function setChartParameters(){

					//     xScale = d3.scale.linear()
					//         .domain([salesDataToPlot[0].hour, salesDataToPlot[salesDataToPlot.length-1].hour])
					//         .range([padding + 5, rawSvg.attr("width") - padding]);

					//     yScale = d3.scale.linear()
					//         .domain([0, d3.max(salesDataToPlot, function (d) {
					//             return d.sales;
					//         })])
					//         .range([rawSvg.attr("height") - padding, 0]);

					//     xAxisGen = d3.svg.axis()
					//         .scale(xScale)
					//         .orient("bottom")
					//         .ticks(salesDataToPlot.length - 1);

					//     yAxisGen = d3.svg.axis()
					//         .scale(yScale)
					//         .orient("left")
					//         .ticks(5);

					//     lineFun = d3.svg.line()
					//         .x(function (d) {
					//             return xScale(d.hour);
					//         })
					//         .y(function (d) {
					//             return yScale(d.sales);
					//         })
					//         .interpolate("basis");
					// }

					function drawChart(){};

					drawChart();
				} // link
			} // return
		}) // directive

	function forceDirectedController(){
		var vm = this;
		vm.data = {};
		vm.options = {};
	}


// === HTML(view) ===
// 
// <div ng-controller="forceDirectedController as vm">
//   <div chart-data="vm.data"></div>
// </div>


})()
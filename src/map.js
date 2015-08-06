var drawer = require('./drawer');
var map = function(){
	
    var width, height;
    var active = d3.select(null);
	var circleScaleValue = 2;

	//=================
	// Load in map svg
	//=================
	d3.xml("dot.svg", "image/svg+xml", function(xml) {

		var svg = d3.select("body")
		    .append("svg")
		    .attr("width", width)
		    .attr("height", height)

		resize();//Initial resize

		d3.select(window).on("resize", resize);

		//Update Width and Height
		function resize(){
				width = window.innerWidth, height = window.innerHeight;
				svg.attr("width", width).attr("height", height);
			}

		//Find SVG Center Values taken from the position of the logo in the SVG File
		var mapCenterX = (553 - (width / 2)) + 553;
		var mapCenterY = (449 - (height / 2)) + 449 * 1.1;
		var mapCenter = [mapCenterX * -1, mapCenterY * -1];

		//d3 zoom behavior
	    var zoomBehavior = d3.behavior.zoom()
					    .scaleExtent([2, 6])
					    .on("zoom", zoom);

		svg.call(zoomBehavior);

		//load SVG as DOM node
		var importedNode = document.importNode(xml.documentElement, true);

		var g = svg.append("g")
				   .each(function(){this.appendChild(importedNode.cloneNode(true))});
				 
		//Initial zoom		   
		svg.transition()
      		.duration(750)
      		.call(zoomBehavior.translate(mapCenter).scale(2).event);

      	//Handles scaling and panning SVG
	  	function zoom() {
			 var trans = d3.event.translate,
		         scale = Math.min(6, Math.max(d3.event.scale, 2));

		    var svgWidth = parseInt(d3.select(importedNode).attr("width"));
	  		var svgHeight = parseInt(d3.select(importedNode).attr('height'));
	  		var xBound = (svgWidth - (width / scale)) * scale;
	  		var yBound = (svgHeight - (height / scale)) * scale;

		     var tx = Math.min(0, Math.max(xBound * -1, trans[0]));
		     var ty = Math.min(0, Math.max(yBound * -1, trans[1]));
			  g.attr("transform", "translate(" + tx + ", " + ty + ")scale(" + d3.event.scale + ")");
			  zoomBehavior.translate([tx, ty]);
		};


		//setup all station buttons
	  	d3.selectAll(".station-btn")
		   	.style("filter", "url(#drop-shadow)")// style added in SVG
			.on("mouseover", function(){
			  	d3.select(this)
				  	.transition()
				    .ease("elastic")
				    .duration(500)
				    .attr("transform", function(){ 
				      	var cx = d3.select(this).select("circle").attr("cx");
				      	var cy = d3.select(this).select("circle").attr("cy");
				      	var sv = circleScaleValue;
				        return "matrix(" + sv + ", 0, 0, " + sv + ", " + (cx - sv * cx) + "," + (cy-sv*cy) + ")";
	    			});
			})
			.on("mouseout", function(){
				d3.select(this)
					.transition()
				    .ease("elastic")
				    .duration(500)
				    .attr("transform", function(d, i){ 
				        return "scale(1)";
	    			});
	    	})
			.on("click", clicked);

		//Setup drawer obfuscator callback
		drawer.obfuscatorClicked = function(){
			drawer.close();
			drawer.depopulate();
			reset();
		};

		//Handle station clicked
		function clicked(d) {

			var infoPanel = document.querySelector(".mdl-mini-footer.footer-visible");
			if(infoPanel !== null)
				infoPanel.className = "mdl-mini-footer"

			var circle = d3.select(this).select("circle");//get the SVG circle for cx and cy values
	      	if(active.node() == this) return reset();
			
			active.classed("active", false);
			active = d3.select(this).classed("active", true);

			//get lat lon and station name values setup in SVG file
			var lat = active.attr('lat');
			var lon = active.attr('lon');
			var name = active.attr('station_name');
			//populate draw
			drawer.populate(lat, lon, drawer.filterType, drawer.filterDistance, name);

			var x = parseInt(circle.attr("cx")),
      			y = parseInt(circle.attr("cy")),
      			drawerOffset = 125,
      			scale = 6,
      			translate = [(width / 2 - scale * x) + drawerOffset, height / 2 - scale * y];

      		svg.transition()
      			.duration(750)
      			.call(zoomBehavior.translate(translate).scale(scale).event)
      			.each("end", function(){drawer.open()});
		}

		function reset() {
		  active.classed("active", false);

		  active = d3.select(null);

		  svg.transition()
		      .duration(750)
		      .call(zoomBehavior.translate(mapCenter).scale(2).event);
		}

	});
};

module.exports = map;
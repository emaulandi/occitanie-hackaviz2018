// DEFINE DRAWING AREA SIZING
var heightA = 300;
var widthA = 550;
var marginA = {top: 50, right: 420, bottom: 30, left: 80};

//GET POPULATION SUM FOR EACH DATE
var populationSum = [3872177,4240028,4836045,5730753];
var standard_duration = 6000;
var formatvirgule = d3.format(",d");	
	
// CREATE DRAWING PART MOVED 30,30 FROM SVG
var selection = d3.select("#A-time-population")
	.attr("width", widthA + marginA.right + marginA.left)
	.attr("height", heightA + marginA.top + marginA.bottom)
		.append("g")
		.attr("transform", "translate(" + marginA.left + "," + marginA.top + ")");
	
var title = d3.select("#A-time-population")
	.attr("width", widthA + marginA.right + marginA.left)
	.attr("height", heightA + marginA.top + marginA.bottom)
		.append("g")
		.attr("transform", "translate(" + 15 + "," + 15 + ")")
		.append("text")
		.attr("class","description")
		.html("<tspan>Une forte augmentation de population de 1968 à 2014</tspan>");
		
var x = d3.scaleLinear()
    .range([0, widthA])
    .domain([1968,2014]);

var y = d3.scaleLinear()
    .range([heightA, 0])
    .domain([0,6000000]);

var xAxis = d3.axisBottom(x);
var yAxis = d3.axisLeft(y);

var area = d3.area()
	.curve(d3.curveNatural)
    .x(function(d) { 
      return x(d.data.annee); })
    .y0(function(d) { return y(d[0]); })
    .y1(function(d) { return y(d[1]); });

var stack = d3.stack();
stack.keys(["village","bourg et petite ville","moyenne et grande ville","metropole"]);

// PREPARE ANOTATION
const annotations = [{
	  note: { 
	  	label: "L'évolution de la population la plus forte en nombre d'habitants concerne les bourgs et petites villes",
	  	wrap: 200
	  }, 
	  x: 500, y:180, dy: 80, dx: 180, subject: { radius: 200, radiusPadding: 0 }
	}];
d3.annotation().annotations(annotations);

const makeAnnotations = d3.annotation()
	  .type(d3.annotationLabel)
	  .annotations(annotations);

// PLAY BUTTON
var state = 0;
var moveRectangle = [widthA - widthA/3+15,widthA - 2*widthA/3-5, 0];
var playbutton = d3.select("#playButton");
var labelButton = ["Afficher l'évolution jusqu'à 1999","Afficher l'évolution jusqu'à 2014"];
playbutton.attr("transform", "translate(" + 0 + "," + 15 + ")");
playbutton.append("input")
	.attr("type", "button")
	.attr("value", "Afficher")
	.on("click", function(d) {
		if (state <3) {
			updaptetime(state);
			state++;
			if (state > 0 ) {
				playbutton.select("text").text(labelButton[state-1]);
			}
		}
		
		if (state == 3 ) {
			playbutton.select("input").remove();
			playbutton.select("g").remove();
			/*
			d3.select("#A-time-population")
			.transition()
			.duration(standard_duration)
			.ease(d3.easeLinear)
			.attr('heigth', 0)
			.remove();
			*/
		}
	})	
	
function updaptetime(state) {
	var textSelect = d3.selectAll("#total_population");
	textSelect.transition()
		.duration(standard_duration)
		.on("start", function repeat() {
			d3.active(this)
				.tween("text", function(d) {
					var that = d3.select(this),
						  i = d3.interpolateNumber(populationSum[state], populationSum[state+1]);
					return function(t) { that.text(formatvirgule(i(t))); };
				})
	})

	// MOVE RECTANGLE //
	selection.select('rect')
		.transition()
		.duration(standard_duration)
		.ease(d3.easeLinear)
		.attr('width', moveRectangle[state])
		.on("end", function () {
			if (state == 2) {
				selection.append("g")
					  .attr("class", "annotation-group")
					  .call(makeAnnotations);
			}
		});
}


//d3.csv("../jsdata/datawomenclean.csv", function(inputdata) {
d3.csv("data/population_stacked_categories.csv", function(data) {

	data.forEach(function(d) {
		d.population = +d.population;
		d.annee = +d.annee;
	});
	
	var yAxisSelector = selection.append("g")
	.attr("class","ax")
	.call(yAxis
		.ticks(5)
		.tickFormat(d3.format(",d"))
	);
		
	var xAxisSelector = selection.append("g")
	.attr("transform", "translate(" + 0 + "," + heightA + ")")
	.attr("class","ax")
	.call(xAxis
		.tickValues([1968,1982,1999,2014])
		.tickFormat(d3.format("d"))
	);

	// DRAW ALL STACKED AREA //
	var layer = selection.selectAll(".layer")
		.data(stack(data))
		.enter()
		.append("g")
		.attr("class", "layer");

	layer.append("path")
		.attr("class", "area")
		.style("fill", function(d) { return colorCat(d.key); })
		.attr("d", area);


	var curtain = selection.append('rect')
		.attr('x', -1 * widthA - 1)
		.attr('y', -1 * heightA)
		.attr('height', heightA)
		.attr('width', widthA)
		.attr('class', 'curtain')
		.attr('transform', 'rotate(180)')
		.style('fill', '#ffffff')
		//.style('stroke', 'black')

	selection.append("text")
		.attr("transform", "translate(" + 10 + "," + 10 + ")")
		.attr("class","legend")
		.attr("id","total_population1")
		.text("Nombre total d'habitants : ");
		
	selection.append("text")
		.attr("transform", "translate(" + 10 + "," + 25 + ")")
		.attr("class","legend")
		.attr("id","total_population")
		.text(formatvirgule(populationSum[0]));
			
	// LEGEND //
	var shapePadding = 5;
	var shapeHeight = 20;
	var titleWidth = 150;
	var colorLegend = d3.legendColor()
		.labelFormat(d3.format(".2f"))
		.title("Catégorie de commune selon le nombre d'habitants")
  		.titleWidth(titleWidth)
        .scale(colorCat)
        .shapePadding(shapePadding)
        .shapeWidth(20)
        .shapeHeight(shapeHeight)
        .labelOffset(10);

    selection.append("g")
        .attr("transform", "translate(" + (35+widthA) +"," + 50 + ")")
        .attr("class", "legend")
        .call(colorLegend);	
        
   selection.append('text')
    	.attr("class", "smallDescription")
        .attr("x",widthA + titleWidth + 60)
        .attr("y",112)
        .text("> 200 000 habitants")
        .style('text-anchor','start');

	selection.append('text')
    	.attr("class", "smallDescription")
        .attr("x",widthA + titleWidth + 60)
        .attr("y",112 + 1*shapeHeight +1*shapePadding)
        .text("> 20 000 et < 200 000 habitants")
        .style('text-anchor','start');
        
   selection.append('text')
    	.attr("class", "smallDescription")
        .attr("x",widthA + titleWidth + 60)
        .attr("y",112 + 2*shapeHeight +2*shapePadding)
        .text("> 2 000 et < 20 000 habitants")
        .style('text-anchor','start');
        
   selection.append('text')
    	.attr("class", "smallDescription")
        .attr("x",widthA + titleWidth + 60)
        .attr("y",112 + 3*shapeHeight +3*shapePadding)
        .text("< 2 000 habitants")
        .style('text-anchor','start');


});


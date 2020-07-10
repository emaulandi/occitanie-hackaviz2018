// -- USEFULL CATEGORIES -- //
var revenuCategories = ["0-5k","5-10k","10-15k","15-20k","20-25k","25-30k","30-35k","35-40k"];
var percLossCategories = ["-100 à -75%","-75 à -50 %","-50 à -25 %","-25 à 0 %","0-25 %","25-50 %","50-100 %","100 % et au delà"];
var ageCategories = ["0-20 ans","20-30 ans","30-40 ans","40-50 ans","50-60 ans","60-70 ans","70-80 ans","80 ans et +"];
var ageCategoriesSeuil = [20,30,40,50,60,70,80];
var revenuCategoriesSeuil = [5000,10000,15000,20000,25000,30000,35000];
var percLossCategoriesSeuil = [-0.75,-0.50,-0.25,0,0.25,0.50,1];

var catCities = [
	{"cat":"village","seuilMax":2000},
	{"cat":"bourg et petite ville","seuilMax":20000},
	{"cat":"moyenne et grande ville","seuilMax":200000},
	{"cat":"metropole","seuilMax":Infinity}
];

// Color scale
var colorPopulation = d3.scaleLinear().range(["#2c7bb6","#d7191c"]);
var colorAge = d3.scaleThreshold().range(['#bd0026','#f03b20','#fd8d3c','#feb24c','#fed976','#ffffb2']).domain([20,30,40,50,60,70]);
var colorRevenu = d3.scaleThreshold().range(['#ffffcc','#a1dab4','#41b6c4','#2c7fb8','#253494']).domain([0,10000,20000,30000,40000]);
var colorPercLoss = d3.scaleLinear()
    	.domain([-0.83,0,1,5,10,26])
    	.range(["#ff8080", "white","#65e765","#00b300","green", "#003300"]);
var colorHeatRevenu = d3.scaleThreshold().range(['#f1eef6','#bdc9e1','#74a9cf','#1c5d7d','#091f2a']).domain([1,10,100,400]);
var colorHeatAge = d3.scaleThreshold().range(['#f2f2f2','#ffeab3','#feb24c','#fc6b03','#d72a0f']).domain([1,10,100,400]);

var widthB1 = 650,
    heightB1 = 480;
var marginB1 = {top: 50, right: 100, bottom: 60, left: 10};


var heightE = 300;
var widthE = 300;
var marginE = {top: 130, right: 200, bottom: 250, left: 70};

//Occitanie, France Latitude : 43.892723 | Longitude : 3.282762
var proj = d3.geoMercator()
  .center([2.2, 43.89])
    .scale(6700)
    .translate([widthB1/2, heightB1/2]);

var path = d3.geoPath()
    .projection(proj);

var svg1 = d3.select("#B-map")
    .attr("width", widthB1+ marginB1.right + marginB1.left)
    .attr("height", heightB1 + marginB1.top + marginB1.bottom)
    .append("g")
		.attr("transform", "translate(" + marginB1.left + "," + marginB1.top + ")");

var svg2 = d3.select("#D-map")
    .attr("width", widthB1+ marginB1.right + marginB1.left)
    .attr("height", heightB1 + marginB1.top + marginB1.bottom)
    .append("g")
		.attr("transform", "translate(" + marginB1.left + "," + marginB1.top + ")");

var svg3 = d3.select("#E-chart")
    .attr("width", widthE+ marginE.right + marginE.left)
    .attr("height", heightE + marginE.top + marginE.bottom)
    //.attr("transform", "translate(" + (widthB1 + marginB1.right + marginB1.left + 50) + "," + 0 + ")")
    .append("g")
		.attr("transform", "translate(" + marginE.left + "," + marginE.top + ")");

// TITLE
var title1 = d3.select("#B-map")
	.attr("width", widthB1+ marginB1.right + marginB1.left)
    .attr("height", heightB1 + marginB1.top + marginB1.bottom)
		.append("g")
		.attr("transform", "translate(" + 15 + "," + marginB1.top  + ")")
		.append("text")
		.attr("class","description")
		.html("<tspan>Les villages représentent la majeure partie du territoire en terme de superficie</tspan>");

svg2.append("text")
		.attr("x",5)
        .attr("y",-20)
		.attr("class","description")
			//.text(title);
		.html("Une augmentation de population très marquée autour des métropoles");

svg2.append("text")
		.attr("x",5)
        .attr("y",5)
		.attr("class","description")
			//.text(title);
		.html("et grandes villes, ou le phénomène de périurbanisation");


var playbuttonD = d3.select("#playButtonD");
var chooseButtonD1 = d3.select("#chooseButtonD1");
var chooseButtonD2 = d3.select("#chooseButtonD2");
var dropdownbuttonD = d3.select("#dropdownButtonD");
var attributes = [
	{name:"Aucune"},
	{name:"Moyenne d'age"},
	{name:"Revenu médian par unité de consommation"}
];
// GESTION BOUTON
playbuttonD.attr("transform", "translate(" + 0 + "," + 15 + ")");
playbuttonD.append("input")
	.attr("type", "button")
	.attr("value", "Démarrer")
	.on("click", function(d) {
		// DELETE PLAYBUTTON
		playbuttonD.select("input").remove();
		playbuttonD.select("text").remove();
		//CREATE ATTRIBUTE DROPDOWN
		dropdownbuttonD.select("text").text("Choisir la caractéristique à comparer");
		dropdownbuttonD.append("select")
		  .selectAll("option")
			  .data(attributes)
			  .enter()
			  .append("option")
			  .attr("value", function(d){
				  return d.name;
			  })
			  .text(function(d){
				  return d.name;
			  })
});


// PREPARE ANOTATION MAP
const annotationsMap = [
	{ note: {
	  	label: "De très fort taux d'évolution de population autour de Toulouse",
	  	wrap: 160
	  },
	  x: 240, y:290, dy: -180, dx: -170, subject: { radius: 200, radiusPadding: 10 }
	},
	{ note: {
	  	label: "et Cahors",
	  	wrap: 160
	  },
	  x: 240, y:150, dy: -30, dx: -90, subject: { radius: 200, radiusPadding: 10 }
	},
	{ note: {
	  	label: "De très fort taux d'évolution autour de Montpellier",
	  	wrap: 160
	  },
	  x: 520, y:285, dy: -150, dx: 100, subject: { radius: 200, radiusPadding: 0 }
	},
	{ note: {
	  	label: "et Nimes",
	  	wrap: 160
	  },
	  x: 580, y:245, dy: -80, dx: 80, subject: { radius: 200, radiusPadding: 0 }
	},
	{ note: {
	  	label: "ainsi que Perpignan",
	  	wrap: 100
	  },
	  x: 405, y:430, dy: -30, dx: 60, subject: { radius: 200, radiusPadding: 0 }
	}
	];
d3.annotation().annotations(annotationsMap);

const makeAnnotationsMap = d3.annotation()
	  .type(d3.annotationLabel)
	  .annotations(annotationsMap);

// SETUP DATA TAB FOR HEATMAP
var tab = [];

for (i=0; i<revenuCategories.length; i++){
	var yitem1 = revenuCategories[i];
	var yitem2 = ageCategories[i];
	for (j=0; j< percLossCategories.length; j++){
		var xitem = percLossCategories[j];
		tab.push({x: xitem , yRevenu: yitem1, yAge: yitem2 , valueRevenu: 0, valueAge: 0});
	}
}

// --- LOAD DATA ----//
d3.json("data/TDV-hackaviz_2018.geojson", function (data) {

	colorPopulation.domain([
		d3.min(data.features, function(d) { return d.properties.population_2014; }),
		d3.max(data.features, function(d) { return d.properties.population_2014; })
	]);

	console.log(d3.min(data.features, function(d) { return d.properties.médiane_du_revenu_disponible_par_unité_de_consommation_euro; }));
	console.log(d3.max(data.features, function(d) { return d.properties.médiane_du_revenu_disponible_par_unité_de_consommation_euro; }));

	//ADDING PROPERTIES TO THE DATA
	data.features.forEach( (d) => {
		d.properties.categorie2014 = getCatCities(d.properties.population_2014);
		if(d.properties.population_1968 == 0) {
			//console.log("68 d.properties.commune",d.properties.commune);
			d.properties.population_1968 = d.properties.population_1982;
		}
		if(d.properties.population_1982 == 0) {
			//console.log("82 d.properties.commune",d.properties.commune);
			d.properties.population_1968 = d.properties.population_1999;
		}
		if(d.properties.population_1999 == 0) {
			//console.log("99 d.properties.commune",d.properties.commune);
			d.properties.population_1968 = d.properties.population_2014;
		}
		d.properties.percLoss = (d.properties.population_2014 - d.properties.population_1968) / d.properties.population_1968;

		d.catRevenu = getCatRevenu(d.properties.médiane_du_revenu_disponible_par_unité_de_consommation_euro, revenuCategoriesSeuil, revenuCategories);
		d.catLoss = getCatLoss(d.properties.percLoss, percLossCategoriesSeuil, percLossCategories);

		d.catAge = getCatLoss(d.properties.moyenne_age_H_2014, ageCategoriesSeuil, ageCategories);

		if (d.properties.médiane_du_revenu_disponible_par_unité_de_consommation_euro != 0 ) {
			updateTabRevenu(tab,[d.catLoss,d.catRevenu]);
		}

		updateTabAge(tab,[d.catLoss,d.catAge]);
	})


	drawMap(svg1,widthB1,marginB1.top,"Carte de répartition des communes par catégories (2014)",data.features,"categorie");
	drawMap(svg2,widthB1,marginB1.top,"Carte de répartition des communes par taux d'évolution de la population (1968-2014)",data.features,"percLoss");

	svg2.append("g")
	  .attr("class", "annotation-group")
	  .call(makeAnnotationsMap);

	// GDROP DOWN
	dropdownbuttonD.on('change', () => {

		var selectedAttribute = d3.select("select").property("value");
		//console.log("onChange selectedAttribute",selectedAttribute);
		d3.selectAll(".choose").remove();
		chooseButtonD1.select("text").text("");
		cleanHeatmap();

		if (selectedAttribute != attributes[0].name) {

			// CHANGE FILL MAP
			var attr, cat, title1, title2, subtitle1, subtitle2 ;
			if (selectedAttribute == "Moyenne d'age"){
				attr = "age";
				//cat = ageCategories;
				title1 = "Les plus jeunes sont concentrés dans";
				title2 = "les communes les plus dynamiques";
				subtitle1 = "Nombre de commune pour chaque catégorie de taux ";
				subtitle2 = "d'évolution et de moyenne d'age";
				titleLegend = "Moyenne d'âge";


			}
			else if (selectedAttribute == "Revenu médian par unité de consommation"){
				attr = "revenu";
				//cat = revenuCategories;
				title1 = "Les plus hauts revenus localisés dans les";
				title2 = "communes au plus fort taux d'évolution";
				subtitle1 = "Nombre de commune pour chaque catégorie de taux ";
				subtitle2 = "d'évolution et de revenu médian par unité de consommation";
				titleLegend = "Revenu médian par unité de consomation";
			}
			//CHANGE FILL MAP
			updateFillMap(svg2,data.features,attr,titleLegend);

			// DRAW HEAT MAP
			drawHeatmap(title1,title2,subtitle1,subtitle2,attr);

			// AJOUT BOUTON MAP
			chooseButtonD1.append("input")
			.attr("type", "button")
			.attr("class", "choose")
			.attr("value", "Carte Taux d'évolution")
			.on("click", function(d) {
				//Clean Legend
				svg2.selectAll(".legendMap2").remove();
				updateFillMap(svg2,data.features,"percLoss");
				drawLegendPercLoss(svg2);
			});

			chooseButtonD2.append("input")
			.attr("type", "button")
			.attr("class", "choose")
			.attr("value", "Carte " + selectedAttribute)
			.on("click", function(d)  {
				//Clean Legend
				svg2.selectAll(".legendMap2").remove();
				//Update attr and fill
				var attr = "";
				var title;
				if (selectedAttribute == "Revenu médian par unité de consommation"){
					attr = "revenu";
					titleLegend = "Revenu médian par unité de consomation";

				}
				else if (selectedAttribute == "Moyenne d'age"){
					attr = "age";
					titleLegend = "Moyenne d'âge";
				}
				updateFillMap(svg2,data.features,attr,titleLegend);
				//add legend
				// ** TBD **
			});

		}
		// SI AUCUN
		else {
			updateFillMap(svg2,data.features,"percLoss");
		}
	});
});

// --- UTILITIES FUNCTIONS ----//

function updateFillMap(svg,data,fillattribute,title) {

	//Clean Legend
	svg.selectAll(".legendMap2").remove();

	svg.selectAll("path")
        .data(data)
        .transition()
        .duration(1000)
        .attr("fill", (d,i) => {
          	if (fillattribute == "categorie"){
          		return colorCat(d.properties.categorie2014);
          	}
          	else if (fillattribute == "percLoss") {
          		return colorPercLoss(d.properties.percLoss);
          	}
          	else if (fillattribute == "age") {
          		return colorAge(d.properties.moyenne_age_H_2014);
          	}
          	else if (fillattribute == "revenu") {
          		return colorRevenu(d.properties["médiane_du_revenu_disponible_par_unité_de_consommation_euro"]);
          	}
         });

	//Add Legend
		var colorLegend = d3.legendColor()
		.labelFormat(d3.format("d"))
		.labels(d3.legendHelpers.thresholdLabels)
		.title(title)
		//.orient('horizontal')
  		.titleWidth(200)
        .shapePadding(3)
        .shapeWidth(15)
        .shapeHeight(15)
        .labelOffset(10);

    if (fillattribute == "percLoss"){
		drawLegendPercLoss(svg);
	}
	else {
		if (fillattribute == "age"){
			colorLegend.scale(colorAge)
		}
		else if (fillattribute == "revenu") {
			colorLegend.scale(colorRevenu)
		}

		svg2.append("g")
		    .attr("transform", "translate(" + 520 +"," + 380 + ")")
		    .attr("class", "legendMap2")
		    .call(colorLegend);
	}

}


function drawMap(svg,width,margin,subtitle,data,fillattribute) {
	svg.append("g")
		.attr("class","villes")
        .selectAll("path")
        .data(data)
        .enter()
          .append("path")
          .attr("class", "communes")
          .attr("d", path)
          .attr("stroke","#595959")
          .attr('stroke-width', '0.3')
          .attr("fill", (d,i) => {
          	if (fillattribute == "categorie"){
          		return colorCat(d.properties.categorie2014);
          	}
          	else if (fillattribute == "percLoss") {
          		return colorPercLoss(d.properties.percLoss)
          	}
          });

    drawSubtitleMap(svg,margin,subtitle);

	if (fillattribute == "categorie"){
		drawLegendCategorie(svg,width,"Catégorie de commune selon le nombre d'habitants");
	}
	else if (fillattribute == "percLoss") {
		drawLegendPercLoss(svg);
	}
}

function drawSubtitleMap(svg,margin,subtitle) {
   svg.append('text')
    	.attr("class", "smallDescription")
        .attr("x",7)
        .attr("y",2*margin/4)
        .text(subtitle)
        .style('text-anchor','start');
}

function drawLegendCategorie(svg,width,title) {

	// LEGEND //
	var shapePadding = 5;
	var shapeHeight = 20;
	var titleWidth = 150;
	var colorLegend = d3.legendColor()
		.labelFormat(d3.format(".2f"))
		.title(title)
  		.titleWidth(titleWidth)
        .scale(colorCat)
        .shapePadding(shapePadding)
        .shapeWidth(20)
        .shapeHeight(shapeHeight)
        .labelOffset(10);

    svg.append("g")
        .attr("transform", "translate(" + (width-titleWidth+20) +"," + 350 + ")")
        .attr("class", "legend")
        .call(colorLegend);
}

function drawLegendPercLoss(svg) {

	// LINEAR GRADIENT

	//Append a defs (for definition) element to your SVG
	var defs = svg.append("defs");

	//Append a linearGradient element to the defs and give it a unique id
	var linearGradient = defs.append("linearGradient")
		.attr("id", "linear-gradient");

	//Diagonal gradient
	linearGradient
		.attr("x1", "0%")
		.attr("y1", "0%")
		.attr("x2", "100%")
		.attr("y2", "0%");

	//Set the color for the start (0%)
	linearGradient.append("stop")
		.attr("offset", "0%")
		.attr("stop-color", "#ff8080");

	linearGradient.append("stop")
		.attr("offset", "10%")
		.attr("stop-color", "white");

	linearGradient.append("stop")
		.attr("offset", "20%")
		.attr("stop-color", colorPercLoss(1));

	linearGradient.append("stop")
		.attr("offset", "75%")
		.attr("stop-color", colorPercLoss(5));

	linearGradient.append("stop")
		.attr("offset", "95%")
		.attr("stop-color", colorPercLoss(10));

	//Set the color for the end (100%)
	linearGradient.append("stop")
		.attr("offset", "100%")
		.attr("stop-color", "#003300");

	//Draw the rectangle and fill with gradient
	var legendzone = svg.append("g").attr("class","legendMap2");
	var x_offset = 650;
	var legendPadding = 20 ;
	var widthColor = 150;
	var y_offset = 500;

	legendzone.append("rect")
		.attr("width", widthColor)
		.attr("height", 13)
		.attr('x', -y_offset)
		//y devient x avec transfo 90 degres
		.attr('y', x_offset)
		.attr('transform', 'rotate(-90)')
		.style("stroke", "lightgrey")
		.style("fill", "url(#linear-gradient)");

	legendzone.append("text").text("+ 25 000%")
		.attr('x', x_offset + legendPadding)
		.attr('y', y_offset - widthColor + 5);

	legendzone.append("text").text("+ 5 000%")
		.attr('x', x_offset + legendPadding)
		.attr('y', y_offset - widthColor*0.75 + 5);

	legendzone.append("text").text("+ 100%")
		.attr('x', x_offset + legendPadding)
		.attr('y', y_offset - widthColor*0.2 + 5);

	legendzone.append("text").text("0%")
		.attr('x', x_offset + legendPadding)
		.attr('y', y_offset - widthColor*0.1 + 5);

	legendzone.append("text").text("- 100%")
		.attr('x', x_offset + legendPadding)
		// y_offset = en bas (-500%)
		.attr('y', y_offset + 5);
}

function cleanHeatmap() {

	svg3.selectAll("text").remove();
	svg3.selectAll("g").remove();
	svg3.selectAll("rect").remove();

}

function drawHeatmap(title1,title2,subtitle1,subtitle2,cat) {
//DEFINE Y to use
	var y_use ;
	var value_use;
	var categorie;

	if (cat == "age"){
		y_use = "yAge";
		value_use = "valueAge";
		categorie = ageCategories;
	}
	else if (cat == "revenu") {
		y_use = "yRevenu";
		value_use = "valueRevenu";
		categorie = revenuCategories;
	}

// TITLE SUBTITLE
	svg3.append("text")
		.attr("x",-50)
        .attr("y",-90)
		.attr("class","descriptionRec")
			//.text(title);
		.html(title1);

	svg3.append("text")
		.attr("x",- 50)
        .attr("y",-65)
		.attr("class","descriptionRec")
			//.text(title);
		.html(title2);

	svg3.append('text')
    	.attr("class", "smallDescription")
        .attr("x",- 50)
        .attr("y",- 45)
        .text(subtitle1)
        .style('text-anchor','start');

    svg3.append('text')
    	.attr("class", "smallDescription")
        .attr("x",- 50)
        .attr("y",-30)
        .text(subtitle2)
        .style('text-anchor','start');

// AXIS
	var x = d3.scaleBand()
		.range([0, widthE])
		.domain(percLossCategories);

	var y = d3.scaleBand()
		.range([heightE, 0])
		.domain(categorie);
		//.domain(revenuCategories);

	var yAxis = d3.axisLeft(y);
	var xAxis = d3.axisBottom(x);

	var xAxisSelector = svg3.append("g")
		.attr("transform", "translate(" + 0 + "," + heightE + ")")
		.attr("class","ax")
		.call(xAxis)
		.selectAll("text")
		    .style("text-anchor", "end")
		    .attr("dx", "-0.3em")
		    .attr("dy", "0.5em")
		    .attr("transform", "rotate(-20)");

	var yAxisSelector = svg3.append("g")
		.attr("class","ax")
		.call(yAxis);

// RECTANGLES
	var cellSize = heightE / revenuCategories.length - 2;

    var cells = svg3.selectAll('rect')
        .data(tab)
        .enter().append('g');

    cells.append('rect')
        .attr('class', 'cell')
        .attr('width', cellSize)
        .attr('height', cellSize)
        .attr('y', function(d) { return y(d[y_use]); })
        .attr('x', function(d) { return x(d.x) + 2; })
        .attr('fill', function(d) {
        	if (cat == "age"){
        		//console.log( colorHeatAge(d[value_use]) );
        		return colorHeatAge(d[value_use]);
        	}
        	else if (cat == "revenu") {
        		//console.log( colorHeatRevenu(d[value_use]) );
        		return colorHeatRevenu(d[value_use]);
        	}
        });

//LEGEND
	var colorLegend = d3.legendColor()
		.labelFormat(d3.format("d"))
		.labels(d3.legendHelpers.thresholdLabels)
		.title(subtitle1 + subtitle2)
		//.orient('horizontal')
  		.titleWidth(300)
        //
        .shapePadding(3)
        .shapeWidth(15)
        .shapeHeight(15)
        .labelOffset(10);

    if (cat == "age"){
		colorLegend.scale(colorHeatAge);
	}
	else if (cat == "revenu") {
		colorLegend.scale(colorHeatRevenu);
	}

    svg3.append("g")
        .attr("transform", "translate(" + 0 +"," + (heightE+90) + ")")
        .attr("class", "legend")
        .call(colorLegend);

// ANNOTATION

	var label, x, y, dy, dx, width, height;
	if (cat == "age"){

		annotationsHeatmap = [{
		  note: {
			label: "Les plus agés localisés dans les communes en baisse de population",
		  },
		  x:120, y:33, dy:0,  dx: 220,
		  subject: {
			width: -120,
			height: 45
		  }
		},
		{
		  note: {
			label: "Les plus jeunes localisés dans les communes à forte augmentation de population",
		  },
		  x:305, y:220, dy:0,  dx: 30,
		  subject: {
			width: -160,
			height: 45
		  }
		}
		]
	}
	else if (cat == "revenu") {
		annotationsHeatmap = [{
		  note: {
			label: "Les plus hauts revenus dans les communes où la population a plus que doublée",
		  },
		  x:302, y:0, dy:0,  dx: 30,
		  subject: {
			width: -40,
			height: 75
		  }
		}]
	}

	const makeAnnotationsHeatmap = d3.annotation()
	  .type(d3.annotationCalloutRect)
	  .annotations(annotationsHeatmap);

	svg3.append("g")
		.attr("class", "annotation-group")
		.call(makeAnnotationsHeatmap);
}

function updateTab(tab,t) {

	tab.forEach( (d) => {
		if ( (d.x == t[0]) && (d.y == t[1]) ) {
			d.value++;
		}
	});
}

function getCatCities(population) {
	if (population < catCities[0].seuilMax) {return catCities[0].cat;}
	else if (population < catCities[1].seuilMax){return catCities[1].cat;}
	else if (population < catCities[2].seuilMax){return catCities[2].cat;}
	else {return catCities[3].cat;}
}

function getCatRevenu(revenu,revenuCategoriesSeuil,revenuCategories) {
	if (revenu < revenuCategoriesSeuil[0]) {return revenuCategories[0];}
	else if (revenu < revenuCategoriesSeuil[1]){return revenuCategories[1];}
	else if (revenu < revenuCategoriesSeuil[2]){return revenuCategories[2];}
	else if (revenu < revenuCategoriesSeuil[3]){return revenuCategories[3];}
	else if (revenu < revenuCategoriesSeuil[4]){return revenuCategories[4];}
	else if (revenu < revenuCategoriesSeuil[5]){return revenuCategories[5];}
	else if (revenu < revenuCategoriesSeuil[6]){return revenuCategories[6];}
	else {return revenuCategories[7];}
}

function getCatLoss(percLoss,percLossCategoriesSeuil,percLossCategories) {
	if (percLoss < percLossCategoriesSeuil[0]) {return percLossCategories[0];}
	else if (percLoss < percLossCategoriesSeuil[1]){return percLossCategories[1];}
	else if (percLoss < percLossCategoriesSeuil[2]){return percLossCategories[2];}
	else if (percLoss < percLossCategoriesSeuil[3]){return percLossCategories[3];}
	else if (percLoss < percLossCategoriesSeuil[4]){return percLossCategories[4];}
	else if (percLoss < percLossCategoriesSeuil[5]){return percLossCategories[5];}
	else if (percLoss < percLossCategoriesSeuil[6]){return percLossCategories[6];}
	else {return percLossCategories[7];}
}

function getCatAge(age,ageCategoriesSeuil,ageCategories) {
	if (age < percLossCategoriesSeuil[0]) {return ageCategories[0];}
	else if (age < ageCategoriesSeuil[1]){return ageCategories[1];}
	else if (age < ageCategoriesSeuil[2]){return ageCategories[2];}
	else if (age < ageCategoriesSeuil[3]){return ageCategories[3];}
	else if (age < ageCategoriesSeuil[4]){return ageCategories[4];}
	else if (age < ageCategoriesSeuil[5]){return ageCategories[5];}
	else if (age < ageCategoriesSeuil[6]){return ageCategories[6];}
	else {return ageCategories[7];}
}

function updateTabRevenu(tab,t) {
	tab.forEach( (d) => {
		if ( (d.x == t[0]) && (d.yRevenu == t[1]) ) { d.valueRevenu++;}
	});
}

function updateTabAge(tab,t) {
	tab.forEach( (d) => {
		if ( (d.x == t[0]) && (d.yAge == t[1]) ) { d.valueAge++; }
	});
}

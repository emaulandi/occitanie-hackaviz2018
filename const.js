
// -- FORMAT-- //
const formatperc = d3.format(".0%");
const formatvirgule = d3.format(",d");

// -- USEFULL CATEGORIES -- //
const categories = ["metropole","moyenne et grande ville","bourg et petite ville","village"];
const revenuCategories = ["0-5k","5-10k","10-15k","15-20k","20-25k","25-30k","30-35k","35-40k"];
const percLossCategories = ["-100 à -75%","-75 à -50 %","-50 à -25 %","-25 à 0 %","0-25 %","25-50 %","50-100 %","100 % et au delà"];
const ageCategories = ["0-20 ans","20-30 ans","30-40 ans","40-50 ans","50-60 ans","60-70 ans","70-80 ans","80 ans et +"];
const ageCategoriesSeuil = [20,30,40,50,60,70,80];
const revenuCategoriesSeuil = [5000,10000,15000,20000,25000,30000,35000];
const percLossCategoriesSeuil = [-0.75,-0.50,-0.25,0,0.25,0.50,1];

const catCities = [
	{"cat":"village","seuilMax":2000},
	{"cat":"bourg et petite ville","seuilMax":20000},
	{"cat":"moyenne et grande ville","seuilMax":200000},
	{"cat":"metropole","seuilMax":Infinity}
];

// -- COLOR SCALE -- //
const colorCat = d3.scaleOrdinal().range(['#9999ff','#eeccff','#c8eae4','#ffff99']).domain(categories);

const colorPopulation = d3.scaleLinear().range(["#2c7bb6","#d7191c"]);
const colorAge = d3.scaleThreshold().range(['#bd0026','#f03b20','#fd8d3c','#feb24c','#fed976','#ffffb2']).domain([20,30,40,50,60,70]);
const colorRevenu = d3.scaleThreshold().range(['#ffffcc','#a1dab4','#41b6c4','#2c7fb8','#253494']).domain([0,10000,20000,30000,40000]);
const colorPercLoss = d3.scaleLinear()
    	.domain([-0.83,0,1,5,10,26])
    	.range(["#ff8080", "white","#65e765","#00b300","green", "#003300"]);
const colorHeatRevenu = d3.scaleThreshold().range(['#f1eef6','#bdc9e1','#74a9cf','#1c5d7d','#091f2a']).domain([1,10,100,400]);
const colorHeatAge = d3.scaleThreshold().range(['#f2f2f2','#ffeab3','#feb24c','#fc6b03','#d72a0f']).domain([1,10,100,400]);

// -- POPULATION SUM FOR EACH DATE -- //
// -- To be redone (out of code but light to load)
const populationSum = [3872177,4240028,4836045,5730753];
const standard_duration = 6000;

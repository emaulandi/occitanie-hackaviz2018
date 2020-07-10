const categories = ["metropole","moyenne et grande ville","bourg et petite ville","village"];
const colorCat = d3.scaleOrdinal().range(['#9999ff','#eeccff','#c8eae4','#ffff99']).domain(categories);
const formatperc = d3.format(".0%");
const formatvirgule = d3.format(",d");	

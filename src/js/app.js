// Chart size
var margin = {top: 100, right: 100, bottom: 100, left: 100};
var width = Math.min(1000, window.innerWidth - 10) - margin.left - margin.right;
var height = Math.min(width, window.innerHeight - margin.top - margin.bottom);

// Colors
var neutraColor = "#012E40";
var color = d3.scaleOrdinal(["#03658C","#F26D78"]);

// Year selectors
var years = [1991, 1995, 2000, 2005, 2010, 2015, 2020, 2024];
var yearSelector = document.getElementById('year-selector-list');
years.map(function(year, i) {
  var li = document.createElement('li');
  var button = document.createElement('button');
  button.classList.add('btn-year-selector');
  button.classList.add('btn-year-selector-' + i);
  button.textContent = year;
  li.innerHTML += button.outerHTML;

  yearSelector.appendChild(li);
});

// Radar Chart options
var radarChartOptions = {
  width: width,
  height: height,
  margin: margin,
  maxValue: 0.3,
  levels: 6,
  roundStrokes: true,
  color: color,
  glow: true,
};

// Set default year and add active styles
var year = years[0];
document.getElementById('year-selector-list').firstChild.firstChild.classList.add('active');

// Call Radar Chart function
radarChart("#radar-chart", dataPerAxis, radarChartOptions, year);

// Call Streamgraphe function
streamgraph("#streamgraph-container", dataPerAxis.dataPerYear);

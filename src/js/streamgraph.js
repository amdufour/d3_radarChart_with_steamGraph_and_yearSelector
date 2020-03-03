function streamgraph(selector, data) {
  var margin = {top: 20, right: 20, bottom: 20, left: 20};
  var width = Math.min(500, window.innerWidth / 2 - 10) - margin.left - margin.right;
  var height = 500;

  // Append the svg object for men
  var svgMen = d3.select('#streamgraph-men')
    .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
    .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
  
  // Parse the data
  d3.csv('../data/data_over_time-Men.csv').then(function(data) {

    // Add X axis
    var x_scale = d3.scaleLinear()
      .domain(d3.extent(data, function(d) {
        return d.year;
      }))
      .range([0, width]);
    var x_axis = d3.axisBottom(x_scale)
      .ticks(8)
      .tickFormat(d3.format('d'));
    svgMen.append('g')
      .attr('transform', 'translate(0,' + height + ')')
      .call(x_axis);
    
    // Add Y axis
    var y_scale = d3.scaleLinear()
      .domain([-100, 100])
      .range([height, 0]);
    var y_axis = d3.axisLeft(y_scale);
    svgMen.append('g')
      .call(y_axis);
    
    // List of groups (headers in the csv file)
    var keys = data.columns.slice(1);

    // Color palette
    var color = d3.scaleOrdinal()
      .domain(keys)
      .range(['#025159', '#03A696', '#F28705', '#F25D27', '#F20505']);

    // Stack the data
    var stackedData = d3.stack()
      .offset(d3.stackOffsetNone)
      .keys(keys)
      (data);

    // Area generator
    var area = d3.area()
      .x(function(d) {
        return x_scale(d.data.year);
      })
      .y0(function(d) {
        return y_scale(d[0])
      })
      .y1(function(d) {
        return y_scale(d[1])
      })

    // Show the areas
    svgMen
      .selectAll("layers-men")
      .data(stackedData)
      .enter()
      .append("path")
        .style("fill", function(d) { 
          return color(d.key); 
        })
        .attr("d", area);

  });

}
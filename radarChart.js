/////////////////////////////////////////////////////////
/////////////// The Radar Chart Function ////////////////
///////////// Written by Anne-Marie Dufour //////////////
//// Adapted from Nadieh Bremer, VisualCinnamon.com /////
/////////// Inspired by the code of alangrafu ///////////
/////////////////////////////////////////////////////////

function radarChart(selector, data, options, year) {
  // Default configuration
  var cfg = {
    width: 600, //Width of the circle
    height: 600, //Height of the circle
    margin: {top: 20, right: 20, bottom: 20, left: 20}, //Margins of the SVG element
    levels: 3, //How many levels of inner circles should be drawn
    maxValue: 1, //Value that the biggest circle will represent
    labelFactor: 1.25, //How much further for the outer circle the labels should be positioned
    wrapWidth: 150, //The number of pixels after which a label needs to be given a new line
    opacityArea: 0.35, //Opacity of the area of the blob
    dotRadius: 4, //Size of the circles representing each value
    opacityCircles: 0.1, //Opacity of the circles representing each value
    strokeWidth: 2, //Width of the stroke around each blob
    roundStrokes: false, //If true, teh area and stroke of the blobs will follow a round path (cardinal-closed interpolation)
    color: d3.scaleOrdinal(d3.schemeCategory10), //Color function
    glow: false, //If true, will add a glow effect to the data
  }

  // Populate cfg with options
  if (typeof options !== 'undefined') {
    for (var i in options) {
      if (typeof options[i] !== 'undefined') {
        cfg[i] = options[i];
      }
    }
  }
  
  // If the supplied maxValue is smaller than the max in the data, replace by the max in the data
  var maxInData = d3.max(data.dataPerYear[year], function(i) {
    return d3.max(i.map(function(o) {
      return o.value;
    }))
  })
  var maxValue = Math.max(cfg.maxValue, Math.ceil(maxInData * 10) / 10);
  
  // Base variables
  var allAxis = (data.axisLabels.map(function(i) { //Get the label of each axis
    return i.label;
  }));
  var numberOfAxis = allAxis.length; //Get the number of axis
  var angleSlice = Math.PI * 2 / numberOfAxis; //Width of each slice (in radians)
  var outerRadius = Math.min(cfg.width / 2, cfg.height / 2) //Radius of the outermost circle
  /* Should also allow other formats */
  /* To refactor */
  var format = d3.format('.0%') //Format values as percentages
  /* To refactor -- end */

  // Scale for the radius
  var rScale = d3.scaleLinear()
    .range([0, outerRadius])
    .domain([0, maxValue]);

  
  /////////////////////////////////////////////////////////
	//////////// Create the container SVG and g /////////////
  /////////////////////////////////////////////////////////
  
  // Remove whaterver chart with the same id/class was present before
  d3.select(selector).select('svg').remove();

  // Initiate the radar chart SVG
  var svg = d3.select(selector).append('svg')
    .attr('width', cfg.width + cfg.margin.left + cfg.margin.right)
    .attr('height', cfg.height + cfg.margin.top + cfg.margin.bottom)
    .attr('class', 'radar-' + selector);
  
  // Append a g element
  var g = svg.append('g')
    .attr('transform', 'translate(' + (cfg.width/2 + cfg.margin.left) + ',' + (cfg.height/2 + cfg.margin.top) + ')');
  
  
  /////////////////////////////////////////////////////////
	////////// Glow filter for some extra pizzazz ///////////
  /////////////////////////////////////////////////////////
  
  // Filter for the outside glow
  var filter = g.append('defs').append('filter')
    .attr('id', 'glow');
  var feGaussianBlur = filter.append('feGaussianBlur')
    .attr('stdDeviation', '2.5')
    .attr('result', 'coloredBlur');
  var feMerge = filter.append('feMerge');
  var feMergeNode_1 = feMerge.append('feMergeNode')
    .attr('in', 'coloredBlur');
  var feMergeNode_2 = feMerge.append('feMergeNode')
    .attr('in', 'SourceGraphic');


  /////////////////////////////////////////////////////////
	/////////////// Draw the Circular grid //////////////////
  /////////////////////////////////////////////////////////
  
  // Wrapper for the grid & axes
  var axisGrid = g.append('g').attr('class', 'axisWrapper');

  // Draw the background circles
  axisGrid.selectAll('.grid-circle')
    .data(d3.range(1,(cfg.levels + 1)).reverse())
    .enter()
    .append('circle')
    .attr('class', 'grid-circle')
    .attr('r', function(d) {
      return outerRadius / cfg.levels * d;
    })
    .style('fill', '#CDCDCD')
    .style('stroke', '#CDCDCD')
    .style('fill-opacity', cfg.opacityCircles)
    .style('filter', function() {
      if (cfg.glow) {
        return 'url(#glow)';
      }
    });

  // Add labels to the circles
  axisGrid.selectAll('.axisLabel')
    .data(d3.range(1, cfg.levels + 1).reverse())
    .enter()
    .append('text')
    .attr('class', 'axisLabel')
    .attr('x', 4)
    .attr('y', function(d) {
      return -d * outerRadius / cfg.levels;
    })
    .attr('dy', '0.4rem')
    .style('font-size', '10px')
    .attr('fill', '#737373')
    .text(function(d) {
      return format(maxValue * d / cfg.levels);
    });

  
  /////////////////////////////////////////////////////////
	//////////////////// Draw the axes //////////////////////
  /////////////////////////////////////////////////////////
  
  // Draw the axes (lines radiating from the center)
  var axis = axisGrid.selectAll('.axis')
    .data(allAxis)
    .enter()
    .append('g')
    .attr('class', 'axis');

  // Append the lines to the groups
  axis.append('line')
    .attr('x1', 0)
    .attr('y1', 0)
    .attr('x2', function(d, i) {
      return rScale(maxValue * 1.1) * Math.cos(angleSlice * i - Math.PI / 2);
    })
    .attr('y2', function(d, i) {
      return rScale(maxValue * 1.1) * Math.sin(angleSlice * i - Math.PI / 2);
    })
    .attr('class', 'line')
    .style('stroke', 'white')
    .style('stroke-width', '2px');
  
  // Add labels to the axis
  axis.append('text')
    .attr('class', 'legend')
    .style('font-size', '12px')
    .attr('text-anchor', 'middle')
    .attr('dy', '0.35rem')
    .attr('x', function (d,i) {
      return rScale(maxValue * cfg.labelFactor) * Math.cos(angleSlice * i - Math.PI / 2);
    })
    .attr('y', function (d,i) {
      return rScale(maxValue * cfg.labelFactor) * Math.sin(angleSlice * i - Math.PI / 2);
    })
    .text(function(d) {
      return d;
    })
    .call(wrap, cfg.wrapWidth);


  /////////////////////////////////////////////////////////
	///////////// Draw the radar chart blobs ////////////////
  /////////////////////////////////////////////////////////
  
  // Radial line function
  var radarLine = d3.lineRadial()
    .curve(d3.curveBasicClosed)
    .radius(function(d) {
      return rScale(d.value);
    })
    .angle(function(d, i) {
      return i * angleSlice;
    });
  
  if (cfg.roundStrokes) {
    radarLine.curve(d3.curveCardinalClosed);
  }

  // Create a wrapper for the blobs
  var blobWrapper = g.selectAll('.radarWrapper')
    .data(data.dataPerYear[year])
    .enter()
    .append('g')
    .attr('class', 'radarWrapper');

  // Append the backgrounds
  blobWrapper.append('path')
    .attr('class', 'radarArea')
    .attr('d', function(d) {
      return radarLine(d);
    })
    .style('fill', function(d, i) {
      return cfg.color(i);
    })
    .style('fill-opacity', cfg.opacityArea)
    .on('mouseover', function () {
      // Dim all blobs
      d3.selectAll('.radarArea')
        .transition()
        .duration(200)
        .style('fill-opacity', 0.1);
      
      // Increase opacity of the hovered over blob
      d3.select(this)
        .transition()
        .duration(200)
        .style('fill-opacity', 0.7);
    })
    .on('mouseout', function() {
      // Return all blobs to initial opacity
      d3.selectAll('.radarArea')
        .transition()
        .duration(200)
        .style('fill-opacity', cfg.opacityArea);
    });

  // Create the outlines
  blobWrapper.append('path')
    .attr('class', 'radarStroke')
    .attr('d', function(d) {
      return radarLine(d);
    })
    .style('stroke-width', cfg.strokeWidth + 'px')
    .style('stroke', function(d, i) {
      return cfg.color(i);
    })
    .style('fill', 'none')
    .style('filter', function() {
      if (cfg.glow) {
        return 'url(#glow)';
      }
    });
  
  // Append the circles
  var dataSetCounter = 0; // Counter to know in which set of data we are
  blobWrapper.selectAll('.radarCircle')
    .data(function(d) {
      return d;
    })
    .enter()
    .append('circle')
    .attr('class', 'radarCircle')
    .attr('r', cfg.dotRadius)
    .attr('cx', function(d, i) {
      return rScale(d.value) * Math.cos(angleSlice*i - Math.PI/2);
    })
    .attr('cy', function(d, i) {
      return rScale(d.value) * Math.sin(angleSlice*i - Math.PI/2);
    })
    .style('fill', function(d, i, j) {
      var row = 0;
      if (i === j.length - 1) {
        row = dataSetCounter;
        dataSetCounter = dataSetCounter + 1;
      } else {
        row = dataSetCounter;
      }
      return cfg.color(row);
    })
    .style('fill-opacity', 0.8);


  /////////////////////////////////////////////////////////
	//////// Append invisible circles for tooltip ///////////
  /////////////////////////////////////////////////////////
  
  // Wrapper for invisible circles
  var blobCircleWrapper = g.selectAll('.radarCircleWrapper')
    .data(data.dataPerYear[year])
    .enter()
    .append('g')
    .attr('class', 'radarCircleWrapper');

  // Set up the tooltip when hovering a circle
  var tooltip = g.append('text')
    .attr('class', 'tooltip')
    .style('opacity', 0);

  // Append a set of invisible circles on top for the tooltip
  blobCircleWrapper.selectAll('.radarInvisibleCircle')
    .data(function(d) {
      return d;
    })
    .enter()
    .append('circle')
    .attr('class', 'radarInvisibleCircle')
    .attr('r', cfg.dotRadius * 1.5)
    .attr('cx', function (d, i) {
      return rScale(d.value) * Math.cos(angleSlice*i - Math.PI/2);
    })
    .attr('cy', function (d, i) {
      return rScale(d.value) * Math.sin(angleSlice*i - Math.PI/2);
    })
    .style('fill', 'none')
    .style('pointer-events', 'all')
    .on('mouseover', function(d) {
      var newX = parseFloat(d3.select(this).attr('cx')) - 10;
      var newY = parseFloat(d3.select(this).attr('cy')) - 10;

      tooltip.attr('x', newX)
        .attr('y', newY)
        .text(format(d.value))
        .transition()
        .duration(200)
        .style('opacity', 1);
    })
    .on('mouseout', function() {
      tooltip.transition()
        .duration(200)
        .style('opacity', 0);
    })


  /////////////////////////////////////////////////////////
	////////////////// Update radar chart //////////////////
  /////////////////////////////////////////////////////////

  // Update on click on year selector
  window.addEventListener('click', function(event) {
    if (event.target.matches('.btn-year-selector')) {
      // Reasign active class
      var activeButton = document.getElementsByClassName('active');
      activeButton[0].classList.remove('active');
      event.target.classList.add('active');

      // Redraw radar chart with new year
      var t = d3.transition()
        .duration(1000);
      year = event.target.innerHTML;
      newData = data.dataPerYear[year];
      var counterDataBg = 0;
      var counterDataBgColor = 0;
      var counterDataOutline = 0;
      var counterDataOutlineColor = 0;

      var blobWrapper = g.selectAll('.radarWrapper')
        .data(newData);
      
      blobWrapper
        .selectAll('.radarArea')
        .data(newData)
        .transition(t)
        .attr('d', function(d) {
          counterDataBg += 1;
          return radarLine(newData[counterDataBg - 1]);
        })
        .style('fill', function(d, i) {
          counterDataBgColor += 1;
          return cfg.color(counterDataBgColor - 1);
        });
      
      blobWrapper
        .selectAll('.radarStroke')
        .data(newData)
        .transition(t)
        .attr('d', function(d) {
          counterDataOutline += 1;
          return radarLine(newData[counterDataOutline - 1]);
        })
         .style('stroke', function(d, i) {
          counterDataOutlineColor += 1;
          return cfg.color(counterDataOutlineColor - 1);
        });
      
      blobWrapper
        .selectAll('.radarCircle')
        .data(function(d) {
          return d;
        })
        .transition(t)
        .attr('cx', function(d, i) {
          return rScale(d.value) * Math.cos(angleSlice*i - Math.PI/2);
        })
        .attr('cy', function(d, i) {
          return rScale(d.value) * Math.sin(angleSlice*i - Math.PI/2);
        })

      // Update tooltips
    var blobCircleWrapper = g.selectAll('.radarCircleWrapper')
      .data(newData);
    
    
    blobCircleWrapper
      .selectAll('.radarInvisibleCircle')
      .data(function(d) {
        return d;
      })
      .transition(t)
      .attr('cx', function (d, i) {
        return rScale(d.value) * Math.cos(angleSlice*i - Math.PI/2);
      })
      .attr('cy', function (d, i) {
        return rScale(d.value) * Math.sin(angleSlice*i - Math.PI/2);
      });

    }
  }, true);

  window.addEventListener('mousedown', function(event) {
    if (event.target.matches('.btn-year-selector')) {
      clearInterval(selectYearInterval);
    }
  });

  // Automatic year update
  var yearSelectors = document.querySelectorAll('.btn-year-selector');
  var i = 1;
  var selectYearInterval = setInterval(selectYear, 2500, i);

  function selectYear() {
    if (i < yearSelectors.length) {
      yearSelectors[i].click(event, true);
      ++i;
    } else {
      clearInterval(selectYearInterval);
    }
  }


  /////////////////////////////////////////////////////////
	/////////// Helper Function for svg text wrap ///////////
  /////////////////////////////////////////////////////////
  
  //Taken from http://bl.ocks.org/mbostock/7555321
	//Wraps SVG text
  function wrap(text, width) {
    text.each(function() {
      var text = d3.select(this);
      var words = text.text().split(/\s+/).reverse();
      var word;
      var line = [];
      var lineNumber = 0;
      var lineHeight = 1.4; // in em
      var x = text.attr('x');
      var y = text.attr('y');
      var dy = parseFloat(text.attr('dy'));
      var tspan = text.text(null)
        .append('tspan')
        .attr('x', x)
        .attr('y', y)
        .attr('dy', dy + 'em');

      while (word = words.pop()) {
        line.push(word);
        tspan.text(line.join(' '));
        if (tspan.node().getComputedTextLength() > width) {
          line.pop();
          tspan.text(line.join(' '));
          line = [word];
          tspan = text.append('tspan')
            .attr('x', x)
            .attr('y', y)
            .attr('dy', ++lineNumber * lineHeight + dy + 'em')
            .text(word);
        }
      }
    });
  }

}

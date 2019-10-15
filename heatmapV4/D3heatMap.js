$(document).ready(function () {
    var option = {
        container: ".heatmap",
        marginTop: 120,
        marginRight: 20,
        marginBottom: 20,
        marginLeft: 110,
        height: 300,
        itemSize: 30
    };
    function heatMap(options) {
        $(options.container).empty();
        if (options)
        {
            options.container = options.container ? options.container : "body";
            options.width = options.width ? options.width : $(options.container).width();
            options.height = options.height ? options.height : 300;
            options.marginTop = options.marginTop ? options.marginTop : 30;
            options.marginBottom = options.marginBottom ? options.marginBottom : 30;
            options.marginRight = options.marginRight ? options.marginRight : 20;
            options.marginLeft = options.marginLeft ? options.marginLeft : 50;
            options.itemSize = options.itemSize ? options.itemSize : 22;
            options.show_YAxis = options.show_YAxis ? options.show_YAxis : true;
            options.show_YAxisText = options.show_YAxisText ? options.show_YAxisText : true;
            options.rotate_YAxisText = options.rotate_YAxisText ? options.rotate_YAxisText : false;            
            options.show_YAxisPath = options.show_YAxisPath ? options.show_YAxisPath : true;
            options.show_YAxisTicks = options.show_YAxisTicks ? options.show_YAxisTicks : true;
            options.rotate_YAxisTicks = options.rotate_YAxisTicks ? options.rotate_YAxisTicks : true;
            options.fontSize_YAxis =options.fontSize_YAxis ?options.fontSize_YAxis:10;
            options.fontFamily_YAxis = options.fontFamily_YAxis?options.fontFamily_YAxis:"sans-serif";
            options.show_XAxis = options.show_XAxis ? options.show_XAxis : true;
            options.show_XAxisText = options.show_XAxisText ? options.show_XAxisText : true;
            options.rotate_XAxisText = options.rotate_XAxisText ? options.rotate_XAxisText : true;
            options.show_XAxisPath = options.show_XAxisPath ? options.show_XAxisPath : true;
            options.show_XAxisTicks = options.show_XAxisTicks ? options.show_XAxisTicks : true;
            options.rotate_XAxisTicks = options.rotate_XAxisTicks ? options.rotate_XAxisTicks : true;
            options.fontSize_XAxis =options.fontSize_XAxis ?options.fontSize_XAxis:10;
            options.fontFamily_XAxis = options.fontFamily_XAxis?options.fontFamily_XAxis:"sans-serif";
            options.gridx = options.gridx ? options.gridx : false;
            options.gridy = options.gridy ? options.gridy : false;
        }
        var itemSize = options.itemSize,
                cellSize = itemSize - 1,
                margin = {top: options.marginTop, right: options.marginRight, bottom: options.marginBottom, left: options.marginLeft}

        var width = options.width - margin.right - margin.left,
                height = options.height - margin.top - margin.bottom;
        
        
        var formatDate = d3.timeFormat("%Y-%m-%d");

        d3.csv('D3heatMap.csv', function (response) {

            var data = response.map(function (item) {
                var newItem = {};
                newItem.country = item.x;
                newItem.product = item.y;
                newItem.value = item.value;

                return newItem;
            })
            

            var x_elements = d3.set(data.map(function (item) {
                return item.product;
            })).values(),
                    y_elements = d3.set(data.map(function (item) {
                        return item.country;
                    })).values();

            var xScale = d3.scaleBand()
                    .domain(x_elements)
                    .range([0, x_elements.length * itemSize]);

            var xAxis = d3.axisTop()
                    .scale(xScale)
                    .tickFormat(function (d) {
                        return d;
                    })
                  //  .orient("top");

            var yScale = d3.scaleBand()
                    .domain(y_elements)
                    .range([0, y_elements.length * itemSize]);

            var yAxis = d3.axisLeft()
                    .scale(yScale)
                    .tickFormat(function (d) {
                        return d;
                    })
                   // .orient("left");

            var colorScale = d3.scaleThreshold()
                   .domain([0.85, 1])
                   .range(["#2980B9","#E67E22","#27AE60", "#27AE60"]);
            
          
                  
// Draw SVG
            var svg = d3.select(options.container)
                    .append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
// Draw RECT blocks
            var cells = svg.selectAll('rect')
                    .data(data)
                    .enter().append('g').append('rect')
                    .attr('class', 'cell')
                    .attr('width', cellSize)
                    .attr('height', cellSize)
                    .attr('y', function (d) {
                        return yScale(d.country);
                    })
                    .attr('x', function (d) {
                        return xScale(d.product);
                    })
                    .attr('fill', function (d) {
                        return colorScale(d.value);
                    });
// Draw y axis
            var y_g = svg.append("g")
                    .attr("class", "y axis")
                    .style("display", function () {
                        return options.show_YAxis ? 'block' : 'none';
                    })
                    .call(yAxis);


//  Y Axis path        
            y_g.selectAll("path")
                    .attr("class", "y axispath")
                    .style("stroke", "#ccc")
                    .style("shape-rendering", "crispEdges")
                    .style("fill", "none")
                    .style("display", function () {
                        return options.show_YAxisPath ? 'block' : 'none';
                    });
//  Y Axis Text                   
            y_g.selectAll('text')
                    .attr('font-weight', 'normal')
                    .style("font-size", options.fontSize_YAxis + "px")
                    .style("font-family", options.fontFamily_YAxis)
                    .style("display", function () {
                        return options.show_YAxisText ? 'block' : 'none';
                    })
                    .attr("transform", function () {
                        return options.rotate_YAxisText ? 'rotate(-120)' : 'rotate(0)';
                    });
//  Y Axis Ticks                   
            y_g.selectAll("line")
                    .attr("class", "y axisline")
                    .style("stroke", "#ccc")
                    .style("shape-rendering", "crispEdges")
                    .style("fill", "none")
                    .style("display", function () {
                        return options.show_YAxisTicks ? 'block' : 'none';
                    })
                    .attr("transform", function () {
                        return options.rotate_YAxisTicks ? 'rotate(-60)' : 'rotate(0)';
                    });
// Draw x axis
            var x_g = svg.append("g")
                    .attr("class", "x axis")
                    .style("display", function () {
                        return options.show_XAxis ? 'block' : 'none';
                    })
                    .call(xAxis);
   //  X Axis path        
            x_g.selectAll("path")
                    .attr("class", "y axispath")
                    .style("stroke", "#ccc")
                    .style("shape-rendering", "crispEdges")
                    .style("fill", "none")
                    .style("display", function () {
                        return options.show_XAxisPath ? 'block' : 'none';
                    });                  
                              
//  X Axis Text  
            x_g.selectAll('text')
                    .attr('font-weight', 'normal')
                    .style("font-size", options.fontSize_XAxis + "px")
                    .style("font-family", options.fontFamily_XAxis)
                    .style("text-anchor", "start")
                    .attr("dx", ".8em")
                    .attr("dy", ".5em")
                    .attr("transform", function () {
                        return options.rotate_XAxisText ? 'rotate(-120)' : 'rotate(0)';
                    });
 
//  X Axis Ticks                   
            x_g.selectAll("line")
                    .attr("class", "x axisline")
                    .style("stroke", "#ccc")
                    .style("shape-rendering", "crispEdges")
                    .style("fill", "none")
                    .style("display", function () {
                        return options.show_XAxisTicks ? 'block' : 'none';
                    })
                    .attr("transform", function () {
                        return options.rotate_XAxisTicks ? 'rotate(-60)' : 'rotate(0)';
                    });
        });
    }
    heatMap(option);
});

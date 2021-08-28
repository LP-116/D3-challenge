
var svgWidth = 960;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);


var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

var chosenXAxis = "poverty"

function xScale(stateData, chosenXAxis) {

    var xLinearScale = d3.scaleLinear()
      .domain([8, d3.max(stateData, d => d.[chosenXAxis]) * 0.8,
        d3.max(stateData, d => d[chosenXAxis]) * 1.2])
      .range([0, width]);

    return xLinearScale;
}

function renderAxis(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);
    
    return xAxis;
}

function renderCircles(circlesGroup, newXScale, chosenXAxis) {

    circlesGroup.transition()
        .duration(1000)
        .attr("cx",  d => newXScale(d[chosenXAxis]));

    return circlesGroup;
}

function updateToolTip(chosenXAxis, circlesGroup) {

    var label;

    if (chosenXAxis === "poverty") {
        label = "In Poverty %";
    }

    else if (chosenXAxis === "age") {
        label = "Age (Median)";
    }

    else {
        label = "Household Income (Median)"
    }

    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([10, -10])
        .html(function(d) {return (`${d.state}<br>${label}: ${d[chosenXAxis]} <br>Healthcare: ${d.healthcare}`);
    });

    circlesGroup.on("mouseover", function(data) {
        toolTip.show(data);
    })

        .on("mouseout", function(data, index) {
            toolTip.hide(data);
        });
    
    return circlesGroup;
}

d3.csv("data.csv").then(function(stateData, err) {

    if (err) throw err;

        stateData.forEach(function(data) {
            data.poverty = +data.poverty;
            data.healthcare = +data.healthcare;
        });

        var xLinearScale = xScale(stateData, chosenXAxis)

        var yLinearScale = d3.scaleLinear()
            .domain([4, d3.max(stateData, d => d.healthcare)])
            .range([height, 0]);

        


}

    















d3.csv("data.csv").then(function(stateData) {

    stateData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
    });

    var xLinearScale = d3.scaleLinear()
      .domain([8, d3.max(stateData, d => d.poverty)])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([4, d3.max(stateData, d => d.healthcare)])
      .range([height, 0]);

    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    
    var circlesGroup = chartGroup.selectAll("circle")
      .data(stateData)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d.poverty))
      .attr("cy", d => yLinearScale(d.healthcare))
      .attr("r", "15")
      .attr("fill", "dodgerblue")
      .attr("opacity", ".50")
      .attr("stroke","blue")
      .attr("stroke-width", 2);
      

    var circleLabels = chartGroup.selectAll(null)
        .data(stateData)
        .enter()
        .append("text")
        .attr("x", d => xLinearScale(d.poverty))
        .attr("y", d => yLinearScale(d.healthcare))
        .text(d => d.abbr)
        .attr("font-size", "11px")
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .attr("fill", "white");

    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([10, -10])
        .html(function(d) {
            return (`${d.state}<br>Poverty: ${d.poverty}<br>Healthcare: ${d.healthcare}`);
        });

    chartGroup.call(toolTip);

    circlesGroup.on("mouseover", function(data) {
        toolTip.show(data, this);
    })

        .on("mouseout", function(data, index) {
            toolTip.hide(data);
        });
 

     var axisLabels = chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Lacks Healthcare %");


     var chartTitle = chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("In Poverty %");
  }).catch(function(error) {
    console.log(error);




});


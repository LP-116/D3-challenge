
var svgWidth = 960;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 40,
    bottom: 100,
    left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";

var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);


var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

function xScale(stateData, chosenXAxis) {

    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(stateData, d => d[chosenXAxis]) * 0.8,
        d3.max(stateData, d => d[chosenXAxis]) * 1.2])
      .range([0, width]);

    return xLinearScale;
}

function yScale(stateData, chosenYAxis) {

    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(stateData, d => d[chosenYAxis]) * 0.8,
        d3.max(stateData, d => d[chosenYAxis]) * 1.2])
      .range([0, height]);

    return yLinearScale;
}

function renderAxis(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);
    
    return xAxis;
}

function renderYAxis(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);

    yAxis.transition()
        .duration(1000)
        .call(leftAxis);
    
    return yAxis;
}

function renderCircles(circlesGroup, newXScale, newYScale, chosenXAxis, chosenYAxis) {

    circlesGroup.transition()
        .duration(1000)
        .attr("cx",  d => newXScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]));

    return circlesGroup;
}

function renderLabels(circleLabels, newXScale, newYScale, chosenXAxis, chosenYAxis) {

    circleLabels.transition()
        .duration(1000)
        .attr("dx",  d => newXScale(d[chosenXAxis]));
        .attr("dy",  d => newXScale(d[chosenYAxis]));

    return circleLabels;

}



function updateToolTip(chosenXAxis, circlesGroup) {

    var label;

    if (chosenXAxis === "poverty") {
        label = "Poverty";
    }

    else if (chosenXAxis === "age") {
        label = "Age";
    }

    else {
        label = "Household Income"
    }

    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([0, 0])
        .html(function(d) {return (`${d.state}<br>${label}: ${d[chosenXAxis]} <br>Healthcare: ${d.healthcare}`);
    });

    circlesGroup.call(toolTip);

    circlesGroup.on("mouseover", function(data) {
        toolTip.show(data, this);
    })

        .on("mouseout", function(data) {
            toolTip.hide(data);
        });

    return circlesGroup;
}

d3.csv("data.csv").then(function(stateData, err) {

    if (err) throw err;

        stateData.forEach(function(data) {
            data.poverty = +data.poverty;
            data.healthcare = +data.healthcare;
            data.age = +data.age;
            data.income = +data.income;
        });

        var xLinearScale = xScale(stateData, chosenXAxis)

        var yLinearScale = d3.scaleLinear()
            .domain([4, d3.max(stateData, d => d.healthcare)])
            .range([height, 0]);

        var bottomAxis = d3.axisBottom(xLinearScale);
        var leftAxis = d3.axisLeft(yLinearScale);
        
        var xAxis = chartGroup.append("g")
            .classed("x-axis", true)
            .attr("transform", `translate(0, ${height})`)
            .call(bottomAxis);

        var yAxis = chartGroup.append("g")
            .call(leftAxis);

        var circleLabels = chartGroup.selectAll(null)
            .data(stateData)
            .enter()
            .append("text")
            .attr("dx", d => xLinearScale(d[chosenXAxis]))
            .attr("dy", d => yLinearScale(d.healthcare))
            .text(d => d.abbr)
            .attr("font-size", "11px")
            .attr("text-anchor", "middle")
            .attr("alignment-baseline", "middle")
            .attr("fill", "black");

        var circlesGroup = chartGroup.selectAll("circle")
            .data(stateData)
            .enter()
            .append("circle")
            .attr("cx", d => xLinearScale(d[chosenXAxis]))
            .attr("cy", d => yLinearScale(d.healthcare))
            .attr("r", "15")
            .attr("fill", "dodgerblue")
            .attr("opacity", ".50")
            .attr("stroke","blue")
            .attr("stroke-width", 2);
            
      

        var labelsGroup = chartGroup.append("g")
            .attr("transform", `translate(${width /2}, ${height + 20})`);

        var povertyLabel = labelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 20)
            .attr("value", "poverty")
            .classed("active", true)
            .text("In Poverty (%)");

        var ageLabel = labelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 40)
            .attr("value", "age")
            .classed("inactive", true)
            .text("Age (Median)");
        
        var incomeLabel = labelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 60)
            .attr("value", "income")
            .classed("inactive", true)
            .text("Household Income (Median)");

       chartGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .classed("axis-text", true)
            .text("Healthcare comparisons");

        var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

        labelsGroup.selectAll("text")
            .on("click", function() {

                var value = d3.select(this).attr("value");
                if (value !== chosenXAxis) {

                    chosenXAxis = value;

                    xLinearScale = xScale(stateData, chosenXAxis);

                    xAxis = renderAxis(xLinearScale, xAxis);

                    circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

                    circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

                    circleLabels = renderLabels(circleLabels, xLinearScale, chosenXAxis);                   

                    if (chosenXAxis === "age") {
                        ageLabel
                            .classed("active", true)
                            .classed("inactive", false);
                        povertyLabel
                            .classed("active", false)
                            .classed("inactive", true);
                        incomeLabel
                            .classed("active", false)
                            .classed("inactive", true);
                    }
                    
                    else if (chosenXAxis === "income") {
                        ageLabel
                            .classed("active", false)
                            .classed("inactive", true);
                        povertyLabel
                            .classed("active", false)
                            .classed("inactive", true);
                        incomeLabel
                            .classed("active", true)
                            .classed("inactive", false);
                    }

                    else {
                        ageLabel
                            .classed("active", false)
                            .classed("inactive", true);
                        povertyLabel
                            .classed("active", true)
                            .classed("inactive", false);
                        incomeLabel
                            .classed("active", false)
                            .classed("inactive", true);

                     }
      
                }
            });
        }).catch(function(error) {
            console.log(error);
        });
           

    















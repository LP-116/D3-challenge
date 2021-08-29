
var svgWidth = 1100;
var svgHeight = 600;

var margin = {
    top: 20,
    right: 40,
    bottom: 100,
    left: 90
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
      .range([height, 2]);

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

function renderCircles(circlesGroup, newXScale, chosenXAxis) {

    circlesGroup.transition()
        .duration(1000)
        .attr("cx",  d => newXScale(d[chosenXAxis]));

    return circlesGroup;
}

function renderLabels(circleLabels, newXScale, chosenXAxis) {

    circleLabels.transition()
        .duration(1000)
        .attr("dx",  d => newXScale(d[chosenXAxis]));

    return circleLabels;

}

function renderYCircles(circlesGroup, newYScale, chosenYAxis) {

    circlesGroup.transition()
        .duration(1000)
        .attr("cy",  d => newYScale(d[chosenYAxis]));

    return circlesGroup;
}

function renderYLabels(circleLabels, newYScale, chosenYAxis) {

    circleLabels.transition()
        .duration(1000)
        .attr("dy",  d => newYScale(d[chosenYAxis]));

    return circleLabels;

}


function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

    var label;

    if (chosenXAxis === "poverty") {
        label = "Poverty",
        value = (chosenXAxis + "%");
    }

    else if (chosenXAxis === "age") {
        label = "Age";
    }

    else {
        label = "Household Income"
    }

    var ylabel;

    if (chosenYAxis === "healthcare") {
        ylabel = "Healthcare";
    }

    else if (chosenYAxis === "smokes") {
        ylabel = "Smokes";
    }

    else {
        ylabel = "Obese"
    }


    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([0, 0])
        .html(function(d) {

            if (chosenXAxis === "income") {
                return (`${d.state}<br>${label}: ${d[chosenXAxis]} <br>${ylabel}: ${d[chosenYAxis]}`);}
            
            else {
            return (`${d.state}<br>${label}: ${d[chosenXAxis]}% <br>${ylabel}: ${d[chosenYAxis]}%`);}
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
            data.smokes = +data.smokes
            data.obesity = +data.obesity;
        });

        var xLinearScale = xScale(stateData, chosenXAxis);

        var yLinearScale = yScale(stateData, chosenYAxis);

        var bottomAxis = d3.axisBottom(xLinearScale);
        var leftAxis = d3.axisLeft(yLinearScale);
        
        var xAxis = chartGroup.append("g")
            .classed("x-axis", true)
            .attr("transform", `translate(0, ${height})`)
            .call(bottomAxis);

        var yAxis = chartGroup.append("g")
            .classed("y-axis", true)
            .call(leftAxis);

        var circleLabels = chartGroup.selectAll(null)
            .data(stateData)
            .enter()
            .append("text")
            .attr("dx", d => xLinearScale(d[chosenXAxis]))
            .attr("dy", d => yLinearScale(d[chosenYAxis]))
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
            .attr("cy", d => yLinearScale(d[chosenYAxis]))
            .attr("r", "12")
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

        var ylabelsGroup = chartGroup.append("g")
            .attr("transform", "rotate(-90)")
            .attr("dy", "1em")


        var healthcareLabel = ylabelsGroup.append("text")
            .attr("y", 0 - margin.left + 55)
            .attr("x", 0 - (height / 2))
            .attr("yvalue", "healthcare")
            .classed("active", true)
            .text("Lacks Healthcare %");

        var smokesLabel = ylabelsGroup.append("text")
            .attr("y", 0 - margin.left + 35)
            .attr("x", 0 - (height / 2))
            .attr("yvalue", "smokes")
            .classed("inactive", true)
            .text("Smokes %");
        
        var obesityLabel = ylabelsGroup.append("text")
            .attr("y", 0 - margin.left + 15)
            .attr("x", 0 - (height / 2))
            .attr("yvalue", "obesity")
            .classed("inactive", true)
            .text("Obesity %");


        var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

        labelsGroup.selectAll("text")
            .on("click", function() {

                var value = d3.select(this).attr("value");
        
                if (value !== chosenXAxis) {

                    chosenXAxis = value;

                    xLinearScale = xScale(stateData, chosenXAxis);

                    xAxis = renderAxis(xLinearScale, xAxis);

                    circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

                    circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

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

            ylabelsGroup.selectAll("text")
            .on("click", function() {

                var yvalue = d3.select(this).attr("yvalue");
        
                if (yvalue !== chosenYAxis) {

                    chosenYAxis = yvalue;

                    yLinearScale = yScale(stateData, chosenYAxis);

                    yAxis = renderYAxis(yLinearScale, yAxis);

                    circlesGroup = renderYCircles(circlesGroup, yLinearScale, chosenYAxis);

                    circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

                    circleLabels = renderYLabels(circleLabels, yLinearScale, chosenYAxis);                   

                    if (chosenYAxis === "smokes") {
                        smokesLabel
                            .classed("active", true)
                            .classed("inactive", false);
                        healthcareLabel
                            .classed("active", false)
                            .classed("inactive", true);
                        obesityLabel
                            .classed("active", false)
                            .classed("inactive", true);
                    }
                    
                    else if (chosenYAxis === "obesity") {
                        smokesLabel
                            .classed("active", false)
                            .classed("inactive", true);
                        healthcareLabel
                            .classed("active", false)
                            .classed("inactive", true);
                        obesityLabel
                            .classed("active", true)
                            .classed("inactive", false);
                    }

                    else {
                        smokesLabel
                            .classed("active", false)
                            .classed("inactive", true);
                        healthcareLabel
                            .classed("active", true)
                            .classed("inactive", false);
                        obesityLabel
                            .classed("active", false)
                            .classed("inactive", true);

                     }     
      
                }

            });


        }).catch(function(error) {
            console.log(error);
        });
           

    















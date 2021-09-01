
// Setting svg dimensions and layout on page.
var svgWidth = 1000;
var svgHeight = 600;

var margin = {
    top: 20,
    right: 40,
    bottom: 100,
    left: 90
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Setting the start x and y axis.
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";

// Selecting area in html and appending svg.
var svg = d3
    .select("#scatter")
    .append("svg")
    .classed("graph", true)
    .attr("width", svgWidth)
    .attr("height", svgHeight);


// Adding the chartgroup.
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);


// Functions are defined.

// Function for updating x-scale upon click on axis label.
function xScale(stateData, chosenXAxis) {

    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(stateData, d => d[chosenXAxis]) * 0.8,
        d3.max(stateData, d => d[chosenXAxis]) * 1.1])
      .range([0, width]);

    return xLinearScale;
}

// Function for updating y-scale upon click on axis label.
function yScale(stateData, chosenYAxis) {

    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(stateData, d => d[chosenYAxis]) * 0.8,
        d3.max(stateData, d => d[chosenYAxis]) * 1.1])
      .range([height, 2]);

    return yLinearScale;
}

// Function for updating xAxis upon click on axis label.
function renderAxis(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);
    
    return xAxis;
}

// Function for updating yAxis upon click on axis label.
function renderYAxis(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);

    yAxis.transition()
        .duration(1000)
        .call(leftAxis);
    
    return yAxis;
}

// Function for updating circles group with new parameters upon click on X axis label.
function renderCircles(circlesGroup, newXScale, chosenXAxis) {

    circlesGroup.transition()
        .duration(1000)
        .attr("cx",  d => newXScale(d[chosenXAxis]));

    return circlesGroup;
}

// Function for updating circle Lables upon click on X axis label.
function renderLabels(circleLabels, newXScale, chosenXAxis) {

    circleLabels.transition()
        .duration(1000)
        .attr("dx",  d => newXScale(d[chosenXAxis]));

    return circleLabels;

}

// Function for updating circles group with new parameters upon click on Y axis label.
function renderYCircles(circlesGroup, newYScale, chosenYAxis) {

    circlesGroup.transition()
        .duration(1000)
        .attr("cy",  d => newYScale(d[chosenYAxis]));

    return circlesGroup;
}

// Function for updating circle Lables upon click on Y axis label.
function renderYLabels(circleLabels, newYScale, chosenYAxis) {

    circleLabels.transition()
        .duration(1000)
        .attr("dy",  d => newYScale(d[chosenYAxis]));

    return circleLabels;

}

// Function for updating circles group with new tooltip.
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

            // Changes the popup formatting depending on selection (i.e.income has a $, poverty has % on both axis selection, age has % only on one axis.)
            if (chosenXAxis === "poverty") {
                return (`<u><b>${d.state}</b></u><br>${label}: ${d[chosenXAxis]}% <br>${ylabel}: ${d[chosenYAxis]}%`);}
            
            else if (chosenXAxis === "income") {
                return (`<u><b>${d.state}</b></u><br>${label}: $${d[chosenXAxis]} <br>${ylabel}: ${d[chosenYAxis]}%`);}

            else {
            return (`<u><b>${d.state}</b></u><br>${label}: ${d[chosenXAxis]} <br>${ylabel}: ${d[chosenYAxis]}%`);}
    });

    circlesGroup.call(toolTip);

    circlesGroup.on("mouseover", function(data) {
        d3.select(this)
        .attr("stroke", "blueviolet")
        .attr("stroke-width", 3)
        
        toolTip.show(data, this);
     
    })

        .on("mouseout", function(data) {

            d3.select(this)
            .attr("stroke","blue")
            .attr("stroke-width", 2)
            toolTip.hide(data);
        });

    return circlesGroup;
}

// Retrieving data for the CSV file.
d3.csv("data.csv").then(function(stateData, err) {

    if (err) throw err;

        // Parse data.
        stateData.forEach(function(data) {
            data.poverty = +data.poverty;
            data.healthcare = +data.healthcare;
            data.age = +data.age;
            data.income = +data.income;
            data.smokes = +data.smokes
            data.obesity = +data.obesity;
        });

        // Using the xScale function to define xlinearscale.
        var xLinearScale = xScale(stateData, chosenXAxis);

        // Using the yScale function to define ylinearscale.
        var yLinearScale = yScale(stateData, chosenYAxis);

        // The initial axis functions.
        var bottomAxis = d3.axisBottom(xLinearScale);
        var leftAxis = d3.axisLeft(yLinearScale);
        
        // Appending the xAxis.
        var xAxis = chartGroup.append("g")
            .classed("x-axis", true)
            .attr("transform", `translate(0, ${height})`)
            .call(bottomAxis);

        // Appending the yAxis
        var yAxis = chartGroup.append("g")
            .classed("y-axis", true)
            .call(leftAxis);

        // Appending initial circle labels (note this is done before the circles so tooltip hover works better).
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


        // Appending initial circles.
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
            .attr("stroke-width", 2)
            .on("mouseover", function() {
                d3.select(this)
                    .attr("stroke", "black")
                    .attr("stroke-width", 1);
            })
            .on("mouseout", function() {
                d3.select(this)
                    .attr("stroke","blue");
              
            })

            
        // Creating group for xlabels.
        var labelsGroup = chartGroup.append("g")
            .attr("transform", `translate(${width /2}, ${height + 20})`);

        // Adding the 3 x-axis labels.
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

        // Creating group for ylabels.
        var ylabelsGroup = chartGroup.append("g")
            .attr("transform", "rotate(-90)")
            .attr("dy", "1em")

        // Adding the 3 y-axis labels.
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

        // Running the updateToolTip function.
        var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

        // x-axis event listener.
        labelsGroup.selectAll("text")
            .on("click", function() {

                // Getting the value of the selection.
                var value = d3.select(this).attr("value");
        
                if (value !== chosenXAxis) {

                    // Making the chosenXAxis the new value.
                    chosenXAxis = value;

                    // Running the functions at the beginning on the script to update with the chosenXAxis.
                    xLinearScale = xScale(stateData, chosenXAxis);

                    xAxis = renderAxis(xLinearScale, xAxis);

                    circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

                    circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

                    circleLabels = renderLabels(circleLabels, xLinearScale, chosenXAxis);                   

                    // Changing text to bold depending on selection.
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

            // y-axis event listener.
            ylabelsGroup.selectAll("text")
            .on("click", function() {

                // Getting the y value of the selection.
                var yvalue = d3.select(this).attr("yvalue");
                
                if (yvalue !== chosenYAxis) {

                    // Making the chosenYAxis the new value.
                    chosenYAxis = yvalue;

                    // Running the functions at the beginning on the script to update with the chosenYAxis.
                    yLinearScale = yScale(stateData, chosenYAxis);

                    yAxis = renderYAxis(yLinearScale, yAxis);

                    circlesGroup = renderYCircles(circlesGroup, yLinearScale, chosenYAxis);

                    circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

                    circleLabels = renderYLabels(circleLabels, yLinearScale, chosenYAxis);                   

                    // Changing text to bold depending on selection.
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
           

    




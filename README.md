# D3 Challenge
## Data Journalism and D3
## To view the interactive graph click [here](https://lp-116.github.io/D3-challenge/)

---
### Task

In this scenario, we are working for a metro paper in a data visualisation position and we are tasked with analysing the current trends shaping people's lives.
The dataset given is from the US Census Bureau and we will be looking at 6 different categories:
* Poverty (%)
* Age (%)
* Household Income 
* Lacks Healthcare (%)
* Smokes (%)
* Obesity (%)

Our task is to create an interactive scatterplot with click events so that users can decide which data to display. 
A d3 tool tip also needs to be incorporated to show point data upon hover.

---
### Method

There are 9 functions used to complete this task, each function is called when an axis selection is made.
The functions are below:
* function xScale - returns the xlinear scale
* function yScale - returns the yLinear scale
* function renderAxis - used for updating the x-axis
* function renderYAxix - used for updating the y-axis
* function renderCircles - updating the circles with the new parameters upon click of the xAxis
* function renderLabels - updates the circle labels with the new parameters upon click of the xAxis
* function renderYCircles - updating the circles with the new parameters upon click of the yAxis
* function renderYLabels - updates the circle labels with the new parameters upon click of the yAxis
* function updateToolTip - which updates the tooltip icon upon each click. 

In the updateToolTip function an event listener is used to create a coloured border around each circle when the user hovers over it.
Once the user hovers off the circle it reverts back to it's original state.

The code starts by setting the svg dimensions and layout on the page and then the chart area in the html is selected and an svg is appended.
The chart group is then added to the svg.

The data.csv file is retrieved using d3.csv and then defining 1 function which includes all code needed to generate the scatterplot. 
Firstly the data required gets changed into an integer format. Then the xlinearscale and ylinearscale is declared (using functions explained above) and the initial bottom and left axis's are set up. The x and y axis's are then appended.

The circles are then set up firstly by creating the labels and then by creating the actual circle. It is important to overlay them this way so that the d3tip access is easier (this way the circle is on top of the text and the d3.tip looks for the circle - if the text was on top of the circle, the d3.tip won't work when hovering on the text and leaves minimal room for the tip to find circle area).

Labels for each axis are then created.

The tooltip function is then called and updated.

An event listener is then created for the x-axis and y-axis.
The event listenser defines that on each click the variables get updated based upon which axis is selected.

Each function is called and updated with the new axis and the axis option that the user selected turns to a bold font.

The HTML and CSS page was also formatted to give a professional view of the data.

---
### Results

Scatterplot was generated successfully with all axis's functional. The webpage has been deployed on Github and can be accessed [here](https://lp-116.github.io/D3-challenge/)

<img src="https://user-images.githubusercontent.com/82348616/131609510-efe44005-f9f1-419d-bfcb-06859014fd23.png" width="700">


#### Data insights:

People with lower income seem to have a higher lack of healthcare percentage and the highest lack of healthcare percentage is 15.1% in income above $57,000. 
The results also seem to indicate a higher rate of smoking and obesity in lower household income areas.

The age results are not very diverse when comparing to the lacks healthcare percentage range and therefore a correlation between age and lack of healthcare cannot be determined.

There could potentially be a correlation between the poverty percentage and lack of healthcare. 
Looking at the results a higher poverty percentage returns a higher lack of health care percentage however more analysis would be required before confirming the correlation.


Smoking and obesity seem to have a similar pattern when comparing to the age variable. The results are very similar for each state.

Location and age does not seem to have an impact on smoking or obesity.

---
### Files

In the main branch of this repository there is an assets folder.
The assets folder contains:
* A css file which contains the formatting for the HTML page.
* A data folder which contains the dataset.
* An images folder which contains the newspaper logo used in the design of the HTML page.
* A js folder which contains the app.js file (the code) and another copy of the data.csv file (for easy access).


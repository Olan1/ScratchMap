// Charting function
function charting(colorData) {
    // Assign color values to constants
    const gold = 1,
        green = 2.5,
        turquoise = 10,
        blue = 18,
        purple = 36,
        red = 55;

    // Declare counter variables
    var home = 0,
        notVisited = 0,
        visited = 0,
        resided = 0,
        willVisit = 0,
        willNotVisit = 0;

    // Assign values to chart data:
    // Make array from data file object keys
    let values = Object.keys(colorData);
    // Iterate through array
    var regionValues = values.map(value => {
        // If the country color is gold
        if (colorData[value] == gold) {
            // Count + 1
            notVisited += 1;
        }
        // If the country color is green
        else if (colorData[value] == green) {
            // Count + 1
            home += 1;
        }
        // If the country color is turquoise
        else if (colorData[value] == turquoise) {
            // Count + 1
            resided += 1;
        }
        // If the country color is blue
        else if (colorData[value] == blue) {
            // Count + 1
            visited += 1;
        }
        // If the country color is purple
        else if (colorData[value] == purple) {
            // Count + 1
            willVisit += 1;
        }
        // If the country color is red
        else if (colorData[value] == red) {
            // Count + 1
            willNotVisit += 1;
        }
        // Chart 1 data -   Individual Stats
        var allCountryStatus = [
            // Chart1:   Status,         Value:  Percentage out of every country
            { "chart1": "Not Visited", "value": countryPercentage(notVisited) },
            { "chart1": "Resided", "value": countryPercentage(resided) },
            { "chart1": "Visited", "value": countryPercentage(visited) },
            { "chart1": "Will Visit", "value": countryPercentage(willVisit) },
            { "chart1": "Won't Visit", "value": countryPercentage(willNotVisit) },
        ];
        // Chart 2 data -   Been vs Not Been
        var beenNotStatus = [
            // Chart2:   Status, Value:  Percentage out of every country
            { "chart2": "Been", "value": countryPercentage(resided + visited + home) },
            { "chart2": "Not Been", "value": countryPercentage(notVisited + willVisit + willNotVisit) }
        ];
        //Chart 3 data  -   Visited vs Want to Visit
        var wantNotStatus = [
            { "chart3": "Visited", "value": ((resided + visited + home) / (resided + visited + home + willVisit)) * 100 },
            { "chart3": "Want to Visit", "value": ((willVisit) / (resided + visited + home + willVisit)) * 100 }
        ];

        return [allCountryStatus, beenNotStatus, wantNotStatus];
    });

    // Pass data through crossfilter
    var ndx1 = crossfilter(regionValues[194][0]),
        ndx2 = crossfilter(regionValues[194][1]),
        ndx3 = crossfilter(regionValues[194][2]);

    /*Map domain values to colors*/
    var allColors = d3.scale.ordinal()
        .domain(["Not Visited", "Resided", "Visited", "Will Visit", "Won't Visit"])
        .range(["#c5b358", "#29c290", "#1fb0ea", "#707095", "#a7445b"]);

    /*Map domain values to colors*/
    var beenNotColors = d3.scale.ordinal()
        .domain(["Been", "Not Been"])
        .range(["#1fb0ea", "#c5b358"]);

    /*Map domain values to colors*/
    var wantNotColors = d3.scale.ordinal()
        .domain(["Visited", "Want to Visit"])
        .range(["#1fb0ea", "#707095"]);

    // Chart 1  -   Individual Stats
    chart(ndx1, 'chart1', 'value', allColors, '#allBarChart');

    // Chart 2  -   Been vs Not Been
    chart(ndx2, 'chart2', 'value', beenNotColors, '#been-not-barChart');

    // Chart 3  -   Visited vs Will Visit
    chart(ndx3, 'chart3', 'value', wantNotColors, '#want-not-barChart');

    // Render call charts
    dc.renderAll();
}

// Chart function
function chart(ndx, chart, val, colors, targetDiv) {
    // X dimensions
    var options_dim = ndx.dimension(dc.pluck(chart));
    // Y dimensions
    var status_dim = options_dim.group().reduceSum(dc.pluck(val));
    // Display values to 1 decimal place
    var numFormat = d3.format('0.1f');
    // Render chart
    dc.barChart(targetDiv)
        .width(350)
        .height(200)
        .margins({ top: 10, right: 50, bottom: 30, left: 25 })
        .dimension(options_dim)
        .group(status_dim)
        .transitionDuration(500)
        .colorAccessor(function(d) {
            return d.key;
        })
        .colors(colors)
        .title(function(d) {
            return numFormat(d.value) + " % ± 0.5 %";
        })
        .x(d3.scale.ordinal())
        .y(d3.scale.linear().domain([0, 100]))
        .xUnits(dc.units.ordinal)
        .yAxisLabel("%")
        .yAxis().ticks(4);
}

// Calculate percentage out of every country
function countryPercentage(numerator) {
    return (numerator / 195) * 100;
}

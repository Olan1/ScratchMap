// Charting function
function charting(colorData) {
    // Declare count variables
    var home = 0,
        notVisited = 0,
        visited = 0,
        resided = 0,
        willVisit = 0,
        willNotVisit = 0;

    // Assign values to chart data
    let values = Object.keys(colorData);
    var regionValues = values.map(value => {
        if (colorData[value] == 1) {
            // Count + 1
            notVisited += 1;
        }
        else if (colorData[value] == 2.5) {
            home += 1;
        }
        else if (colorData[value] == 10) {
            resided += 1;
        }
        else if (colorData[value] == 18) {
            visited += 1;
        }
        else if (colorData[value] == 36) {
            willVisit += 1;
        }
        else if (colorData[value] == 55) {
            willNotVisit += 1;
        }
        // Chart 1 data
        var allCountryStatus = [
            { "chart1": "Not Visited", "value": countryPercentage(notVisited) },
            { "chart1": "Resided", "value": countryPercentage(resided) },
            { "chart1": "Visited", "value": countryPercentage(visited) },
            { "chart1": "Will Visit", "value": countryPercentage(willVisit) },
            { "chart1": "Won't Visit", "value": countryPercentage(willNotVisit) },
        ];
        // Chart 2 data
        var beenNotStatus = [
            { "chart2": "Been", "value": countryPercentage(resided + visited + home) },
            { "chart2": "Not Been", "value": countryPercentage(notVisited + willVisit + willNotVisit) }
        ];
        //Chart 3 data
        var wantNotStatus = [
            { "chart3": "Visited", "value": ((resided + visited + home) / (resided + visited + home + willVisit)) * 100 },
            { "chart3": "Want To Visit", "value": ((willVisit) / (resided + visited + home + willVisit)) * 100 }
        ];

        return [allCountryStatus, beenNotStatus, wantNotStatus];
    });

    var ndx1 = crossfilter(regionValues[194][0]);
    var ndx2 = crossfilter(regionValues[194][1]);
    var ndx3 = crossfilter(regionValues[194][2]);

    /*Map domain values to range values*/
    var allColors = d3.scale.ordinal()
        .domain(["Not Visited", "Resided", "Visited", "Will Visit", "Won't Visit"])
        .range(["#c5b358", "#29c290", "#1fb0ea", "#707095", "#a7445b"]);

    var beenNotColors = d3.scale.ordinal()
        .domain(["Been", "Not Been"])
        .range(["#1fb0ea", "#c5b358"]);

    var wantNotColors = d3.scale.ordinal()
        .domain(["Visited", "Want To Visit"])
        .range(["#1fb0ea", "#707095"]);

    // Chart 1
    chart(ndx1, 'chart1', 'value', allColors, '#allBarChart');

    // Chart 2
    chart(ndx2, 'chart2', 'value', beenNotColors, '#been-not-barChart');

    // Chart 3
    chart(ndx3, 'chart3', 'value', wantNotColors, '#want-not-barChart');

    dc.renderAll();
}

// Chart function
function chart(ndx, chart, val, colors, targetDiv) {
    var options_dim = ndx.dimension(dc.pluck(chart));
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

// Calculate percentage
function countryPercentage(numerator) {
    return (numerator / 195) * 100;
}

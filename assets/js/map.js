$(document).ready(function() {

    // Load data
    $.getJSON('assets/data/data.json', function(data) { // Source: http://jvectormap.com/examples/france-elections/
        // Assign data to variable
        var colorData;
        if (window.localStorage.getItem("localData")) {
            colorData = JSON.parse(window.localStorage.getItem('localData'));
        }
        else {
            colorData = data.data.color;
        }

        // Draw map
        map(colorData);

        // Draw bar charts
        charting(colorData);

        // Generate initial board bubbles (if any)
        boardBubble(colorData);

        // Draw map function
        function map(data) {
            $('#map').vectorMap({
                map: 'world_mill',
                container: $('#map'),
                backgroundColor: "#343a40",
                zoomMax: 100,
                series: {
                    regions: [{
                        values: colorData,
                        scale: ['#c5b358', '#3bd80d', '#1cb2ed', '#fe0000'],
                        normalizeFunction: 'polynomial'
                    }]
                },
                onRegionClick: function(event, code) {
                    var map = $('#map').vectorMap('get', 'mapObject'); // Source: https://stackoverflow.com/questions/36035810/want-to-get-region-name-from-drill-down-map-of-jvectormap
                    var name = map.getRegionName(code);
                    mapModal(code, name);
                }
            });
        }

        // Modal Function
        function mapModal(regionCode, regionName) { //Based on modal from https://www.w3schools.com/howto/howto_css_modals.asp
            $("#myModal").fadeIn(500);

            $('.headerSpan').append().html(`<h1 id="modalHeader">${regionName}</h1>`);

            $(".closeModal").click(function() {
                closeModal();
            });

            $("#closeBtn").click(function() {
                closeModal();
            });

            // Close modal when click event occurs outside of modal content
            $(window).click(function(event) {
                if ($(event.target).is('#myModal')) {
                    closeModal();
                }
            });

            // Call modal button click events function
            modalBtnClick(regionCode, regionName);
        }

        // Close modal function
        function closeModal() {
            $("#myModal").fadeOut(500);
        }

        // Modal button click events function
        function modalBtnClick(regionCode, regionName) {
            $('#home').off('click').on('click', function() {
                Object.keys(colorData).forEach(function(item) { // Source: https://gomakethings.com/the-es6-way-to-loop-through-objects-with-vanilla-javascript/
                    if (colorData[item] == 2.5) { // Green
                        colorData[item] = 1; // Gold
                    }
                });
                colorData[regionCode] = 2.5; // Green
                redrawMap();
                // Redraw charts with updated data
                charting(colorData);
                // Save colorData locally
                saveData(colorData);
            });

            $('#resided').off('click').on('click', function() {
                colorData[regionCode] = 10; // Turquoise
                redrawMap();
                charting(colorData);
                saveData(colorData);
            });

            $('#visited').off('click').on('click', function() {
                colorData[regionCode] = 18; // Blue
                redrawMap();
                charting(colorData);
                saveData(colorData);
            });

            $('#not-visited').off('click').on('click', function() {
                colorData[regionCode] = 1; //Gold
                redrawMap();
                charting(colorData);
                saveData(colorData);
            });

            $('#plan-to-visit').off('click').on('click', function() {
                colorData[regionCode] = 36; // Purple
                redrawMap();
                charting(colorData);
                saveData(colorData);
            });

            $('#will-not-visit').off('click').on('click', function() {
                colorData[regionCode] = 55; // Red
                redrawMap();
                charting(colorData);
                saveData(colorData);
            });

            $('#resetBtn').off('click').on('click', function() {
                // Reset data - Clears map, board and charts
                reset();
                redrawMap();
                charting(colorData);
                saveData(colorData);
            });
        }

        // Redraw map function
        function redrawMap() {
            $("#map").vectorMap('get', 'mapObject').remove(); // Source: https://stackoverflow.com/questions/31868444/jvectormap-change-refresh-map-with-new-reference-map
            map(colorData);
            boardBubble(colorData);
            closeModal();
        }

        // Add countries to board function
        async function boardBubble(data) {
            $(".listItem").remove();
            let values = Object.keys(data);
            values.map(value => {
                if (data[value] == 2.5) {
                    $('#homeBoard').children("ul").append(`<li class="listItem"><div class="board-bubble home" id="${value}"><span class="bubble-text">${value}</span></div></li>`);
                }
                else if (data[value] == 10) {
                    $('#livedInBoard').children("ul").append(`<li class="listItem"><div class="board-bubble resided" id="${value}"><span class="bubble-text">${value}</span></div></li>`);
                }
                else if (data[value] == 18) {
                    $('#visitedBoard').children("ul").append(`<li class="listItem"><div class="board-bubble visited" id="${value}"><span class="bubble-text">${value}</span></div></li>`);
                }
                else if (data[value] == 36) {
                    $('#wantToVisitBoard').children("ul").append(`<li class="listItem"><div class="board-bubble wantToVisit" id="${value}"><span class="bubble-text">${value}</span></div></li>`);
                }
                else if (data[value] == 55) {
                    $('#willNotVisitBoard').children("ul").append(`<li class="listItem"><div class="board-bubble willNotVisit" id="${value}"><span class="bubble-text">${value}</span></div></li>`);
                }
            });
        }

        // Reset data function - Clears map, board and charts
        function reset() {
            let values = Object.keys(colorData); // Source: https://medium.com/backticks-tildes/iterating-through-javascript-objects-5-techniques-and-performance-tests-42b4a222a92b
            values.map(value => {
                colorData[value] = 1;
            });
            colorData["UNDEFINED"] = 100;
            $(".listItem").remove();
        }

        // Charting function
        function charting(colorData) {
            var home = 0;
            var notVisited = 0;
            var visited = 0;
            var resided = 0;
            var willVisit = 0;
            var willNotVisit = 0;

            // Assign values to chart data
            let values = Object.keys(colorData);
            var regionValues = values.map(value => {
                if (colorData[value] == 100) {
                    var undef = 100;
                }
                else if (colorData[value] == 1) {
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
                    { "chart1": "Not Visited", "value": (notVisited / 195) * 100 },
                    { "chart1": "Resided", "value": (resided / 195) * 100 },
                    { "chart1": "Visited", "value": (visited / 195) * 100 },
                    { "chart1": "Will Visit", "value": (willVisit / 195) * 100 },
                    { "chart1": "Won't Visit", "value": (willNotVisit / 195) * 100 },
                ];
                // Chart 2 data
                var beenNotStatus = [
                    { "chart2": "Been", "value": ((resided + visited + home) / 195) * 100 },
                    { "chart2": "Not Been", "value": ((notVisited + willVisit + willNotVisit) / 195) * 100 }
                ];
                //Chart 3 data
                var wantNotStatus = [
                    { "chart3": "Visited", "value": ((resided + visited + home) / 195) * 100 },
                    { "chart3": "Will Visit", "value": ((notVisited + willVisit - willNotVisit) / 195) * 100 }
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
                .domain(["Visited", "Will Visit"])
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

        // Save data to local storage function
        function saveData(data) {
            if (window.localStorage) {
                window.localStorage.setItem(
                    'localData',
                    JSON.stringify(data)
                );
            }
        }
    });
});

$(document).ready(function() {

    // Load JSON data
    $.getJSON('assets/data/data.json', function(data) { // Source: http://jvectormap.com/examples/france-elections/
        // Assign color values
        var colorData = data.data.color;

        // Draw map
        map(colorData);

        // Draw bar chart
        charting(colorData);

        // Draw map function
        function map(data) {
            $('#map').vectorMap({
                map: 'world_mill',
                container: $('#map'),
                backgroundColor: "#343a40",
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
            // Display modal
            $("#myModal").fadeIn(500);

            $("#modalHeader").text(regionName);

            // When the user clicks on <span> (x), close the modal
            $(".closeModal").click(function() {
                closeModal();
            });

            // When user clicks button, close modal
            $("#closeBtn").click(function() {
                closeModal();
            });

            // When the user clicks anywhere outside of the modal content, close it
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

        // Modal button click events
        function modalBtnClick(regionCode, regionName) {
            $('#home').off('click').on('click', function() {
                Object.keys(colorData).forEach(function(item) { // Source: https://gomakethings.com/the-es6-way-to-loop-through-objects-with-vanilla-javascript/
                    if (colorData[item] == 2.5) {
                        colorData[item] = 1; // Gold
                    }
                });
                boardBubble('#home', '#homeBoard', regionName, 'home', regionCode);
                colorData[regionCode] = 2.5; // Green
                redrawMap();
                charting(colorData);
            });

            $('#resided').off('click').on('click', function() {
                boardBubble('#resided', '#livedInBoard', regionName, 'resided', regionCode);
                colorData[regionCode] = 10; // Turquoise
                redrawMap();
                charting(colorData);
            });

            $('#visited').off('click').on('click', function() {
                boardBubble('#visited', '#visitedBoard', regionName, 'visited', regionCode);
                colorData[regionCode] = 18; // Blue
                redrawMap();
                charting(colorData);
            });

            $('#not-visited').off('click').on('click', function() {
                boardBubble('#not-visited', 'targetBoard', regionName, 'colorClass', regionCode);
                colorData[regionCode] = 1; //Gold
                redrawMap();
                charting(colorData);
            });

            $('#plan-to-visit').off('click').on('click', function() {
                boardBubble('#plan-to-visit', '#wantToVisitBoard', regionName, 'wantToVisit', regionCode);
                colorData[regionCode] = 36; // Purple
                redrawMap();
                charting(colorData);
            });

            $('#will-not-visit').off('click').on('click', function() {
                boardBubble('#will-not-visit', '#willNotVisitBoard', regionName, 'willNotVisit', regionCode);
                colorData[regionCode] = 55; // Red
                redrawMap();
                charting(colorData);
            });

            $('#resetBtn').off('click').on('click', function() {
                reset();
                redrawMap();
                charting(colorData);
            });
        }

        // Redraw map function
        function redrawMap() {
            $("#map").vectorMap('get', 'mapObject').remove(); // Source: https://stackoverflow.com/questions/31868444/jvectormap-change-refresh-map-with-new-reference-map
            map(colorData);
            closeModal();
        }

        // Add countries to board function
        function boardBubble(targetBtn, targetBoard, regionName, colorClass, regionCode) {

            if (targetBtn == '#home') {
                $(targetBoard).find("li").first().remove();
            }
            $("li").each(function() {
                if ($(this).children("div").attr("id") == regionCode) {
                    $(this).remove();
                }
            });

            var bubble = `<li><div class="board-bubble ${colorClass}" id="${regionCode}"><span class="bubble-text">${regionName}</span></div></li>`;

            if (targetBtn != '#not-visited') {
                $(targetBoard).children("ul").append(bubble);
            }
        }

        // Reset map and board function
        function reset() {
            let values = Object.keys(colorData); // Source: https://medium.com/backticks-tildes/iterating-through-javascript-objects-5-techniques-and-performance-tests-42b4a222a92b
            values.map(value => {
                colorData[value] = 1;
            });
            colorData["UNDEFINED"] = 100;
            $("li").remove();
        }

        // Charting function
        function charting(colorData) {
            let values = Object.keys(colorData);
            var home = 0;
            var notVisited = 0;
            var visited = 0;
            var resided = 0;
            var willVisit = 0;
            var willNotVisit = 0;

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
                var allCountryStatus = [
                    { "chart1": "Not Visited", "value": (notVisited / 195) * 100 },
                    { "chart1": "Resided", "value": (resided / 195) * 100 },
                    { "chart1": "Visited", "value": (visited / 195) * 100 },
                    { "chart1": "Will Visit", "value": (willVisit / 195) * 100 },
                    { "chart1": "Won't Visit", "value": (willNotVisit / 195) * 100 },
                ];

                var beenNotStatus = [
                    { "chart2": "Been", "value": ((resided + visited + home) / 195) * 100 },
                    { "chart2": "Not Been", "value": ((notVisited + willVisit + willNotVisit) / 195) * 100 }
                ];

                var wantNotStatus = [
                    { "chart3": "Been", "value": ((resided + visited + home) / 195) * 100 },
                    { "chart3": "Will Visit", "value": ((notVisited + willVisit - willNotVisit) / 195) * 100 }
                ];

                return [allCountryStatus, beenNotStatus, wantNotStatus];
            });

            var ndx1 = crossfilter(regionValues[194][0]);
            var ndx2 = crossfilter(regionValues[194][1]);
            var ndx3 = crossfilter(regionValues[194][2]);

            var allColors = d3.scale.ordinal() /*Map domain values to range values*/
                .domain(["Not Visited", "Resided", "Visited", "Will Visit", "Won't Visit"])
                .range(["#c5b358", "#29c290", "#1fb0ea", "#707095", "#a7445b"]);

            var beenNotColors = d3.scale.ordinal() /*Map domain values to range values*/
                .domain(["Been", "Not Been"])
                .range(["#1fb0ea", "#c5b358"]);

            var wantNotColors = d3.scale.ordinal() /*Map domain values to range values*/
                .domain(["Been", "Will Visit"])
                .range(["#1fb0ea", "#707095"]);

            // Chart 1
            chart(ndx1, 'chart1', 'value', allColors, '#allBarChart');

            // Chart 2
            chart(ndx2, 'chart2', 'value', allColors, '#been-not-barChart');

            // Chart 3
            chart(ndx3, 'chart3', 'value', allColors, '#want-not-barChart');

            dc.renderAll();
        }

        // Chart function
        function chart(ndx, chart, val, colors, targetDiv) {
            var options_dim = ndx.dimension(dc.pluck(chart));
            var status_dim = options_dim.group().reduceSum(dc.pluck(val));

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
                .x(d3.scale.ordinal())
                .y(d3.scale.linear().domain([0, 100]))
                .xUnits(dc.units.ordinal)
                .yAxisLabel("%")
                .yAxis().ticks(4);
        }
    });
});

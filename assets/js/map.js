$(document).ready(function() {

    // Load JSON data
    $.getJSON('assets/data/data.json', function(data) { // Source: http://jvectormap.com/examples/france-elections/
        // Assign color values
        var colorData = data.data.color;

        // Call draw map function
        map(colorData);

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
            });

            $('#resided').off('click').on('click', function() {
                boardBubble('#resided', '#livedInBoard', regionName, 'resided', regionCode);
                colorData[regionCode] = 10; // Turquoise
                redrawMap();
            });

            $('#visited').off('click').on('click', function() {
                boardBubble('#visited', '#visitedBoard', regionName, 'visited', regionCode);
                colorData[regionCode] = 18; // Blue
                redrawMap();
            });

            $('#not-visited').off('click').on('click', function() {
                boardBubble('#not-visited', 'targetBoard', regionName, 'colorClass', regionCode);
                colorData[regionCode] = 1; //Gold
                redrawMap();
            });

            $('#plan-to-visit').off('click').on('click', function() {
                boardBubble('#plan-to-visit', '#wantToVisitBoard', regionName, 'wantToVisit', regionCode);
                colorData[regionCode] = 36; // Purple
                redrawMap();
            });

            $('#will-not-visit').off('click').on('click', function() {
                boardBubble('#will-not-visit', '#willNotVisitBoard', regionName, 'willNotVisit', regionCode);
                colorData[regionCode] = 55; // Red
                redrawMap();
            });

            $('#resetBtn').off('click').on('click', function() {
                reset();
                redrawMap();
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
            let values = Object.keys(colorData);    // Source: https://medium.com/backticks-tildes/iterating-through-javascript-objects-5-techniques-and-performance-tests-42b4a222a92b
            values.map(value => {
                colorData[value] = 1;
            });
            colorData["UNDEFINED"] = 100;
            $("li").remove();
        }
    });
});

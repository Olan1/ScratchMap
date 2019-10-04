$(document).ready(function() {

    // Load data
    $.getJSON('assets/data/data.json', function(data) { // Source: http://jvectormap.com/examples/france-elections/
        $.getJSON('assets/data/country-list.json', function(countryListData) {
            // Declare and assign data to variables
            var colorData;
            const countryData = countryListData;
            // Assign color values to constants
            const gold = 1,
                green = 2.5,
                turquoise = 10,
                blue = 18,
                purple = 36,
                red = 55;
            // If map data is stored locally, use local data
            if (window.localStorage.getItem("localData")) {
                colorData = JSON.parse(window.localStorage.getItem('localData'));
            }
            // Else use loaded data
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
                    // Map type
                    map: 'world_mill',
                    // Target div container
                    container: $('#map'),
                    // Background color is dark grey
                    backgroundColor: "#343a40",
                    // Set zoom level
                    zoomMax: 100,
                    series: {
                        regions: [{
                            // Scale values assigned from colorData values
                            values: data,
                            // Color scale linked to scale values
                            scale: ['#c5b358', '#3bd80d', '#1cb2ed', '#fe0000'],
                            normalizeFunction: 'polynomial'
                        }]
                    },
                    // When a country is clicked:
                    onRegionClick: function(event, code) {
                        // Get map object
                        var mapObj = $('#map').vectorMap('get', 'mapObject'), // Source: https://stackoverflow.com/questions/36035810/want-to-get-region-name-from-drill-down-map-of-jvectormap
                            // Get country name
                            name = mapObj.getRegionName(code);
                        // Call modal function
                        mapModal(code, name);
                    }
                });
            }

            // Modal Function
            function mapModal(regionCode, regionName) { //Based on modal from https://www.w3schools.com/howto/howto_css_modals.asp
                // Modal appears
                $("#myModal").fadeIn(500);
                // Add clicked country name as modal title
                $('.headerSpan').append().html(`<h1 id="modalHeader">${regionName}</h1>`);
                // Close modal on click
                $(".closeModal").click(function() {
                    closeModal();
                });
                // Close modal on click
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
                // Home button clicked
                modalClickEvent('#home', regionCode, green);
                // Resided button clicked
                modalClickEvent('#resided', regionCode, turquoise);
                // Visited button clicked
                modalClickEvent('#visited', regionCode, blue);
                // Not Visited button clicked
                modalClickEvent('#not-visited', regionCode, gold);
                // Will Visit button clicked
                modalClickEvent('#plan-to-visit', regionCode, purple);
                // Won't Visit button clicked
                modalClickEvent('#will-not-visit', regionCode, red);
                // Reset Map button clicked
                modalClickEvent('#resetBtn', regionCode);
            }

            // Modal click event function
            function modalClickEvent(id, regionCode, color) {
                // Button click event
                $(id).off('click').on('click', function() {
                    // If Home button clicked
                    if (id == '#home') {
                        // Loop through colorData
                        Object.keys(colorData).forEach(function(item) { // Source: https://gomakethings.com/the-es6-way-to-loop-through-objects-with-vanilla-javascript/
                            // If the color is green, change it to gold
                            if (colorData[item] == green) {
                                colorData[item] = gold;
                            }
                        });
                        // Assign a new color to the clicked country
                        colorData[regionCode] = color;
                    }
                    // Else if the Reset Map button is clicked, reset the map
                    else if (id == '#resetBtn') {
                        reset();
                    }
                    else {
                        // Assign a new color to the clicked country
                        colorData[regionCode] = color;
                    }
                    // Redraw map with updated color values
                    redrawMap();
                    // Redraw charts with updated data
                    charting(colorData);
                    // Save colorData in local storage
                    saveData(colorData);
                });
            }

            // Redraw map function
            function redrawMap() {
                // Remove current map
                $("#map").vectorMap('get', 'mapObject').remove(); // Source: https://stackoverflow.com/questions/31868444/jvectormap-change-refresh-map-with-new-reference-map
                // Draw map with updated data
                map(colorData);
                // Generate board bubbles
                boardBubble(colorData);
                closeModal();
            }

            // Get country function
            function getCountry(code) {
                // Iterate through countryData file
                for (var i = 0; i < countryData.length; i++) {
                    // If the countryData country id matches the provided country id:
                    if (countryData[i]["code"] == code) {
                        // Return the countries name matching the id
                        return countryData[i]["name"];
                    }
                }
            }

            // Add countries to board function
            function boardBubble(data) {
                // Remove all board bubbles
                $(".listItem").remove();
                // Make array from data file object keys
                let keys = Object.keys(data);
                // Iterate through array
                keys.map(value => {
                    // Retrieve name value
                    var name = getCountry(value);
                    // If the array color is green:
                    if (data[value] == green) {
                        // Append a board bubble to the Home board
                        $('#homeBoard').children("ul").append(`<li class="listItem"><div class="board-bubble home" id="${value}"><span class="bubble-text">${name}</span></div></li>`);
                    }
                    // If the array color is turquoise:
                    else if (data[value] == turquoise) {
                        // Append a board bubble to the Resided board
                        $('#livedInBoard').children("ul").append(`<li class="listItem"><div class="board-bubble resided" id="${value}"><span class="bubble-text">${name}</span></div></li>`);
                    }
                    // If the array color is blue:
                    else if (data[value] == blue) {
                        // Append a board bubble to the Visited board
                        $('#visitedBoard').children("ul").append(`<li class="listItem"><div class="board-bubble visited" id="${value}"><span class="bubble-text">${name}</span></div></li>`);
                    }
                    // If the array color is purple:
                    else if (data[value] == purple) {
                        // Append a board bubble to the Will Visit board
                        $('#wantToVisitBoard').children("ul").append(`<li class="listItem"><div class="board-bubble wantToVisit" id="${value}"><span class="bubble-text">${name}</span></div></li>`);
                    }
                    // If the array color is red:
                    else if (data[value] == red) {
                        // Append a board bubble to the Won't Visit board
                        $('#willNotVisitBoard').children("ul").append(`<li class="listItem"><div class="board-bubble willNotVisit" id="${value}"><span class="bubble-text">${name}</span></div></li>`);
                    }
                });
            }

            // Reset data function - Clears map, board and charts
            function reset() {
                // Make array from data file object keys 
                let values = Object.keys(colorData); // Source: https://medium.com/backticks-tildes/iterating-through-javascript-objects-5-techniques-and-performance-tests-42b4a222a92b
                // Iterate through array
                values.map(value => {
                    // Turn all countries gold
                    colorData[value] = gold;
                });
                // Keep 'UNDEFINED' = 100 in colorData to maintain map color scale
                colorData["UNDEFINED"] = 100;
                // Remove all board bubbles from board section
                $(".listItem").remove();
            }

            // Save data to local storage function
            function saveData(data) {
                // If local storage is available
                if (window.localStorage) {
                    // Save data locally and assign to key: "localData"
                    window.localStorage.setItem(
                        'localData',
                        JSON.stringify(data)
                    );
                }
            }
        });
    });
});

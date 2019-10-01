$(document).ready(function() {

    // Load json data function
    async function getData(fileLocation) {
        // Return a new promise.
        return new Promise(function(resolve, reject) { // Source: https://developers.google.com/web/fundamentals/primers/promises
            var req = new XMLHttpRequest();
            req.open('GET', fileLocation);

            req.onload = function() {
                if (req.status == 200) {
                    resolve(req.response);
                }
                else {
                    reject(Error("Unable to read file"));
                }
            };
            req.send();
        });
    }

    // Assign data to variable
    var colorData;
    if (window.localStorage.getItem("localData")) {
        colorData = JSON.parse(window.localStorage.getItem('localData'));
    }
    else {
        colorData = getData('assets/data/data.json');
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

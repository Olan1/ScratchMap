$(document).ready(function() {
    $.getJSON('assets/data/data.json', function(data) { // Source: http://jvectormap.com/examples/france-elections/
        var colorData = data.data;


        $(function() {
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
                        mapModal(code);
                    }
                });
            }

            // Modal Function
            function mapModal(regionCode) { //Based on modal from https://www.w3schools.com/howto/howto_css_modals.asp
                // Display modal
                $("#myModal").fadeIn(500);

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
                modalBtnClick(regionCode);
            }

            // Close modal function
            function closeModal() {
                $("#myModal").fadeOut(500);
            }

            // Modal button click events
            function modalBtnClick(regionCode) {
                $('#home').off('click').on('click', function() {
                    Object.keys(colorData).forEach(function(item) { // Source: https://gomakethings.com/the-es6-way-to-loop-through-objects-with-vanilla-javascript/
                        if (colorData[item] == 2.5) {
                            colorData[item] = 1; // Gold
                        }
                    });
                    colorData[regionCode] = 2.5; // Green
                    redrawMap();
                });

                $('#resided').off('click').on('click', function() {
                    colorData[regionCode] = 10; // Turquoise
                    redrawMap();
                });

                $('#visited').off('click').on('click', function() {
                    colorData[regionCode] = 18; // Blue
                    redrawMap();
                });

                $('#not-visited').off('click').on('click', function() {
                    colorData[regionCode] = 1; //Gold
                    redrawMap();
                });

                $('#plan-to-visit').off('click').on('click', function() {
                    colorData[regionCode] = 36; // Purple
                    redrawMap();
                });

                $('#will-not-visit').off('click').on('click', function() {
                    colorData[regionCode] = 55; // Red
                    redrawMap();
                });
            }

            // Redraw map function
            function redrawMap() {
                $("#map").vectorMap('get', 'mapObject').remove(); // Source: https://stackoverflow.com/questions/31868444/jvectormap-change-refresh-map-with-new-reference-map
                map(colorData);
                closeModal();
            }

        });
    });
});

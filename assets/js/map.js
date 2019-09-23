$(document).ready(function() {

    $(function() {
        var map = new jvm.Map({
            map: 'world_mill',
            container: $('#map'),
            backgroundColor: 'rgb(52,58,64)',

            regionStyle: {
                initial: {
                    fill: 'rgb(197, 179, 88)'
                }
            },

            onRegionClick: function(event, code) {
                var targetCountry = map.getRegionName(code);
                console.log(targetCountry);
                console.log(code);
                mapModal();
            }

        });
        // Store selected regions locally
        map.setSelectedRegions(JSON.parse(window.localStorage.getItem('jvectormap-selected-regions') || '[]'));
    });


    // Modal Function
    function mapModal() { //Based on: https://www.w3schools.com/howto/howto_css_modals.asp
        // Display modal
        $("#myModal").fadeIn(500);

        $('#visited').click(function() {
            closeModal();
        });

        $('#not-visited').click(function() {
            closeModal();
        });

        $('#plan-to-visit').click(function() {
            closeModal();
        });

        $('#will-not-visit').click(function() {
            closeModal();
        });

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
    }

    // Close modal function
    function closeModal() {
        $("#myModal").fadeOut(500);
    }
});

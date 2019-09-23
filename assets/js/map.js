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
            }

        });
        // Store selected regions locally
        map.setSelectedRegions(JSON.parse(window.localStorage.getItem('jvectormap-selected-regions') || '[]'));
    });

});

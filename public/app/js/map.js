function initMap() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            curLat = position.coords.latitude;
            curLong = position.coords.longitude;
        });
    }

    function reInit() {
        $.ajax({
            url: "http://127.0.0.1:3000/api/disease/all",
            method: "GET",
            headers: {
                "x-access-token": window.localStorage.getItem('token')
            },
            processData: false,
            success: function(res) {
                var data = res;
                var locations = [];
                var counter = 0;

                data.forEach(function(disease, key) {
                    var toPush = [];
                    toPush[0] = "<b>Poultry Name: </b> " + disease.poultryname + "<br/>" +
                        "<b>Poultry Address: </b>" + disease.poultryaddress + "<br/>" +
                        "<b>Disease: </b>" + disease.disease;
                    toPush[1] = JSON.parse(disease.location[1]);
                    toPush[2] = JSON.parse(disease.location[0]);
                    toPush[3] = key + 1;
                    locations.push(toPush);
                });

                console.log(curLat + "-" + curLong);
                var map = new google.maps.Map(document.getElementById('map'), {
                    zoom: 10,
                    center: new google.maps.LatLng(curLat, curLong),
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                });

                var infowindow = new google.maps.InfoWindow();

                var marker, i;

                for (i = 0; i < locations.length; i++) {
                    marker = new google.maps.Marker({
                        position: new google.maps.LatLng(locations[i][1], locations[i][2]),
                        map: map
                    });

                    google.maps.event.addListener(marker, 'click', (function(marker, i) {
                        return function() {
                            infowindow.setContent(locations[i][0]);
                            infowindow.open(map, marker);
                        }
                    })(marker, i));
                }
            },
            error: function(err) {
                console.log(err);
            }
        });
    }

    var reInitInterval = setInterval(function() {
        try {
            var elem = document.getElementById('map');
            if (elem) {
                clearInterval(reInitInterval);
                reInit();
            }
        } catch (err) {}
    }, 1000);
}
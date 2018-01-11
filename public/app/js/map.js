function initMap() {
    var curLat = 13.764;
    var curLong = 121.055;
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            curLat = position.coords.latitude;
            curLong = position.coords.longitude;
            console.log(curLat + " " + curLong);
        }, function(err) {
            console.log(err);
        });
    }

    function reInit() {
        $.ajax({
            url: "http://172.104.161.220:3000/api/disease/all",
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
                        "<b>Poultry Owner: </b>" + disease.poultryowner + "<br/>" +
                        "<b>Disease: </b>" + disease.disease;
                    toPush[1] = JSON.parse(disease.location[1]);
                    toPush[2] = JSON.parse(disease.location[0]);
                    toPush[3] = key + 1;
                    locations.push(toPush);
                });
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
                $('input[name=disease]').on('change', function() {
                    var ds = $(this).val();
                    var postdata = { disease: ds };
                    $.ajax({
                        url: "http://172.104.161.220:3000/api/disease/query",
                        method: "POST",
                        data: postdata,
                        headers: {
                            "x-access-token": window.localStorage.getItem('token')
                        },
                        success: function(res) {
                            var data = res;
                            var locations = [];
                            var counter = 0;

                            data.forEach(function(disease, key) {
                                var toPush = [];
                                toPush[0] = "<b>Poultry Name: </b> " + disease.poultryname + "<br/>" +
                                    "<b>Poultry Address: </b>" + disease.poultryaddress + "<br/>" +
                                    "<b>Poultry Owner: </b>" + disease.poultryowner + "<br/>" +
                                    "<b>Disease: </b>" + disease.disease;
                                toPush[1] = JSON.parse(disease.location[1]);
                                toPush[2] = JSON.parse(disease.location[0]);
                                toPush[3] = key + 1;
                                locations.push(toPush);
                            });
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

                });
            }
        } catch (err) {}
    }, 1000);
}
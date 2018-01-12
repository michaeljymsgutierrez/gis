var addCtrl = angular.module('addCtrl', ['geolocation', 'gservice']);
addCtrl.controller('addCtrl', function($scope, $http, $rootScope, geolocation, gservice) {

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
        jQuery.ajax({
            url: "http://api.animal-surveillance.com:3000/api/disease/all",
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
        try {
            var elem = document.getElementById('map');
            if (elem) {
                jQuery('input[name=disease]').on('change', function() {
                    var ds = jQuery(this).val();
                    var postdata = { disease: ds };
                    jQuery.ajax({
                        url: "http://api.animal-surveillance.com:3000/api/disease/query",
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
    }
    initMap();

    $scope.options = {
        legend: {
            display: true,
            position: 'left'
        }
    };
    $scope.labels = ["New Castle Disease", "Infectious laryngotracheitis (ILT)", "Infectious bursal disease, IBD", "Infectious bronchitis", "Mycoplasma gallisepticum", "Infectious coryza", "Coccidiosis", "Marek’s Disease", "Fowl cholera"];
    $scope.data = [0, 0, 0, 0, 0, 0, 0, 0, 0];

    var url = "http://api.animal-surveillance.com:3000/api/disease/summary";
    $http.get(url, {
        headers: { "x-access-token": window.localStorage.getItem('token') }
    }).then(function(res) {
        var summaryCount = res.data;
        $scope.data[0] = ((summaryCount.d1 / summaryCount.total) * 100).toFixed(2);
        $scope.data[1] = ((summaryCount.d2 / summaryCount.total) * 100).toFixed(2);
        $scope.data[2] = ((summaryCount.d3 / summaryCount.total) * 100).toFixed(2);
        $scope.data[3] = ((summaryCount.d4 / summaryCount.total) * 100).toFixed(2);
        $scope.data[4] = ((summaryCount.d5 / summaryCount.total) * 100).toFixed(2);
        $scope.data[5] = ((summaryCount.d6 / summaryCount.total) * 100).toFixed(2);
        $scope.data[6] = ((summaryCount.d7 / summaryCount.total) * 100).toFixed(2);
        $scope.data[7] = ((summaryCount.d8 / summaryCount.total) * 100).toFixed(2);
        $scope.data[8] = ((summaryCount.d9 / summaryCount.total) * 100).toFixed(2);
    }, function(err) {
        console.log(err);
    });

    $scope.formData = {};
    var coords = {};
    var lat = 0;
    var long = 0;

    $scope.createUser = function() {
        var lat = jQuery('input#latitude').val();
        var long = jQuery('input#longitude').val();
        var pa = jQuery('input#poultryaddress').val();

        var userData = {
            poultryname: $scope.formData.poultryname,
            poultryowner: $scope.formData.poultryowner,
            disease: $scope.formData.disease,
            poultryaddress: pa,
            location: [long, lat]
        };

        var host = "http://api.animal-surveillance.com:3000";
        var url = host + "/api/disease";

        $http.post(url, userData)
            .success(function(data) {
                $scope.formData.poultryname = "";
                $scope.formData.poultryowner = "";
                $scope.formData.poultryaddress = "";
                $scope.formData.disease = "";
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };
});
// Creates the addCtrl Module and Controller. Note that it depends on 'geolocation' and 'gservice' modules.
var addCtrl = angular.module('addCtrl', ['geolocation', 'gservice']);
addCtrl.controller('addCtrl', function($scope, $http, $rootScope, geolocation, gservice) {

    $scope.labels = ["New Castle Disease", "Infectious laryngotracheitis (ILT)", "Infectious bursal disease, IBD", "Infectious bronchitis", "Mycoplasma gallisepticum", "Infectious coryza", "Coccidiosis", "Marek’s Disease", "Fowl cholera"];
    $scope.data = [0, 0, 0, 0, 0, 0, 0, 0, 0];

    var url = "http://127.0.0.1:3000/api/disease/summary";
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
    // Initializes Variables
    // ----------------------------------------------------------------------------
    $scope.formData = {};
    var coords = {};
    var lat = 0;
    var long = 0;

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var mysrclat = position.coords.latitude;
            var mysrclong = position.coords.longitude;
            $scope.formData.longitude = mysrclong;
            $scope.formData.latitude = mysrclat;
        });
    }

    // Get User's actual coordinates based on HTML5 at window load
    geolocation.getLocation().then(function(data) {

        // Set the latitude and longitude equal to the HTML5 coordinates
        coords = { lat: data.coords.latitude, long: data.coords.longitude };

        // Display coordinates in location textboxes rounded to three decimal points
        $scope.formData.longitude = coords.long;
        $scope.formData.latitude = coords.lat;

        // Display message confirming that the coordinates verified.
        // $scope.formData.htmlverified = "Yep (Thanks for giving us real data!)";

        gservice.refresh($scope.formData.latitude, $scope.formData.longitude);

    });

    // Functions
    // ----------------------------------------------------------------------------

    // Get coordinates based on mouse click. When a click event is detected....
    $rootScope.$on("clicked", function() {

        // Run the gservice functions associated with identifying coordinates
        $scope.$apply(function() {
            $scope.formData.latitude = parseFloat(gservice.clickLat).toFixed(3);
            $scope.formData.longitude = parseFloat(gservice.clickLong).toFixed(3);
            // $scope.formData.htmlverified = "Nope (Thanks for spamming my map...)";
        });
    });

    // Function for refreshing the HTML5 verified location (used by refresh button)
    $scope.refreshLoc = function() {
        geolocation.getLocation().then(function(data) {
            coords = { lat: data.coords.latitude, long: data.coords.longitude };

            $scope.formData.longitude = coords.long;
            $scope.formData.latitude = coords.lat;
            // $scope.formData.htmlverified = "Yep (Thanks for giving us real data!)";
            gservice.refresh(coords.lat, coords.long);
        });
    };

    // Creates a new user based on the form fields
    $scope.createUser = function() {

        // Grabs all of the text box fields
        var userData = {
            poultryname: $scope.formData.poultryname,
            poultryowner: $scope.formData.poultryowner,
            disease: $scope.formData.disease,
            poultryaddress: $scope.formData.poultryaddress,
            location: [$scope.formData.longitude, $scope.formData.latitude]
        };

        var host = "http://127.0.0.1:3000";
        var url = host + "/api/disease";
        // Saves the user data to the db
        $http.post(url, userData)
            .success(function(data) {

                // Once complete, clear the form (except location)
                $scope.formData.poultryname = "";
                $scope.formData.poultryowner = "";
                $scope.formData.poultryaddress = "";
                $scope.formData.disease = "";

                // Refresh the map with new data
                gservice.refresh($scope.formData.latitude, $scope.formData.longitude);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };
});
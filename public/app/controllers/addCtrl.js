// Creates the addCtrl Module and Controller. Note that it depends on 'geolocation' and 'gservice' modules.
var addCtrl = angular.module('addCtrl', ['geolocation', 'gservice']);
addCtrl.controller('addCtrl', function($scope, $http, $rootScope, geolocation, gservice) {

    $scope.labels = ["Download Sales", "In-Store Sales", "Mail-Order Sales", "Tele Sales", "Corporate Sales"];
    $scope.data = [300, 500, 100, 40, 120];

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
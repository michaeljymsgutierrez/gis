var addCtrl = angular.module('addCtrl', ['geolocation', 'gservice']);
addCtrl.controller('addCtrl', function($scope, $http, $rootScope, geolocation, gservice) {

    $scope.options = {
        legend: {
            display: true,
            position: 'left'
        }
    };
    $scope.labels = ["New Castle Disease", "Infectious laryngotracheitis (ILT)", "Infectious bursal disease, IBD", "Infectious bronchitis", "Mycoplasma gallisepticum", "Infectious coryza", "Coccidiosis", "Marek’s Disease", "Fowl cholera"];
    $scope.data = [0, 0, 0, 0, 0, 0, 0, 0, 0];

    var url = "http://45.56.73.235:3000/api/disease/summary";
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

        var host = "http://45.56.73.235:3000";
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
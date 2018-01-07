angular.module('userApp', ['appRoutes', 'userControllers', 'userServices', 'ngAnimate', 'mainController', 'authServices', 'emailController', 'managementController', 'addCtrl', 'queryCtrl', 'headerCtrl', 'geolocation', 'gservice', 'chart.js'])

.config(function($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptors');
});
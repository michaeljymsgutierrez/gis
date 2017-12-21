angular.module('userApp', ['appRoutes', 'userControllers', 'userServices', 'ngAnimate', 'mainController', 'authServices', 'emailController', 'managementController','addCtrl', 'queryCtrl', 'headerCtrl', 'geolocation', 'gservice'])

.config(function($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptors');
});

angular.module('userServices', [])

.factory('User', function($http) {
    var userFactory = {}; // Create the userFactory object
    var host = "http://127.0.0.1:3000";
    // Register users in database
    userFactory.create = function(regData) {
        var url = host + '/api/users';
        return $http.post(url, regData);
    };

    // Check if username is available at registration
    userFactory.checkUsername = function(regData) {
        var url = host + '/api/checkusername';
        return $http.post(url, regData);
    };

    // Check if e-mail is available at registration
    userFactory.checkEmail = function(regData) {
        var url = host + '/api/checkemail';
        return $http.post(url, regData);
    };

    // Activate user account with e-mail link
    userFactory.activateAccount = function(token) {
        return $http.put('/api/activate/' + token);
    };

    // Check credentials before re-sending activation link
    userFactory.checkCredentials = function(loginData) {
        return $http.post('/api/resend', loginData);
    };

    // Send new activation link to user
    userFactory.resendLink = function(username) {
        return $http.put('/api/resend', username);
    };

    // Send user's username to e-mail
    userFactory.sendUsername = function(userData) {
        return $http.get('/api/resetusername/' + userData);
    };

    // Send password reset link to user's e-mail
    userFactory.sendPassword = function(resetData) {
        var host = "http://127.0.0.1:3000";
        var url = host+ '/api/resetpassword';
        return $http.put(url, resetData);
    };

    // Grab user's information from e-mail reset link
    userFactory.resetUser = function(token) {
        return $http.get('/api/resetpassword/' + token);
    };

    // Save user's new password
    userFactory.savePassword = function(regData) {
        return $http.put('/api/savepassword', regData);
    };

    // Provide the user with a new token
    userFactory.renewSession = function(username) {
        return $http.get('/api/renewToken/' + username);
    };

    // Get the current user's permission
    userFactory.getPermission = function() {
        var host = "http://127.0.0.1:3000";
        var url = host + '/api/permission/';
        return $http.get(url);
    };

    // Get all the users from database
    userFactory.getUsers = function() {
        var host = "http://127.0.0.1:3000";
        var url = host + '/api/management/';
        return $http.get(url);
    };

    // Get user to then edit
    userFactory.getUser = function(id) {
        var host = "http://127.0.0.1:3000";
        var url = host + '/api/edit/';
        return $http.get(url + id);
    };

    // Delete a user
    userFactory.deleteUser = function(username) {
        var host = "http://127.0.0.1:3000";
        var url = host + '/api/management/';
        return $http.delete(url + username);
    };

    // Edit a user
    userFactory.editUser = function(id) {
        var host = "http://127.0.0.1:3000";
        var url = host + '/api/edit';
        return $http.put(url, id);
    };

    return userFactory; // Return userFactory object
});
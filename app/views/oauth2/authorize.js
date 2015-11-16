define(['app'], function(app) { //jshint ignore:line

	return ['$scope', '$http', '$browser', '$window', '$location', 'user', function ($scope, $http, $browser, $window, $location, user) {

		$scope.scope= $location.search().scope||'';

		var redirect_uri = $location.search().redirect_uri||'';

    //============================================================
    //
    //
    //============================================================
		this.authorizeClient= function () {

				var client_id    = $location.search().client_id||'';
        var redirect_uri = $location.search().redirect_uri||'';

        var credentials = { 'client_id': client_id , 'redirect_uri': redirect_uri , request_type:'code' };

        return $http.post('/api/v2015/user/authorizations/'+client_id+'/code', credentials);
    };

	//============================================================
    //
    //
    //============================================================
    this.clearErrors = function () {

        $scope.isError = false;
        $scope.error = null;
    };


    //============================================================
    //
    //
    //============================================================
    $scope.authorize = function () {
        var client_id    = $location.search().client_id||'';
        var redirect_uri = $location.search().redirect_uri||'';
        var state        = $location.search().state||'';
				//var scope        = $location.search().scope||'';
				var rOwnerAuthenticated   = user.isAuthenticated;

				if(rOwnerAuthenticated) {
							self.authorizeClient.then(function onsuccess(success) {// jshint ignore:line

					        $window.location.href = redirect_uri + '?code=' + success.data.code+ '&state=' + encodeURIComponent(state);

							}, function onerror(error) {
									$scope.errorInvalid = error.status == 403;
									$scope.errorTimeout = error.status != 403;
							});
					} else {
							alert('unauthorized redirect_uri');
					}

        authorized = authorized || (client_id=='12345' && redirect_uri=='http://192.168.1.68/moodle/auth/googleoauth2/scbd_redirect.php');



        //$window.location.href = 'http://localhost:3010/oauth2/authorize/?client_id='+client_id+'&redirect_uri='+redirect_uri+'&scope=all';
    };

    if(user.isAuthenticated)
        this.authorize();
}];

});

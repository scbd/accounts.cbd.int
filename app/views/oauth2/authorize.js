define(['app'], function(app) { //jshint ignore:line

	return ['$scope', '$http', '$browser', '$window', '$location', 'user', function ($scope, $http, $browser, $window, $location, user) {

		$scope.scope			= $location.search().scope||'';
    $scope.scopeArray	= ['First Name', 'Last Name','Email','Account ID'];
		var redirect_uri = $location.search().redirect_uri||'';

    //============================================================
    //
    //
    //============================================================
		this.authorizeClient= function () {

				var client_id =$scope.client_id= $location.search().client_id||'';

				if($('#myModal').hasClass('in')) // if modal is popped
					var credentials = { 'client_id': client_id , 'redirect_uri': redirect_uri , request_type:'code', 'scope':$scope.scope };
				else
        	var credentials = { 'client_id': client_id , 'redirect_uri': redirect_uri , request_type:'client_auth_exists', 'scope':$scope.scope };//jshint ignore:line

        return $http.post('/api/v2015/user-agent-oa2/authorizations/'+client_id+'/code', credentials); //jshint ignore:line
    };



    //============================================================
    //$('#myModal').hasClass('in');
    //
    //============================================================
    $scope.authorize = function () {

				var state        = $location.search().state||'';
				var rOwnerAuthenticated   = user.isAuthenticated;

				if(rOwnerAuthenticated) {
							self.authorizeClient().then(function onsuccess(success) {// jshint ignore:line
									$window.location.href = redirect_uri + '?code=' + success.data.code+ '&state=' + encodeURIComponent(state);
							}, function onerror(error) { //jshint ignore:line
//need to send
									if($('#myModal').hasClass('in')){//if modal is poped and client not authorized even after resource owner grants auth ie. bad redirect url or client id
											alert('bad client id or redirect url');
											$window.location.href = redirect_uri + '?error=unauthorized_client';//as per RFC

									}else { console.log('should be opening modal');
										$( document ).ready( function() {
												$( '#myModal' ).modal( 'toggle' );
										});
									}

							});
			 }// if(rOwnerAuthenticated)
    };// scope.authorize

	}];//return

});// define

function UsersController ($rootScope, $scope, authHttp, $route, $location) {

    if(!$rootScope.user.isAuthenticated) {  //navigation.securize();
        $location.path('/signin');
        return;
    }

    if(!_.contains($rootScope.user.roles, "Administrator")) {  //navigation.securize();
        $location.path('/help/403');
        return;
    }

	 authHttp.get('/api/v2013/roles', { cache: true }).then(function (response) { 
		var map = {};
		response.data.forEach(function (role) {
			map[role.roleId] = role;
		});
		$scope.roles = map; 
	});

	function populate () {
		authHttp.get('/api/v2013/users', { params: { q: $scope.freetext, sk: $scope.currentPage*25, l: 25 } }).then(function (response) {
			$scope.users =  response.data;
		});
	};

	function setPage (page) {
		$scope.currentPage = Math.max(0, Math.min($scope.pageCount-1, page|0));
	};

	//============================================================
	//
	//
	//============================================================
	$scope.actionDelete = function actionDelete (userID) {
		
		if (confirm('Are you sure you want to delete this user account?')) {

			authHttp.delete('/api/v2013/users/' + userID).success(function (data, status, headers, config) {
				alert('The user account has been deleted.');
	        }).error(function (data, status, headers, config) {
    	    	alert(data);
        	});
	    }
	}

    $scope.pageCount = 4;
    $scope.pages = [0, 1, 2, 3];
    $scope.currentPage = 0;

    $scope.actionSetPage = setPage;

	$scope.$watch('freetext', populate);
	$scope.$watch('currentPage', populate);
}
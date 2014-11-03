function UsersController ($rootScope, $scope, authHttp, $route, $location, $filter) {

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

	authHttp.get('/api/v2013/countries', { cache: true }).then(function (response) {
		var map = {};
		response.data.forEach(function (country) {
			country.name = country.name.en;
			map[country.code] = country;
		});

		map["EUR"] = map["EU"];//patch BCH

		$scope.countries = map;
    $scope.countriesList=[];
    $filter('orderBy')(response.data, 'name.en').forEach(function (country) {

          $scope.countriesList.push({ code : country.code.toLowerCase(), name: country.name });
    });
	});

  authHttp.get("/api/v2013/roles", { cache: true }).then(function(response) {
      $scope.roleList = [];
      $filter('orderBy')(response.data, 'name').forEach(function (o) {
                            $scope.roleList.push({ roleId : o.roleId, name: o.name });
                        });

  });

	function populate () {
		authHttp.get('/api/v2013/users', { params: { q: $scope.freetext, sk: $scope.currentPage*25, l: 25 ,
                                                  government : $scope.government, role: $scope.roleFilter} })
            .then(function (response) {
          			$scope.users = response.data;
          			$scope.users.forEach(function (user) { if(user.government) user.government = user.government.toUpperCase(); });
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
				populate();
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
  $scope.$watch('government', populate);
  $scope.$watch('roleFilter', populate);
	$scope.$watch('currentPage', populate);
}

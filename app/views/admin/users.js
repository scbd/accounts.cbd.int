define(['app', 'lodash', 'authentication'], function(app, _) { 'use strict';

    return ['$scope', '$http', '$route', '$location', '$filter', '$q', function($scope, $http, $route, $location, $filter, $q) {
    
    
    $scope.pageSize = 25;
    $scope.tabSetSize = 10;
    $scope.set = 0;

    var qs = $location.search();
    if(qs.government)
      $scope.government = qs.government
    if(qs.role)
      $scope.roleFilter = Number(qs.role);
    if(qs.freetext)
      $scope.freetext = qs.freetext
      
    updatePager(0);

  $http.get('/api/v2013/roles', { cache: true }).then(function (response) {
    		var map = {};
    		response.data.forEach(function (role) {
    			map[role.roleId] = role;
    		});
    		$scope.roles = map;
	});//  $http.get('/api/v2013/roles', { cache: true }).

  $http.get('/api/v2013/countries', { cache: true }).then(function (response) {
  		var map = {};
  		response.data.forEach(function (country) {
  			country.name = country.name.en;
  			map[country.code] = country;
  		});

  		map.EUR = map.EUR || map.EU;

  		$scope.countries = map;
      $scope.countriesList=[];

      $filter('orderBy')(response.data, 'name').forEach(function (country) {
          $scope.countriesList.push({ code : country.code.toLowerCase(), name: country.name });
      });
	});//  $http.get('/api/v2013/countries',

  $http.get("/api/v2013/roles", { cache: true }).then(function(response) {
      $scope.roleList = [];
      $filter('orderBy')(response.data, 'name').forEach(function (o) {
          $scope.roleList.push({ roleId : o.roleId, name: o.name });
      });
  });//$http.get("/api/v2013/roles", {

  var cancelPopulate;
  var debouncedPopulate = _.debounce(populate, 250);
  var prevRequestCancelled = false;
	function populate () {

        if(cancelPopulate) {
            cancelPopulate.resolve();
            cancelPopulate = undefined;
            prevRequestCancelled = true;
        }

        $location.search({government:$scope.government})
        $location.search({role:$scope.roleFilter})
        $location.search({freetext:$scope.freetext})

        $scope.returnUrl = 'returnUrl=' + encodeURIComponent($location.$$url);
        cancelPopulate = $q.defer();
        $scope.loading = true;
        return $http.get('/api/v2013/users', { params: { q: $scope.freetext, sk: $scope.currentPage*25, l: 25 , government : $scope.government, role: $scope.roleFilter }, timeout: cancelPopulate.promise })
        .then(function (response) {
            prevRequestCancelled=false;
            $scope.userCount =  parseInt(response.headers("record-count"));

            var users = _.map(response.data, function (user) {

                if(user.government)
                    user.government = user.government.toUpperCase();

                return user;
    		    });

            $scope.users = users;

            return users;

        }).then(function(users){

            updatePager();

            return users;
        })
        .catch(function(e){
          if(e.xhrStatus != 'abort')
            prevRequestCancelled=false;
        })
        .finally(function(){
          if(!prevRequestCancelled)
            $scope.loading = false;
        });
	}

  //============================================================
	//
	//
	//============================================================
  function setPage (page) {

      $scope.currentPage = Math.max(0, Math.min($scope.pageCount-1, page|0));
	}

  //============================================================
  //
  //
  //============================================================
    function calcSet (page) {

        var sets = _.range(0,$scope.pageCount,$scope.tabSetSize);
        return  _.find(sets, function(setStart){
                      return (page >= setStart && page < setStart+($scope.tabSetSize)); });
  }//calcSet (page) {

  //============================================================
	//
	//
	//============================================================
    function updatePager(currentPage) {

        var userCount = $scope.userCount || ($scope.users || []).length || $scope.tabSetSize;
        $scope.pageCount = Math.ceil(userCount / 25);
        $scope.set=calcSet(currentPage || $scope.currentPage || 0);
        $scope.pages     = _.range($scope.pageCount).splice($scope.set,($scope.tabSetSize));
        if(currentPage!==undefined)
            setPage (currentPage);

	}//updatePager(currentPage)

	//============================================================
	//
	//
	//============================================================
	$scope.actionDelete = function actionDelete (userID) {

    		if (confirm('Are you sure you want to delete this user account?')) {

                $http.delete('/api/v2013/users/' + userID).then(function () {
    				populate();
    				alert('The user account has been deleted.');
          }).catch(function (data) {
        	    	alert(data);
            	});
    	  }
	};//$scope.actionDelete = function actionDelete (userID)

  $scope.actionSetPage = setPage;
  $scope.$watch('government',  debouncedPopulate);
  $scope.$watch('roleFilter',  debouncedPopulate);
  $scope.$watch('currentPage', debouncedPopulate);
  $scope.$watch('freetext',  _.debounce(function(){
        setPage(0);
        populate();
    }, 250));
  }];
});

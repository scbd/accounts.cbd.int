define(['app', 'lodash', 'angular', 'jquery', 'directives/bootstrap/dual-list', 'directives/forms-input-list'], function(app, _, ng, $) { 'use strict';

    return ["$http", '$scope' , '$filter', '$location', '$route', '$q', 'returnUrl', function ($http, $scope, $filter, $location, $route, $q, returnUrl) {

        var initialUser  = {};
        var initialRoles = [];

        //==================================
        //
        //==================================
        $scope.UserGroups = [
            { code: 'SCBD', name : 'SCBD'}
        ];

        $scope.save = save;
        $scope.cancel = function(){
            if($location.search().returnUrl)
                returnUrl.navigate($location.search().returnUrl)
            else
                $location.path('/admin/users');
        }
        $scope.$watch('phones+faxes+emailsCc', function () {
            if($scope.document) {
                $scope.document.Phone    = ($scope.phones  ||[]).join(';').replace(/^\s+|;$|\s+$/gm,'');
                $scope.document.Fax      = ($scope.faxes   ||[]).join(';').replace(/^\s+|;$|\s+$/gm,'');
                $scope.document.EmailsCc = ($scope.emailsCc||[]).join(';').replace(/^\s+|;$|\s+$/gm,'');
            }
        });

        load();

        return this;

        //==================================
        //
        //==================================
        function loadList() {

            var q1 = $http.get("/api/v2013/countries", { cache: true }).then(function(result) {

                var sortedData = $filter('orderBy')(result.data, 'name.en');

                $scope.countries = _.map(sortedData, function(o) {
                    return { code : o.code.toLowerCase(), name: o.name.en };
                });
            });

            var q2 = $http.get("/api/v2013/roles", { cache: true }).then(function(response) {
                $scope.roleList = excludeAutomaticRoles($filter('orderBy')(response.data, 'name'));
            });

            return $q.all([q1, q2]);
        }

        //==================================
        //
        //==================================
        function load() {

            var userId = $route.current.params.id;

            loadList().then(function() {

                if(userId=='new') {
                    applyUser ({});
                    applyRoles([]);
                    return;
                }

                var qUser = $http.get('/api/v2013/users/'+userId).then(function (res) {
                    return applyUser(res.data);
                });

                var qRoles = $http.get('/api/v2013/users/'+userId+'/roles').then(function (res) {
                    return applyRoles(res.data);
                });

                return $q.all([qUser, qRoles]);

            }).catch(handleError);
        }

        //==================================
        //
        //==================================
        function applyUser(user) {

            if(user.Government=="eur")
                user.Government = "eu"; // BCH country patch

            initialUser  = _.clone(user, true);

            $scope.document = user;
            $scope.phones   = (user.Phone   ||'').split(';');
            $scope.faxes    = (user.Fax     ||'').split(';');
            $scope.emailsCc = (user.EmailsCc||'').split(';');

            return user;
        }

        //==================================
        //
        //==================================
        function applyRoles(roles) {

            roles = excludeAutomaticRoles(roles);

            initialRoles = _.clone(roles, true);

            $scope.roles = roles;

            return roles;
        }

        //==================================
        //
        //==================================
        function save() {

            if($scope.form.$error.required) {
                handleError({ code : 'mandatory' });
                return;
            }

            $q.when($scope.document).then(function(user) {

                var oldUserJson = ng.toJson(initialUser);
                var newUserJson = ng.toJson(user);

                if(oldUserJson==newUserJson)
                    return user;

                return updateUser(user);

            }).then(function(user) {

                return updateRoles(user.UserID, $scope.roles);

            }).then(function(){

                if($location.search().returnUrl)
                    returnUrl.navigate($location.search().returnUrl)
                else
                    $location.path('/admin/users');

            }).catch(handleError);
        }

        //==================================
        //
        //==================================
        function excludeAutomaticRoles(roles) {
            return _.filter(roles, function(r){
                return r !==  9 && r.roleId !==  9 && // User
                       r !== 17 && r.roleId !== 17 && // Everyone
                       r !== 18 && r.roleId !== 18;   // Anonymous
            });
        }

        //==================================
        //
        //==================================
        function updateUser(user) {

            if(!user.UserID) return $http.post('/api/v2013/users/',             user).then(function(res) { return applyUser(res.data); } );
            else             return $http.put ('/api/v2013/users/'+user.UserID, user).then(function()    { return user; } );  // uodate does not return the user;
        }

        //==================================
        //
        //==================================
        function updateRoles(userId, roles) {

            var rolesToGrant  = _.difference(roles, initialRoles);
            var rolesToRevoke = _.difference(initialRoles, roles);

            var tasks = [];

            rolesToGrant.forEach(function grantRole (role) {
                tasks.push($http.put('/api/v2013/users/'+userId+'/roles/'+role));
            });

            rolesToRevoke.forEach(function grantRole (role) {
                tasks.push($http.delete('/api/v2013/users/'+userId+'/roles/'+role));
            });

            return $q.all(tasks).then(function(){
                return applyRoles(roles);
            });
        }

        //==================================
        //
        //==================================
        function handleError (err) {
            err = (err||{}).data || err || {};
            $scope.error = err;

            $('html, body').animate({ scrollTop: $("#users-id").offset().top }, 250);
        }
    }];

});

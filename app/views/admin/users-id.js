
define(['app', 'lodash', 'authentication', 'directives/bootstrap/dual-list'], function(app, _) { 'use strict';

    return ["$http", "$http", "$browser", "authentication", '$scope' , '$filter', '$location', '$route', '$q', function ($http, authHttp, $browser, authentication, $scope, $filter, $location, $route, $q) {

    $http.get("/api/v2013/countries").then(function(result) {

        var sortedData = $filter('orderBy')(result.data, 'name.en');

        $scope.countries = _.map(sortedData, function(o) {
            return { code : o.code.toLowerCase(), name: o.name.en };
        });
    });

    $http.get("/api/v2013/roles", { cache: true }).then(function(response) {
        $scope.roleList = $filter('orderBy')(response.data, 'name');
    });

    //==================================
    //
    //==================================
    $scope.init = function() {

        if($route.current.params.id=='new') {
            $scope.initialRoles = [];
        } else {
            $http.get('/api/v2013/users/'+$route.current.params.id).success(function (data) {

                if(data.Government=="eur")
                    data.Government = "eu"; // BCH country patch

                $scope.document = data;
                $scope.loadPhones();
                $scope.loadFaxes();
                $scope.loadEmails();
            }).error(function (data) {
                alert('ERROR\r\n----------------\r\n'+data.message);
            });

            $http.get('/api/v2013/users/'+$route.current.params.id+'/roles').success(function (data) {
                $scope.roles = data;
                $scope.initialRoles = data.slice(0); // clone array
            }).error(function (data) {
                alert('ERROR\r\n----------------\r\n'+data.message);
            });
        }
    };

    //==============================
    //
    //==============================
    $scope.getPhones = function ()
    {
        if(!$scope.phones)
        {
            $scope.phones = [];
        }

        if($scope.phones.length===0)
            $scope.phones.push({value : "", type: ""});

        var sLastValue = $scope.phones[$scope.phones.length-1].value;
        var sLastType  = $scope.phones[$scope.phones.length-1].type;
        var sLastExt   = $scope.phones[$scope.phones.length-1].ext;

        //NOTE: IE can set value to 'undefined' for a moment
        if((sLastValue && sLastValue!="") ||
           (sLastType  && sLastType!="")  ||
           (sLastExt   && sLastExt!="") )
            $scope.phones.push({value : ""});

        return $scope.phones;
    };

    //==============================
    //
    //==============================
    $scope.loadPhones = function ()
    {
        $scope.phones = [];
        var phones = $scope.document.Phone ? $scope.document.Phone.split(';') : undefined;
        if(phones)
        {
            $.each(phones, function( index, phone ) {
                if(phone)
                {
                    $scope.phones.push({value: phone});
                }
            });
        }
    };

    //==============================
    //
    //==============================
    $scope.savePhones = function ()
    {
        $scope.document.Phone = "";
        $.each($scope.phones, function( index, value ) {
            if(value.value)
            {
                $scope.document.Phone += value.value;
                $scope.document.Phone += ';';
            }
        });
    };

    //==============================
    //
    //==============================
    $scope.removePhone = function(index)
    {
        $scope.phones.splice(index, 1);
        $scope.savePhones();
    };

    //==============================
    //
    //==============================
    $scope.getFaxes = function ()
    {
        if(!$scope.faxes)
        {
            $scope.faxes = [];
        }

        if($scope.faxes.length===0)
            $scope.faxes.push({value : "", type: ""});

        var sLastValue = $scope.faxes[$scope.faxes.length-1].value;
        var sLastExt = $scope.faxes[$scope.faxes.length-1].ext;

        //NOTE: IE can set value to 'undefined' for a moment
        if((sLastValue && sLastValue!="") ||
           (sLastExt && sLastExt!="") )
            $scope.faxes.push({value : ""});

        return $scope.faxes;
    };

    //==============================
    //
    //==============================
    $scope.loadFaxes = function ()
    {
        $scope.faxes = [];
        var Faxes = $scope.document.Fax ? $scope.document.Fax.split(';') : undefined;
        if(Faxes)
        {
            $.each(Faxes, function( index, faxe ) {
                if(faxe)
                {
                    $scope.faxes.push({value: faxe});
                }
            });
        }
    };

    //==============================
    //
    //==============================
    $scope.saveFaxes = function ()
    {
        $scope.document.Fax = "";
        $.each($scope.faxes, function( index, value ) {
            if(value.value)
            {
                $scope.document.Fax += value.value;
                $scope.document.Fax += ';';
            }
        });
    };

    //==============================
    //
    //==============================
    $scope.removeFaxe = function(index)
    {
        $scope.faxes.splice(index, 1);
        $scope.saveFaxes();
    };

    //==============================
    //
    //==============================
    $scope.getEmails = function ()
    {
        if(!$scope.EmailsCc)
        {
            $scope.EmailsCc = [];
        }

        if($scope.EmailsCc.length===0)
            $scope.EmailsCc.push({value: ""});

        var sLastValue = $scope.EmailsCc[$scope.EmailsCc.length-1];

        //NOTE: IE can set value to 'undefined' for a moment
        if(sLastValue.value)
            $scope.EmailsCc.push({value: ""});

        return $scope.EmailsCc;
    };

    //==============================
    //
    //==============================
    $scope.loadEmails  = function ()
    {
        $scope.EmailsCc = [];
        var emails = $scope.document.EmailsCc ? $scope.document.EmailsCc.split(';') : undefined;
        if(emails)
        {
            $.each(emails, function( index, email ) {
                if(email)
                {
                    $scope.EmailsCc.push({value: email});
                }
            });
        }
    };

    //==============================
    //
    //==============================
    $scope.saveEmails = function ()
    {
        $scope.document.EmailsCc = "";
        $.each($scope.EmailsCc, function( index, email ) {
            if(email.value)
            {
                $scope.document.EmailsCc += email.value;
                $scope.document.EmailsCc += ';';
            }
        });
    };

    //==============================
    //
    //==============================
    $scope.removeEmail = function(index)
    {
        $scope.EmailsCc.splice(index, 1);
        $scope.saveEmails();
    };

    //==================================
    //
    //==================================
    $scope.onPostSave = function() {

        if($route.current.params.id=='new') {

            authHttp.post('/api/v2013/users/', angular.toJson($scope.document)).success(function (data) {
                $scope.document = data;
                $scope.actionUpdateRoles();

            }).error(function (data) {
                $scope.error = data.message;
            });

        } else {

            authHttp.put('/api/v2013/users/'+$scope.document.UserID, angular.toJson($scope.document)).success(function () {
                $scope.actionUpdateRoles();
            }).error(function (data) {
                $scope.error = data.message;
            });
        }
    };

    //==================================
    //
    //==================================
    $scope.actionUpdateRoles = function() {

        var rolesToGrant  = _.difference($scope.roles, $scope.initialRoles);
        var rolesToRevoke = _.difference($scope.initialRoles, $scope.roles);

        var tasks = [];

        rolesToGrant.forEach(function grantRole (role) {
            tasks.push(authHttp.put('/api/v2013/users/'+$scope.document.UserID+'/roles/'+role));
        });

        rolesToRevoke.forEach(function grantRole (role) {
            tasks.push(authHttp.delete('/api/v2013/users/'+$scope.document.UserID+'/roles/'+role));
        });

        $q.all(tasks).then(function done () {
            $location.path('/admin/users');
        });
    };

    $scope.init();

}];

});

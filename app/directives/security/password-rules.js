define(['app', 'text!./password-rules.html'], function(app, template) { 'use strict';

    app.directive('passwordRules', [function () {
        return {
            restrict: 'E',
            template : template,
            scope: {
                password : "=",
                isValid : "="
            },
            link: function ($scope) {

                $scope.$watch("password", function(password) {

                    password = password||"";

                    var validRuleCount = 0;
                    var invalidChars = 0;

        			if (/[a-z]/.test(password)) validRuleCount++;
        			if (/[A-Z]/.test(password)) validRuleCount++;
        			if (/[0-9]/.test(password)) validRuleCount++;
        			if (/[!@#$%^&*()_+<>?/~|[\]\-\\]/.test(password)) validRuleCount++;

                    if (/\s/.test(password)) invalidChars++;

                    $scope.length       = password.length>=10;
                    $scope.complexity   = validRuleCount >=2;
                    $scope.invalidChars = invalidChars;
                    $scope.isValid      = $scope.length && $scope.complexity && !invalidChars;
                });
            }
        };
    }]);
});

define(['app'], function(app){

    // ENSURE CONSISTENCY WITH BACK-END.
    // https://en.wikipedia.org/wiki/Email_address
    var EMAIL_REGEXP = /^[!#$%&'*+\-\/=?^_`{|}~a-z0-9]+(\.*[!#$%&'*+\-\/=?^_`{|}~a-z0-9]+)*@[a-z0-9]+([-\.][a-z0-9]+)*\.[a-z]{2,}$/i;

    app.directive('type', [function() {
        return {
            restrict: 'A',
            require: '?ngModel',
            link: function(scope, elm, attrs, ctrl) {

                if(!ctrl)  return;
                if( attrs.type!='email') return;

                ctrl.$validators.email = function(modelValue, viewValue) {

                    if (ctrl.$isEmpty(modelValue)) {
                        return true;
                    }

                    return !!EMAIL_REGEXP.test(viewValue);
                };
            }
        };
    }]);

});

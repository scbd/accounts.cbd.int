import app from '~/app';
import template from './recaptcha.directive.html';

app.directive('recaptchaV2', ['captchaSiteKeyV2', function(captchaSiteKeyV2){
    return {
        restrict: 'E',
        template : template,
        replace: true,
        link: function ($scope, $element, $attr)
        {
            var recaptchaWidgetId;

            function recaptchaCallback(token){
                $scope.$applyAsync(function(){
                    $scope.grecaptchaToken = token;
                })
            }
            setTimeout(() => {
                
                recaptchaWidgetId = grecaptcha.render('g-recaptcha', {
                    'sitekey' : captchaSiteKeyV2,
                    'callback' : recaptchaCallback,
                });
            }, 100);

            $scope.resetCaptcha = function(){
                $scope.grecaptchaToken = undefined;
                grecaptcha.reset(recaptchaWidgetId);
            }
                
        }
    }
}])

// //TODO implement v3
// app.directive('recaptchaV3', ['captchaSiteKeyV3', function(captchaSiteKeyV2){
//     return {
//         restrict: 'E',
// 		template : 'Not Implemented',
// 		replace: true,
//     }
// }]);

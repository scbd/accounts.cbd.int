import app from '~/app';
import 'angular';
import 'bootstrap-duallistbox';

app.directive('duallistbox', [function () {
    return {
        priority: 0,
        restrict: 'AC',
        scope: false,
        link: function ($scope, $element) {
            var box = $element.bootstrapDualListbox({
                nonselectedlistlabel: 'Non-selected',
                selectedlistlabel: 'Selected',
                preserveselectiononmove: 'moved',
                moveonselect: false
            });

            $scope.$applyAsync(()=>box.trigger('bootstrapduallistbox.refresh'));
        }
    };
}]);

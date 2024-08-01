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
                moveonselect: false,
                filterTextClear: 'clear filter'
            });

            $scope.$applyAsync(()=>box.trigger('bootstrapduallistbox.refresh'));

            //this is stupid but works :)
            window.$('.bootstrap-duallistbox-container .box2 .filter.form-control').val('-')
            window.$('.bootstrap-duallistbox-container .box1 .filter.form-control').val('-')
            setTimeout(()=>{
                window.$('.bootstrap-duallistbox-container .btn.clear1').click();
                window.$('.bootstrap-duallistbox-container .btn.clear2').click();
                console.log('clear')
            }, 500)
        }
    };
}]);

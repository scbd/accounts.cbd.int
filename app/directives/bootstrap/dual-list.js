define(['app', 'angular', 'libs/bootstrap-duallistbox/bootstrap-duallistbox/jquery.bootstrap-duallistbox'], function(app) { 'use strict';

    app.directive('duallistbox', ["$timeout", function ($timeout) {
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

                var syncing;
                $element.bind("DOMSubtreeModified", function () { console.log('syncing');
                    if(!syncing) {
                        syncing = true;
                        $timeout(function () {
                            box.trigger('bootstrapduallistbox.refresh');
                            syncing = false;
                        }, 500);
                    }
                });
            }
        };
    }]);
});

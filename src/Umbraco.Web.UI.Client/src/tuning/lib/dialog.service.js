
/*********************************************************************************************************/
/* jQuery UI Slider plugin wrapper */
/*********************************************************************************************************/

angular.module("umbraco.tuning").factory('dialogService', function ($rootScope, $q, $http, $timeout, $compile, $templateCache) {


    function closeDialog(dialog) {
        if (dialog.element) {
            dialog.element.removeClass("selected");
            dialog.element.html("");
            dialog.scope.$destroy();
        }
    }

    function open() {
    }

    return {

        open: function (options) {

            var defaults = {
                template: "",
                callback: undefined,
                change: undefined,
                cancel: undefined,
                element: undefined,
                dialogItem: undefined,
                dialogData: undefined
            };

            var dialog = angular.extend(defaults, options);

            var scope = (options && options.scope) || $rootScope.$new();

            // Save original value for cancel action
            var originalDialogItem = angular.copy(dialog.dialogItem);

            dialog.element = $(".float-right-menu");


            /************************************/
            $(document).mousedown(function (e) {
                var container = dialog.element;
                if (!container.is(e.target) && container.has(e.target).length === 0) {
                    closeDialog(dialog);
                }
            });
            /************************************/

            
            $q.when($templateCache.get(dialog.template) || $http.get(dialog.template, { cache: true }).then(function (res) { return res.data; }))
            .then(function onSuccess(template) {

                dialog.element.html(template);

                $timeout(function () {
                    $compile(dialog.element)(scope);
                });

                dialog.element.addClass("selected")

                scope.cancel = function () {
                    if (dialog.cancel) {
                        dialog.cancel(originalDialogItem);
                    }
                    closeDialog(dialog);
                }

                scope.change = function (data) {
                    if (dialog.change) {
                        dialog.change(data);
                    }
                }

                scope.submit = function (data) {
                    if (dialog.callback) {
                        dialog.callback(data);
                    }
                    closeDialog(dialog);
                };

                scope.close = function () {
                    closeDialog(dialog);
                }

                scope.dialogData = dialog.dialogData;
                scope.dialogItem = dialog.dialogItem;

                dialog.scope = scope;

            });

            return dialog;

        },

        close: function() {
            var modal = $(".float-right-menu");
            modal.removeClass("selected")
        }

    }


});
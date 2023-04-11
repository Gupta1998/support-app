app.service("ToastNotifications", function () {
  const setOptions = function () {
    toastr.options.positionClass = "toast-top-right";
    toastr.options.closeButton = true;
    toastr.options.showMethod = "slideDown";
    toastr.options.hideMethod = "slideUp";
    //toastr.options.newestOnTop = false;
    toastr.options.progressBar = true;
  };

  const info = function (message) {
    toastr.info(message);
  };
  const warning = function (message) {
    toastr.warning(message);
  };
  const success = function (message) {
    toastr.success(message);
  };
  const error = function (message) {
    toastr.error(message);
  };

  const clear = function () {
    toastr.clear();
  };

  return {
    setOptions,
    info,
    warning,
    success,
    error,
    clear,
  };
});

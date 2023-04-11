app.directive("fileModel", [
  "$parse",
  function ($parse) {
    return {
      restrict: "A",
      link: function (scope, element, attrs) {
        var model = $parse(attrs.fileModel);
        var modelSetter = model.assign;

        element.bind("change", function () {
          scope.$apply(function () {
            modelSetter(scope, element[0].files[0]);
          });
        });
      },
    };
  },
]);

// app.directive("fileModel", [
//   "$parse",
//   function ($parse) {
//     function fn_link(scope, element, attrs) {
//       var onChange = $parse(attrs.fileModel);
//       element.on("change", function (event) {
//         onChange(scope, { $files: event.target.files });
//       });
//     }
//     return {
//       link: fn_link,
//     };
//   },
// ]);

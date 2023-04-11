app.factory("PaginationFactory", function ($http) {
  function previous(url) {
    return $http.get(url);
  }

  function next(url) {
    return $http.get(url);
  }

  return {
    previous,
    next,
  };
});

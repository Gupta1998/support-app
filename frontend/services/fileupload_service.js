app.service("FileUploadService", function ($http) {
  function uploadFile(fd) {
    return $http.post("http://localhost:3000/upload", fd, {
      transformRequest: angular.identity,
      headers: { "Content-Type": undefined },
    });
  }

  return {
    uploadFile,
  };
});

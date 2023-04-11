app.service("BrandService", function ($http) {
  function getBrands() {
    return $http.get("http://localhost:3000/brands");
  }

  function getBrandAdmins(brandId) {
    return $http({
      method: "GET",
      url: "http://localhost:3000/brandAdmins/" + brandId,
    });
  }

  function createBrand(brand, file) {
    console.log(brand);
    console.log(file);

    const fd = new FormData();

    fd.append("name", brand.name);
    fd.append("email", brand.email);
    fd.append("location", brand.location);
    fd.append("category", brand.category);
    fd.append("contactNo", brand.contactNo);
    fd.append("myFile", file);

    return $http({
      method: "POST",
      url: "http://localhost:3000/brands",
      data: fd,
      headers: { "Content-Type": undefined },
    });
  }

  return { getBrands, getBrandAdmins, createBrand };
});

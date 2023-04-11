app.service("FilterService", function ($http) {
  function filterTickets(filterObj) {
    const reporterName = filterObj.reporterName ? filterObj.reporterName : "";
    const reporterCompany = filterObj.reporterCompany
      ? filterObj.reporterCompany
      : "";
    const agentName = filterObj.agentName ? filterObj.agentName : "";
    const createdAtFrom = filterObj.createdAtFrom
      ? filterObj.createdAtFrom
      : new Date("2023, 01, 01");
    const createdAtTo = filterObj.createdAtTo
      ? filterObj.createdAtTo
      : new Date();
    const dueDateFrom = filterObj.dueDateFrom
      ? filterObj.dueDateFrom
      : new Date("2023, 01, 01");
    const dueDateTo = filterObj.dueDateTo ? filterObj.dueDateTo : new Date();

    const filterValues = {
      reporterName,
      reporterCompany,
      agentName,
      createdAtFrom,
      createdAtTo,
      dueDateFrom,
      dueDateTo,
    };
    return $http.put("http://localhost:3000/ticketFilter", filterValues);
  }

  return { filterTickets };
});

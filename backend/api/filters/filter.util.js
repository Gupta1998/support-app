function filter(filterObj, model) {
  const {
    searchBy = "",
    searchInput = "",
    reporterName = "",
    agentName = "",
  } = filterObj;

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

  // console.log(filterObj);

  return new Promise(function (resolve, reject) {
    model
      .find({
        $and: [
          {
            createdAt: {
              $gte: new Date(createdAtFrom),
              $lte: new Date(createdAtTo),
            },
          },
          {
            dueDate: {
              $gte: new Date(dueDateFrom),
              $lte: new Date(dueDateTo),
            },
          },
          {
            "reportedBy.name": {
              $regex: reporterName,
              $options: "i",
            },
          },
          {
            "assignedTo.username": {
              $regex: agentName,
              $options: "i",
            },
          },
          {
            [searchBy]: {
              $regex: searchInput,
              $options: "i",
            },
          },
        ],
      })
      .then(function (data) {
        resolve(data);
      })
      .catch(function (err) {
        reject(err);
      });
  });
}

module.exports = { filter };

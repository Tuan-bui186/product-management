module.exports = (query) => {
  let filter = [
    {
      name: "Tất cả",
      status: "",
      class: "",
    },
    {
      name: "Hoạt động",
      status: "active",
      class: "",
    },
    {
      name: "Dừng hoạt động",
      status: "inactive",
      class: "",
    },
  ];

  if (query.status) {
    const index = filter.findIndex((item) => item.status == query.status);
    filter[index].class = "active";
  } else {
    const index = filter.findIndex((item) => item.status == "");
    filter[index].class = "active";
  }
  return filter;
};

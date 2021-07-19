const users = [
  { _id: "1234567893423423", name: "mohamed" },
  { _id: "2342342342342344", name: "Ahmad" },
  { _id: "2342342342234234", name: "Montaha" },
  { _id: "6456456333453455", name: "Ahmad" },
  { _id: "4534534534534556", name: "Samar  " },
  { _id: "3345564567434545", name: "Eman" },
  { _id: "4564564645454544", name: "Anas" },
  { _id: "4245164561454554", name: "Osama" },
  { _id: "4564564564565464", name: "Kamel" },
  { _id: "58784569647569456", name: "Khawam" },
  { _id: "45645677765464565", name: "Samir" },
  { _id: "34534532222444354", name: "Maimouna" },
];
exports.getAllUsers = function (req, res) {
  res.status(200).json({
    status: "success",
    result: users.length,
    data: { users },
  });
};
exports.getOneUser = (req, res) => {
  console.log(req.params);
  let user;

  if (users.find((user) => user._id == req.params.id)) {
    user = users.find((user) => user._id == req.params.id);
  } else {
    user = null;
  }
  if (user !== null) {
    res.status(200).json({
      status: "success",
      result: 1,
      data: { user },
      requestTime: req.requestTime,
    });
  } else {
    res.status(404).json({
      status: "field",
      message: "user not found",
      requestTime: req.requestTime,
    });
  }
};
exports.createUser = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: "success",
    data: { user: "new user data" },
    requestTime: req.requestTime,
  });
};
exports.updateUser = (req, res) => {
  res.status(200).json({
    status: "success",
    data: { user: "updated" },
    requestTime: req.requestTime,
  });
};
exports.deleteUser = (req, res) => {
  res.status(204).json({
    status: "success",
    data: null,
    requestTime: req.requestTime,
  });
};

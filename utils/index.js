const filteredPasswordObjs = (objs) => {
  return [...objs].map((data) => {
    const d = { ...data };
    delete d.password;
    return d;
  });
};

const filteredPasswordObj = (obj) => {
  const copiedObj = { ...obj };
  delete copiedObj.password;
  return copiedObj;
};

const getDomain = (url) => {
  return url.substring(1).split("/")[0];
};

const validPassword = (objs, id, password) => {
  return (
    objs.find((obj) => obj.id.toString() === id.toString()).password ===
    password
  );
};

const sortedBy = (objs, _sort, _order) => {
  if (!_sort || !_order) {
    return objs;
  }
  return objs.sort((o1, o2) =>
    _order === "desc" ? o2[_sort] - o1[_sort] : o1[_sort] - o2[_sort]
  );
};

module.exports = {
  filteredPasswordObj,
  filteredPasswordObjs,
  getDomain,
  validPassword,
  sortedBy,
};

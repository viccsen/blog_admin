if (!Object.entries) {
  Object.entries = function (obj:object) {
    return Object.keys(obj).map(key => [key, obj[key]]);
  };
}
if (!Object.values) {
  Object.values = function (obj:object) {
    return Object.keys(obj).map(key => obj[key]);
  };
}

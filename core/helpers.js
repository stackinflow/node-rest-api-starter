const BLANK_SPACE = " ";
const FORWARD_SLASH = "/";
const COMMA = ",";

module.exports.join = (...args) => {
  var res = "";
  args.forEach((arg) => (res += arg));
  return res;
};

module.exports.joinWithSpace = (...args) => {
  var res = "";
  args.forEach((arg) => (res = res + BLANK_SPACE + arg));
  return res.trim();
};

module.exports.joinWithCommaSpace = (...args) => {
  var res = "";
  args.forEach((arg) => (res = res + COMMA + BLANK_SPACE + arg));
  return res.trim().substr(2);
};

module.exports.joinWithForwardSlash = (...args) => {
  var res = "";
  args.forEach((arg) => (res = res + FORWARD_SLASH + arg));
  return res.trim().substr(1);
};

module.exports.getValuesArrayFromMap = (map) => {
  var list = [];

  for (const [_, value] of Object.entries(map)) {
    list.push(value);
  }
  return list;
};

const toAscii = hex => {
  // Find termination
  let str = "";
  let i = 0, l = hex.length;
  if (hex.substring(0, 2) === "0x") {
    i = 2;
  }
  let code;
  for (; i < l; i += 2) {
    code = parseInt(hex.substr(i, 2), 16);
    str += String.fromCharCode(code);
  }

  return str;
};

module.exports = {
  toAscii,
};

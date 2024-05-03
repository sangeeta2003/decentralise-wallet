const fs = require("fs");

const main = (path) => {
  return fs.readFileSync(path, {
    encoding: "base64",
  });
};

module.exports = main;

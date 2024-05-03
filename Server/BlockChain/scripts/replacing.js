const fs = require("fs");

const writeFile = (path, content) => {
  fs.writeFileSync(path, content, (err) => {
    if (err) throw err;
  });
};

const usingFunction = async (contractAddress = "0xb5DbB901DCaEFB439c1905dBf0190753AC6194cb") => {
  try {
    writeFile(
      "../../Constants/contractAddress.json",
      `"${contractAddress}"`
    );
    const data = require("../artifacts/contracts/Hearing.sol/Hearing.json");
    const abi = data["abi"];
    writeFile("../../Constants/abi.json", JSON.stringify(abi));
    console.log("Replacing Done");
  } catch (e) {
    console.log(e);
  }
};

module.exports = usingFunction


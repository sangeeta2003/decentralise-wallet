const Cases = [];

const addCaseFn = (tempCase) => {
  Cases.push(tempCase);
  console.log(Cases);
};

const viewCaseFn = () => {
  return Cases;
};

module.exports = { addCaseFn, viewCaseFn };

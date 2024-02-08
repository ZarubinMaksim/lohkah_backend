const { OK_STATUS } = require('../constants');
const TestResult = require('../models/testResult');

const addTestResult = (req, res) => {
  const {test, testDate, name, department, studyingDepartment, studyingLesson, mistakesList} = req.body;
  TestResult.create({
    test, 
    testDate, 
    name, 
    department, 
    studyingDepartment, 
    studyingLesson, 
    mistakesList
  })
  .then((result) => {
    res.status(OK_STATUS).send({ data: result})
  })
};

const getResults = (req, res) => {
  TestResult.find()
  .then((results) => {
    res.status(OK_STATUS).send({ data: results})
  })
}

// const getResultsByDepartment = (req, res) => {
//   const {department} = req.params 
//   TestResult.find()
//   .then((results) => {
//     results.filter(function (result) {
//       console.log(result.studyingDepartment, department)
//       return result.studyingDepartment === department
//     })
//     res.status(OK_STATUS).send({ data: results})
//   })
// }

module.exports = {
  addTestResult,
  getResults,
  // getResultsByDepartment,
};
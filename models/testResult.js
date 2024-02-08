const mongoose = require('mongoose');

const testResultSchema = new mongoose.Schema({
  test: {
    type: String,
  }, 
  testDate: {
    type: String,
  },
  name: {
    type: String,
  },
  department: {
    type: String,
  },
  studyingDepartment: {
    type: String,
  },
  studyingLesson: {
    type: String,
  },
  mistakesList: {
    type: Array,
  },
})

module.exports = mongoose.model('testresult', testResultSchema);
const express = require('express');
const mongoose = require('mongoose');
const {PORT = 3000} = process.env ;
const { createUser, login, getUserData, getAllUsers } = require('./controllers/users');
const { 
  addLesson, 
  allContent, 
  deleteWord, 
  deleteLesson, 
  deleteDepartment, 
  changeDepartment, 
  changeLesson, 
  changeWord 
} = require('./controllers/lessons');
const { handleCors } = require('./middlewares/cors');
const { addTestResult, getResults } = require('./controllers/testResults');
const cookieParser = require('cookie-parser')
const app = express();

mongoose.connect('mongodb://lekaUser:1234567890@38.180.95.120:27017/leka');
// mongoose.connect('mongodb://127.0.0.1:27017/leka');

app.use((req, res, next) => {
  next();
});

app.listen(PORT, () => {
  console.log('STARTED AT ', PORT)
});

app.use(express.json());
app.use(handleCors);
app.use(cookieParser());

app.post('/signup', createUser);
app.post('/signin', login);
app.post('/add', addLesson);
app.post('/testresult', addTestResult);
app.get('/', allContent);
app.get('/profile', getUserData);
app.get('/testresult', getResults);
app.get('/users', getAllUsers);
app.delete('/:departmentId/:lessonId/:wordId', deleteWord);
app.delete('/:departmentId/:lessonId', deleteLesson);
app.delete('/:departmentId', deleteDepartment);
app.patch('/:departmentId', changeDepartment);
app.patch('/:departmentId/:lessonId', changeLesson);
app.patch('/:departmentId/:lessonId/:wordId', changeWord);
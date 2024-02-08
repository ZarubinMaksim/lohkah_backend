const { OK_STATUS } = require('../constants');
const { Department } = require('../models/lesson');

const allContent = (req, res, next) => {
  Department.find()
    .then((departments) => {
      res.status(OK_STATUS).send({ data: departments });
    })
    .catch(next);
};

const addLesson = (req, res, next) => {
  const { department, lessonName, cn, eng, example} = req.body;
  Department.findOne({department})
    .then((dep) => {
      if (!dep) {
        Department.create({
          department,
          lessons: [{ lessonName, words: [{ cn, eng, example}]}],
        })
        .then((newDep) => {
          res.status(OK_STATUS).send({ data: newDep })
        })
      } else {
        const lesson = dep.lessons.find((l) => l.lessonName === lessonName);
        if (lesson) {
          lesson.words.push({ cn, eng, example });
        } else {
          dep.lessons.push({ lessonName, words: [{ cn, eng, example }]});
        }
        dep.save()
          .then((updatedDep) => {
            res.status(OK_STATUS).send({data: updatedDep});
          })
      }
    })
    .catch((err) => {
      next(err)
    })
}

const deleteWord = (req, res, next) => {
  const {departmentId, lessonId, wordId} = req.params;
  Department.findById(departmentId)
  .then((department) => {
    const currentLesson = department.lessons.find((lesson) => lesson._id.toString() === lessonId);
    const currentWord = currentLesson.words.find((word) => word._id.toString() === wordId);
    currentLesson.words.remove(currentWord);
    res.send({data: currentWord});
    department.save();
  });
};

const deleteLesson = (req, res, next) => {
  const {departmentId, lessonId} = req.params;
  Department.findById(departmentId)
  .then((departmentData) => {
    const currentLesson = departmentData.lessons.find((lesson) => lesson._id.toString() === lessonId);
    if (currentLesson.words.length === 0) {
      departmentData.lessons.remove(currentLesson);
      res.send({data: currentLesson});
      departmentData.save();
    };
  });
};

const deleteDepartment = (req, res, next) => {
  const {departmentId} = req.params;
  Department.findById(departmentId)
  .then((departmentData) => {
    if (departmentData.lessons.length === 0) {
      Department.deleteOne({_id: departmentId})
      .then((department) => {
        res.send({data: department});
      })
    }
  })
};

const changeDepartment = (req, res, next) => {
  const {departmentId} = req.params;
  const {department} = req.body;
  Department.findByIdAndUpdate(departmentId, {department: department}, {new: true})
    .then((updatedDepartment) => {
      res.send({ data: updatedDepartment});
    }
  )
};

const changeLesson = (req, res, next) => {
  const {departmentId, lessonId} = req.params;
  const {lessonName} = req.body;
  console.log(departmentId, lessonId, lessonName)
  Department.findById(departmentId)
    .then((departmentData) => {
      const currentLesson = departmentData.lessons.find((lesson) => lesson._id.toString() === lessonId);
      currentLesson.lessonName = lessonName;
      res.send({ data: currentLesson});
      departmentData.save();
    })
};

const changeWord = (req, res, next) => {
  const {departmentId, lessonId, wordId} = req.params;
  const {cn, eng, example} = req.body;
  Department.findById(departmentId)
    .then((departmentData) => {
      const currentLesson = departmentData.lessons.find((lesson) => lesson._id.toString() === lessonId);
      const currentWord = currentLesson.words.find((word) => word._id.toString() === wordId);
      currentWord.cn = cn;
      currentWord.eng = eng;
      currentWord.example = example;
      res.send({ data: currentWord});
      departmentData.save();
    })
};

module.exports = {
  addLesson,
  allContent,
  deleteWord,
  deleteLesson,
  deleteDepartment,
  changeDepartment,
  changeLesson,
  changeWord
};
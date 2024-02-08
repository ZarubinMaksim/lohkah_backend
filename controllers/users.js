const { DUBLICATED_NAME, OK_STATUS, WRONG_PASSWORD_COMPARE, USER_WRONG_DATA } = require('../constants');
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');
const User = require('../models/user');
const bcrypt = require('bcryptjs');

const getAllUsers = (req, res) => {
  User.find()
  .then((users) => {
    console.log(users)
    res.status(OK_STATUS).send({ data: users});
  })
}

const createUser = (req, res, next) => {
  const { name, department, password, confirmation} = req.body;
  User.findOne({ name })
    .then((user) => {
      if (user) {
        next(new ConflictError(DUBLICATED_NAME));
      } else {
        {password === confirmation ? (
          bcrypt.hash(password, 10)
            .then((hash) => User.create( {name, department, password:hash} ))
          .then((user) => {
            res.status(OK_STATUS).send({ data: user });
          })
          .catch((err) => {
            next(err);
          })
        ) : (
          next(new BadRequestError(WRONG_PASSWORD_COMPARE))
        )}
      }
    })
};

const login = (req, res, next) => {
  const { name, password } = req.body;
  return User.findOne({name}).select('+password')
    .then((user) => {
      if (!user) {
        next(new BadRequestError(USER_WRONG_DATA))
      } else {
        return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            next(new BadRequestError(USER_WRONG_DATA))
          }
          return user;
        })
        .then((user) => {
          res.cookie('_id', user._id, {maxAge: 3600000 * 24 * 7, httpOnly: true});
          res.status(OK_STATUS).send({ data: user});
        })
      }
    })
};
 
const getUserData = (req, res, next) => {
  const userId = req.cookies._id
  User.findOne({ _id: userId })
    .then((user) => {
      if (!user) {
        throw new NotFoundError(USER_NOT_FOUND);
      }
      res.send({ data: user });
    })
    .catch(next);
};

module.exports = {
  createUser,
  login,
  getUserData,
  getAllUsers,

};
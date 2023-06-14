const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const usersSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

usersSchema.pre('save', async function (next) {
  if (this.isModified('password') || this.isNew) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(this.password, salt);
      this.password = hashedPassword;
    } catch (error) {
      next(error);
    }
  }
  next();
});

usersSchema.pre('findOneAndUpdate', async function (next) {
  if (this.update.password) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(this.update.password, salt);
      this.update.password = hashedPassword;
    } catch (error) {
      next(error);
    }
  }
  next();
});

usersSchema.methods.comparePassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw new Error('Error comparing passwords');
  }
};

const Users = mongoose.model('Users', usersSchema);

module.exports = Users;

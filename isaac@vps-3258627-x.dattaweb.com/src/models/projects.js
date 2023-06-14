const mongoose = require('mongoose');

const projectsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  collection: 'projects',
  database: 'altasLlo',
});

projectsSchema.pre('remove', async (next) => {
  // eslint-disable-next-line no-underscore-dangle
  await this.model('Task').deleteMany({ project: this._id });
  next();
});

const Projects = mongoose.model('projects', projectsSchema);

module.exports = Projects;

const mongoose = require('mongoose');
const Projects = require('../models/projects');
const Users = require('../models/users');
const Tasks = require('../models/tasks');
require('dotenv').config();

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: 'altasLlo',
    });

    const { connection } = mongoose;

    if (connection) {
      const collections = await connection.db.listCollections().toArray();
      const collectionNames = collections.map((collection) => collection.name);

      if (!collectionNames.includes('project')) {
        await Projects.createCollection();
        console.log("Collection 'projects' created in bd 'altasLlo'.");
      }

      if (!collectionNames.includes('user')) {
        await Users.createCollection();
        console.log("Collection 'users' created in bd 'altasLlo'.");
      }

      if (!collectionNames.includes('task')) {
        await Tasks.createCollection();
        console.log("Collection 'tasks' created in bd 'altasLlo'.");
      }

      console.log('Connected to MongoDB!');
    } else {
      console.error("We couldn't establish a connection to the database.");
    }
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};

module.exports = {
  dbConnection,
};

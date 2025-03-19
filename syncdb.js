import { db } from './utils/database.js';

// completely re-builds the database, wiping everything
// db.sync({ force: true });

// syncs the database, updating any models that have been changed
db.sync({ alter: true });

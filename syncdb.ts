import { db } from './utils/database';

// eslint-disable-next-line no-undef
const args = process.argv.slice(2);

if (args[0] && args[0] === '--force') {
    console.log('Rebuilding the database...');
    // completely re-builds the database, wiping everything
    db.sync({ force: true });
} else {
    console.log('Syncing the database...');
    // syncs the database, updating any models that have been changed
    db.sync({ alter: true });
}

console.log('Finished');

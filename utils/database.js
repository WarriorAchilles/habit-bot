import Sequelize from 'sequelize';
// Create sqlite database
export const db = new Sequelize('database', 'user', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    // SQLite only
    storage: 'database.sqlite',
});

// create a tags table
export const Tags = db.define('tags', {
    name: {
        type: Sequelize.STRING,
        unique: true,
    },
    description: Sequelize.TEXT,
    username: Sequelize.STRING,
    usage_count: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
    },
});

export const users = db.define('users', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
        allowNull: false,
    },
    discord_id: {
        type: Sequelize.TEXT,
        unique: true,
        allowNull: false,
    },
});

export const habits = db.define('habits', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
        allowNull: false,
    },
    user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: users,
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    habit_name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    frequency: {
        type: Sequelize.STRING, // e.g., 'daily', 'weekly',
        allowNull: false,
    },
    reminder_time: {
        type: Sequelize.STRING, // Store time as a string like "08:00 AM"
    },
    last_completed_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
    },
});

export const habitCompletions = db.define('habit_completions', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
        allowNull: true,
    },
    user_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
    },
    habit_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
    },
    completed_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
    },
});

users.hasMany(habits, { foreignKey: 'user_id', onDelete: 'CASCADE' });
habits.belongsTo(users, { foreignKey: 'user_id' });

habits.hasMany(habitCompletions, {
    foreignKey: 'habit_id',
    onDelete: 'CASCADE',
});
habitCompletions.belongsTo(habits, { foreignKey: 'user_id' });

users.hasMany(habitCompletions, { foreignKey: 'user_id', onDelete: 'CASCADE' });
habitCompletions.belongsTo(users, { foreignKey: 'user_id' });

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

export const Users = db.define('users', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
        allowNull: false,
    },
    discord_tag: {
        type: Sequelize.TEXT,
        unique: true,
        allowNull: false,
    },
});

export const Habits = db.define('habits', {
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
            model: Users,
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    habit_name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    habit_description: {
        type: Sequelize.STRING,
        allowNull: true,
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

export const HabitCompletions = db.define('habit_completions', {
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

Users.hasMany(Habits, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Habits.belongsTo(Users, { foreignKey: 'user_id' });

Habits.hasMany(HabitCompletions, {
    foreignKey: 'habit_id',
    onDelete: 'CASCADE',
});
HabitCompletions.belongsTo(Habits, { foreignKey: 'user_id' });

Users.hasMany(HabitCompletions, { foreignKey: 'user_id', onDelete: 'CASCADE' });
HabitCompletions.belongsTo(Users, { foreignKey: 'user_id' });

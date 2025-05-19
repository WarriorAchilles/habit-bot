import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

// *********************** ATTRIBUTES INTERFACES ***********************

// User attributes
export interface UserAttributes {
    id: number;
    discord_tag: string;
}
export interface UserCreationAttributes
    extends Optional<UserAttributes, 'id'> {}

// Habit attributes
export interface HabitAttributes {
    id: number;
    user_id: number;
    habit_name: string;
    habit_description?: string;
    frequency: string;
    reminder_time?: string;
    last_completed_at?: Date;
}
export interface HabitCreationAttributes
    extends Optional<
        HabitAttributes,
        'id' | 'habit_description' | 'reminder_time' | 'last_completed_at'
    > {}

// HabitCompletion attributes
export interface HabitCompletionAttributes {
    id: number;
    user_id: number;
    habit_id: number;
    completed_at?: Date;
}
export interface HabitCompletionCreationAttributes
    extends Optional<HabitCompletionAttributes, 'id' | 'completed_at'> {}

// *********************** EXTEND MODEL CLASS ***********************

export class User
    extends Model<UserAttributes, UserCreationAttributes>
    implements UserAttributes
{
    public id!: number;
    public discord_tag!: string;
}

export class Habit
    extends Model<HabitAttributes, HabitCreationAttributes>
    implements HabitAttributes
{
    public id!: number;
    public user_id!: number;
    public habit_name!: string;
    public habit_description?: string;
    public frequency!: string;
    public reminder_time?: string;
    public last_completed_at?: Date;
}

export class HabitCompletion
    extends Model<HabitCompletionAttributes, HabitCompletionCreationAttributes>
    implements HabitCompletionAttributes
{
    public id!: number;
    public user_id!: number;
    public habit_id!: number;
    public completed_at?: Date;
}

// *********************** DATABASE SETUP ***********************

// Create sqlite database
export const db = new Sequelize('database', 'user', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    // SQLite only
    storage: 'database.sqlite',
});

export const Users = db.define<User, UserCreationAttributes>('users', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
        allowNull: false,
    },
    discord_tag: {
        type: DataTypes.TEXT,
        unique: true,
        allowNull: false,
    },
});

export const Habits = db.define<Habit, HabitCreationAttributes>('habits', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
        allowNull: false,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Users,
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    habit_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    habit_description: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    frequency: {
        type: DataTypes.STRING, // e.g., 'daily', 'weekly',
        allowNull: false,
    },
    reminder_time: {
        type: DataTypes.STRING, // Store time as a string like "08:00 AM"
    },
    last_completed_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
});

export const HabitCompletions = db.define<
    HabitCompletion,
    HabitCompletionCreationAttributes
>('habit_completions', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
        allowNull: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    habit_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    completed_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
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

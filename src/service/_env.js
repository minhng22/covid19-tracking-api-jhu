import dotenv from 'dotenv'
dotenv.config()

export const env_var = {
    MONGODB_CONNECTION_STR: process.env.MONGODB_CONNECTION_STR
}
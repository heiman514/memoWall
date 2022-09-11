import pg from 'pg'
import { env } from './env'

export let client = new pg.Client({
    database: env.DB_NAME,
    user: env.DB_USERNAME,
    password: env.DB_PASSWORD,
    host: env.DB_HOST
})

client.connect().catch(err => {
    console.error('Failed to connect to database:', err)
    process.exit(1)
})
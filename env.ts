import { config } from 'dotenv'
import populateEnv from 'populate-env'

config()

export let env = {
  DB_NAME: '',
  DB_USERNAME: '',
  DB_PASSWORD: '',
  DB_HOST: 'localhost',
  PORT: 3000,
}

populateEnv(env, { mode: 'halt' })
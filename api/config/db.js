import { Pool } from "@neondatabase/serverless"
import 'dotenv/config'

const connectionString = process.env.CONNECTION_STRING

if (!connectionString) {
    console.error("Connection string could not be found in the .env file.")
    process.exit(1)
}

export const db = new Pool({ connectionString })
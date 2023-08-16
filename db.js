import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()

export const pool = mysql.createPool({
   host:process.env.DB_HOST,
   database:process.env.DB_DATABASE,
   user:process.env.DB_USER,
   password:process.env.DB_PASSWORD,
   port:3306, 
   connectionLimit:10, 

})


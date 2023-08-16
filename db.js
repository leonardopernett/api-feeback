import mysql from 'mysql2/promise'

export const pool = mysql.createPool({
   host:'bdcxm-master.grupokonecta.local',
   database:'ci_monitoreov2',
   user:'leonardo.pernett',
   password:'Konecta2023*',
   port:3306,
   connectionLimit:10,

})
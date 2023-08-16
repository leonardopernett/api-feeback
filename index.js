import express from 'express'
import fetch from 'node-fetch'
import fs from 'fs/promises'
import { pool } from './db.js'

const app = express() 


app.get('/', (req, res) => {
  res.json({message:'Success'}) 
})

app.get('/api/feeback', async (req, res) => {
  
  const date  = new Date()
  const day   = date.getDate()
  const month = date.getMonth() +1
  const year  = date.getFullYear()
  const hours = date.getHours()-1;
  const fechainitial = String(year+"-"+month+"-"+day+"T"+hours+":00:00")
  const fechfinal = String(year+"-"+month+"-"+day+"T"+hours+":59:59")

  const results = await fetch("https://app.feebak.com/v1/dataexport/interactions?organisationId=39",{
    headers:{
      "Content-Type": "application/json",
      "Authorization": "Basic VVU0UkpQbUt1SFhVTnRramFPU0ZFdnY6SEhmb2Q2bXFOMjdYZUhwWjIyWTh1aEVE"
      },
      method:"POST",
      body: JSON.stringify({
        "FromDate": fechainitial,
        "ToDate": fechfinal,
        "Start":0,
        "Limit": 100,
        "Completed": true,
      })
    })
     const data = await results.json()
     let count  = data.TotalCount / 100;
    
     let responseAll = [] 

 for (let index = 0; index <= Math.round(count); index++) { 
   
    try {
      const response = await  fetch("https://app.feebak.com/v1/dataexport/interactions?organisationId=39",{
        method:'POST',

        headers:{
          "Content-Type": "application/json",
          "Authorization": "Basic VVU0UkpQbUt1SFhVTnRramFPU0ZFdnY6SEhmb2Q2bXFOMjdYZUhwWjIyWTh1aEVE"
        },
        body: JSON.stringify({
          "FromDate": fechainitial,
          "ToDate": fechfinal,
          "Start":index==0 ? 0 : parseInt(index+'0'+1),
          "Limit": parseInt((index+1)+'00'),
          "Completed": true,
        })
      })
      const respuesta = await response.json()
      
      responseAll = [...responseAll , ...respuesta.Data] 
      respuesta.Data.map( async (item) => {

        await pool.query(`REPLACE INTO tbl_gnsfeebak_tmpencuestas (
           CustomerId, CustomerName, AgentName ,AddedDate,QueueName, QueueIdentifier, ConversationID ,
           Answers_0,Answers_1,Answers_2,FeedbackText
           ) values (?,?,?,?,?,?,?,?,?,?,?)`,[
            item.CustomerId,  item.CustomerName ,item.AgentName, item.AddedDate, item.QueueName,
             item.QueueIdentifier,item.ConversationID, item.Answers[0]?.Answer ,  item.Answers[1]?.Answer ,
             item.Answers[2]?.Answer  ,item.FeedbackTex
        ])
        
       
    }) 
    
    } catch (error) { 
      return res.json(error.message)
    }

   }  


   res.json({
    "message":"data success"
   })
})

app.listen(4200)
console.log('Server startup on port 4200') 





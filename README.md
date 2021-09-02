# Simple File Server

POST http://localhost:3000/api/upload
body 
form-data 
file


GET http://localhost:3000/api/file/:id


PUT http://localhost:3000/api/file/:id
body
raw
{...filefields}
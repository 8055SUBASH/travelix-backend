import express, { response } from "express";
import cors from "cors";
import mysql from "mysql";
import http, { request } from "http";

const app = express();
const server = http.createServer(app);

app.use(cors({
  credentials: true,
  origin: "*"
}));

app.use(express.json({ limit: "10mb" }));

// const connection = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "",
//   database: "travelix"
// });
 const connection = mysql.createConnection({
   host: "db4free.net",
   user: "vcentry",
   password: "test@123",
   database: "travelix",
   port: 3306
});

connection.connect((error) => {
  if (error) {
    throw error;
  }
  else {
    console.log("MYSQL Server has been connected");
  }
})


// http://localhost:5000/api/create/destination
// Method : POST
app.post("/api/create/destination", (request, response) => {
  const sql_query = `INSERT INTO subash_travelix (destinationName, location, destinationImage, destinationCount) 
    VALUES ('${request.body.destinationName}', '${request.body.location}', '${request.body.destinationImage}', '${request.body.destinationCount}')`

  connection.query(sql_query, (error, result) => {
    if (error) {
      response.status(500).send(error);
    }
    else {
      response.status(200).send("Destination has been Created");
    }
  })
})

//----------------------------------------------------------------------------------------
//URL - http://localhost:5000/api/list/destination
//Method : GET

app.get("/api/list/destination", (request, response) => {
  const sql_query = `SELECT * FROM subash_travelix`;
  connection.query(sql_query, (error, result) => {
    if (error) {
      response.status(500).send(error);
    }
    else {
      response.status(200).send(result);
    }
  })
})

//----------------------------------------------------------------------------------------
//URL - http://localhost:5000/api/delete/destination
//Method : DELETE

app.delete("/api/delete/destination/:id", (request, response) => {
  const sql_query = `DELETE FROM subash_travelix WHERE id=${request.params.id}`;
  connection.query(sql_query, (error, result) => {
    if(error){
      response.status(500).send(error);
    }
    else{
      response.status(200).send("Deleted successfully");
    }
  })
})

//----------------------------------------------------------------------------------------
//URL - http://localhost:5000/api/create/hotel
//Method : POST - admin-hotel


app.post("/api/create/hotel", (request, response) => {
  const sql_query =  `INSERT INTO subash_travelix_hotel (Name, Destination, Images, Price, Location, Available) 
  VALUES ('${request.body.Name}', '${request.body.Destination}', '${request.body.Images}', '${request.body.Price}',  '${request.body.Location}', ${request.body.Available})`;
  connection.query(sql_query, (error, result) => {
    if(error){
      response.status(500).send(error);
    }
    else{
      response.status(200).send("Hotel has been Created");
    }
  }) 
})

//----------------------------------------------------------------------------------------
//URL - http://localhost:5000/api/load/hotels
//Method : GET - admin-hotel

app.get("/api/load/hotels", (request, response) => {
  const sql_query = `SELECT * FROM subash_travelix_hotel`;
  connection.query(sql_query, (error, result) => {
    if(error){
      response.status(500).send(error);
    }
    else{
      response.status(200).send(result);
    }
  })

})
//----------------------------------------------------------------------------------------
//URL - http://localhost:5000/api/delete/hotels/ :id
//Method : DELETE - admin-hotel

app.delete("/api/delete/hotels/:id", (request, response) => {
  const sql_query = `DELETE FROM subash_travelix_hotel WHERE id=${request.params.id}`;
  connection.query(sql_query, (error, result) => {
    if(error){
      response.status(500).send(error)
    }
    else{
      response.status(200).send(result);
    }
  })
})
//----------------------------------------------------------------------------------------
//URL - http://localhost:5000/api/read/destination
//Method : GET - destination

app.get("/api/read/destination", (request, response) => {
  const destinationName = request.query.destinationName;
  const location = request.query.location;
  
  let sql_query = `SELECT * FROM subash_travelix WHERE destinationName LIKE'${destinationName}%' AND location LIKE '${location}%'`;
  
  if(destinationName=="" && location == ""){
    response.status(500).send("No Search Data");
    return;
  }
  connection.query(sql_query, (error, result) => {
    if(error){
      response.status(500).send(error);
    }
    else{
      response.status(200).send(result);
    }
  })
  
})
//----------------------------------------------------------------------------------------
//URL - http://localhost:5000/api/read/hotel
//Method : GET - destination
app.get("/api/read/hotel", (request, response) => {

  const destinationName = request.query.Destination;
  let sql_query =  `SELECT * from subash_travelix_hotel WHERE Destination LIKE '${destinationName}%'`;
  if(destinationName == ""){
    response.status(500).send("No Search Data");
    return;
  }

  connection.query(sql_query, (error, result) => {
    if(error){
      response.status(500).send(error);
    }
    else{

      const avaialbleHotles = result.filter((value , index) => {
        return value.Available == 1
      })

      response.status(200).send(avaialbleHotles);
    }
  })

})

const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log("Server is Running");
})


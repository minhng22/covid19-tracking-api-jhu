import bodyParser from 'body-parser'
import express from 'express'
import {database_middleware} from './src/middleware/index'
import router from './src/route'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const port = process.env.PORT || 8090 // Default port to listen

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use((req, res, next)=> {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

/*
** Start the Express server
*/
app.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log(`server started at http://localhost:${port}`)
});

app.get("/", (req, res) => {
    res.send('Main view.')
})

/*
** Route import
*/
app.use("/api", database_middleware.connect_mongodb, router)
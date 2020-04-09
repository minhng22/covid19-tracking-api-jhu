import bodyParser from 'body-parser'
import express from 'express'
import {database_middleware} from './src/middleware/index'
import router from './src/route'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const port = 8090 // Default port to listen

app.use(bodyParser.urlencoded({ extended: true }))

/*
** Start the Express server
*/
app.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log(`server started at http://localhost:${port}`)
});

/*
** Route import
*/
app.use("/api", database_middleware.connect_mongodb, router)
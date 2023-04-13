const bodyParser = require('body-parser');
const {PORT,DB_SYNC} = require('./config/serverConfig');
const express = require('express');


const apiRoutes =  require('./routes/index');
const db = require('./models/index');
const app = express();

const startBookingServiceServer = ()=>{

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));
    

    app.use('/bookingservice/api',apiRoutes);  

    if(JSON.parse(DB_SYNC)){
        console.log(DB_SYNC);
      // db.sequelize.sync({alter:true});
    }

    app.listen(PORT,() =>{
        console.log('Server started on port '+PORT);
      
    })
}

startBookingServiceServer()
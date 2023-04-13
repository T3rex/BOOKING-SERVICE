const express = require('express');
const {BookingController} = require('../../controllers/index');

const router = express.Router();

const bookingController =  new BookingController();

router.post('/bookings',bookingController.create);
router.get('/info',(req,res) =>{
    return res.json({message: "booking service"})
});
//router.post('/publish',bookingController.sendMessageToQueue);

module.exports = router;
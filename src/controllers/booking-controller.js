const {BookingService} =  require('../services/index');
const {StatusCodes} =  require('http-status-codes');
const {createChannel, publishMessage} =  require('../utils/messageQueue');
const {REMINDER_BINDING_KEY} = require('../config/serverConfig');

const bookingService = new BookingService();


class BookingController{

 

    async create(req,res) {
    try {
        const response = await bookingService.createBooking(req.body);
        console.log("From booking controller", response);
        return res.status(StatusCodes.OK).json({
            message: 'Succesfully completed booking',
            success: true,
            err: {},
            data: response
        });
    } catch (error) {
            console.log('Something went wrong in booking controller');
            console.log("from booking controller error",error);
            // return res.status(error.statusCode).json({
            //     message: error.message,
            //     success: false,
            //     err: error.description,
            //     data: {}
            // })
            return res.status(400).json({
                message: error,
                success: false,
                err: error,
                data: {}
            })
        }   
    }
}



module.exports =  BookingController;
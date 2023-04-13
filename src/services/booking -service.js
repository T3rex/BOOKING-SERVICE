 const {BookingRepository} =  require('../repository/index');
 const {FLIGHT_SERVICE_PATH,REMINDER_BINDING_KEY,EMAIL_REQUEST_URL} = require('../config/serverConfig');
 const {ServiceError} = require('../utils/errors/index');
 const {createChannel,publishMessage} =  require("../utils/messageQueue");
 const axios = require('axios');

class BookingService {
    constructor(){
        this.bookingRepository =  new BookingRepository();
    }

    async createBooking(data){
        try {
            const flightId = data.flightId;            
            const getFlightRequestURL = `${FLIGHT_SERVICE_PATH}/api/v1/flight/${flightId}`
            const flight = await axios.get(getFlightRequestURL);
            const flightData =  flight.data.data;
            let priceOfTheFlight = flightData.price;
            if(data.noOfSeats > flightData.totalSeats){
                throw new ServiceError('Something went wrong in the booking process, "Insufficient seats')
            }
            const totalCost = priceOfTheFlight * data.noOfSeats;
            const bookingPayload = {...data,totalCost: totalCost};
            const booking = await this.bookingRepository.create(bookingPayload);
            const updateFlightRequestURL = `${FLIGHT_SERVICE_PATH}/api/v1/flight/${flightId}`
            await axios.patch(updateFlightRequestURL,{totalSeats: flightData.totalSeats - data.noOfSeats});
            const sendMsg =  await this.sendMessageToQueue({userId: data.userId, flightId: flightId});
            console.log(sendMsg);
            const finalBooking = await this.bookingRepository.updateBooking(booking.id,{status: "Booked"})
            return finalBooking;
        } catch (error) {
            console.log("Something went wrong in Booking Service");
            if(error.name == "RepositoryError" || error.name == "ValidationError"){
                throw error;
            }
            throw error;
        }
    }

     async sendMessageToQueue(flightDetails){
        const channel = await createChannel();
        const userId = flightDetails.userId;
        const emailRequestURL =  `${EMAIL_REQUEST_URL}/api/v1/getEmail/${userId}`;
        const userDetails = await axios.get(emailRequestURL);        
        const data = {
            data: {
                subject: "Your booking is confirmed",
                content: `Your booking for flight ID ${flightDetails.flightId} has been confirmed`,
                receipentEmail: userDetails.data.data.email,
                notificationTime: new Date()
            }, service: "CREATE_TICKET"}
        await publishMessage(channel,REMINDER_BINDING_KEY,JSON.stringify(data));
        return {
            message: "Succesfully published the event"
        };
    }
}

module.exports = BookingService;
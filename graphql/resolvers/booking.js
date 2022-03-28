const Event = require('../../database/models/event');
const Booking = require('../../database/models/booking');
const { transformBooking, transformEvent } = require('./merge');



module.exports = {

    //GET BOOKINGS
    bookings: async (args, req) => {
        //checks auth
        if (!req.isAuth) {
            throw new Error('Unauthenticated')
        }

        try {
            const bookings = await Booking.find();
            return bookings.map(booking => {
                return transformBooking(booking);
            });
        } catch (err) {
            console.log(err)
            throw err;
        }
    },

    //CREATE BOOKING
    bookEvent: async (args, req) => {
        //checks auth
        if (!req.isAuth) {
            throw new Error('Unauthenticated')
        }

        const fetchedEvent = await Event.findOne({ _id: args.eventId });
        const booking = new Booking({
            user: req.userId,
            event: fetchedEvent
        });
        const result = await booking.save();
        return transformBooking(result)
    },

    //CANCEL BOOKING
    cancelBooking: async (args, req) => {
        //checks auth
        if (!req.isAuth) {
            throw new Error('Unauthenticated')
        }

        try {
            const booking = await Booking.findById(args.bookingId).populate('event');
            const event = transformEvent(booking.event);
            await Booking.deleteOne({ _id: args.bookingId });
            return event;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }
};
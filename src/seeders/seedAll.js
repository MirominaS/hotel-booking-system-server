import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { faker } from "@faker-js/faker";

import User from "../models/User.js";
import HotelOwner from "../models/HotelOwner.js";
import Hotel from "../models/Hotel.js";
import RoomType from "../models/RoomType.js";
import Room from "../models/Room.js";
import Booking from "../models/Booking.js";
import Payment from "../models/Payment.js";

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("Connected");

    // clear data
    await Payment.deleteMany({});
    await Booking.deleteMany({});
    await Room.deleteMany({});
    await RoomType.deleteMany({});
    await Hotel.deleteMany({});
    await HotelOwner.deleteMany({});
    await User.deleteMany({});

    const password = await bcrypt.hash("123456", 10);

    // admin
    const admin = await User.create({
      firstName: "Admin",
      lastName: "User",
      email: "admin@test.com",
      password,
      role: "admin",
    });

    // owners
    const owners = [];

    for (let i = 1; i <= 2; i++) {
      const owner = await User.create({
        firstName: `Owner${i}`,
        lastName: "Test",
        email: `owner${i}@test.com`,
        password,
        role: "hotel_owner",
        phone: `07712345${i}${i}`,
      });

      await HotelOwner.create({
        user: owner._id,
        ownerNicNumber: `NIC000${i}`,
        status: "approved",
      });

      owners.push(owner);
    }

    // customers
    const customers = [];

    for (let i = 1; i <= 5; i++) {
      const customer = await User.create({
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: `customer${i}@test.com`,
        password,
        role: "customer",
        phone: `07111111${i}`,
      });

      customers.push(customer);
    }

    // hotels
    const hotels = [];

    for (let i = 0; i < owners.length; i++) {
      const hotel = await Hotel.create({
        user: owners[i]._id,
        hotelName: `Demo Hotel ${i + 1}`,
        description: "Demo hotel for testing",
        hotelAddress: "123 Main Street",
        city: "Galle",
        district: "Galle",
        contactNumber: "0771234567",
        email: `hotel${i + 1}@test.com`,
        businessRegistrationNumber: `BR000${i + 1}`,
        amenities: ["WiFi", "Pool", "Restaurant", "Parking"],
        starRating: 5,
        status: "approved",
        isActive: true,
      });

      hotels.push(hotel);
    }

    // room types
    const roomTypes = [];

    for (const hotel of hotels) {
      roomTypes.push(
        await RoomType.create({
          hotel: hotel._id,
          name: "Standard",
          capacity: 2,
          pricePerNight: 100,
        }),
      );

      roomTypes.push(
        await RoomType.create({
          hotel: hotel._id,
          name: "Deluxe",
          capacity: 3,
          pricePerNight: 200,
        }),
      );

      roomTypes.push(
        await RoomType.create({
          hotel: hotel._id,
          name: "Family Suite",
          capacity: 5,
          pricePerNight: 350,
        }),
      );
    }

    // rooms
    const rooms = [];
    let roomNumber = 101;

    for (const roomType of roomTypes) {
      for (let i = 0; i < 5; i++) {
        const room = await Room.create({
          hotel: roomType.hotel,
          roomType: roomType._id,
          roomNumber: roomNumber++,
          isActive: true,
        });

        rooms.push(room);
      }
    }

    // bookings
    const bookings = [];

    const statuses = ["confirmed", "pending", "cancelled"];

    for (let i = 0; i < 50; i++) {
      const room = rooms[Math.floor(Math.random() * rooms.length)];

      const roomType = roomTypes.find(
        (r) => r._id.toString() === room.roomType.toString(),
      );

      const customer = customers[Math.floor(Math.random() * customers.length)];

      const offset = faker.number.int({
        min: -30,
        max: 30,
      });

      const checkIn = new Date();
      checkIn.setDate(checkIn.getDate() + offset);

      const checkOut = new Date(checkIn);
      checkOut.setDate(checkOut.getDate() + 2);

      const booking = await Booking.create({
        bookingReference: `BK${10000 + i}`,
        customer: customer._id,
        hotel: room.hotel,
        room: room._id,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        numberOfGuests: faker.number.int({
          min: 1,
          max: roomType.capacity,
        }),
        totalPrice: roomType.pricePerNight * 2,
        status: statuses[Math.floor(Math.random() * statuses.length)],
      });

      bookings.push(booking);
    }

    // payments
    for (const booking of bookings.slice(0, 30)) {
      const payment = await Payment.create({
        bookingReference: booking.bookingReference,
        customer: booking.customer,
        stripeSessionId: faker.string.uuid(),
        amount: booking.totalPrice,
        customerEmail: `payment${booking._id}@test.com`,
        status: "paid",
      });

      booking.payment = payment._id;
      await booking.save();
    }

    console.log("================================");
    console.log("SEED COMPLETE");
    console.log("================================");
    console.log("Admin:");
    console.log("admin@test.com / 123456");
    console.log("");
    console.log("Owners:");
    console.log("owner1@test.com / 123456");
    console.log("owner2@test.com / 123456");
    console.log("");
    console.log("Customers:");
    console.log("customer1@test.com / 123456");
    console.log("customer2@test.com / 123456");
    console.log("customer3@test.com / 123456");
    console.log("customer4@test.com / 123456");
    console.log("customer5@test.com / 123456");

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seed();

const stripe = require('stripe')(process.env.SCRIPT_SECRET_KEY);
const path = require('path');
const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');

const domain = 'http://localhost:5173';

const getCheckout = catchAsync(async (req, res, next) => {
  // 1) Get the currently booked tour
  const tour = await Tour.findOne({ slug: req.params.tourSlug });
  console.log(tour);
  // 2) Create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    success_url: `${domain}/`,
    cancel_url: `${domain}/tours/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: tour.id,
    line_items: [
      {
        price_data: {
          currency: 'usd',
          unit_amount: tour.price * 100,
          product_data: {
            name: `${tour.name} Tour`,
            description: tour.summary,
            images: [`https://www.natours.dev/img/tours/${tour.imageCover}`],
          },
        },
        quantity: 1,
      },
    ],
  });

  // 3) Create session as response
  res.status(200).json({
    status: 'success',
    data: session,
  });
});

module.exports = { getCheckout };

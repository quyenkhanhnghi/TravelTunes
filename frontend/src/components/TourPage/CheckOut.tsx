import { loadStripe } from '@stripe/stripe-js';
import React, { useState } from 'react';
import { checkoutSession } from '../../services/fetch';

interface CheckOutProps {
  tourSlug: string;
}

export const CheckOut: React.FC<CheckOutProps> = ({ tourSlug }) => {
  const stripePromise = loadStripe(
    'pk_test_51NdC5EHCvtfDFvkAkxHMrlR9m6k4aql9MGOz9q3sZYDVTk7s8IVESGgVN1roxMJTSAWohsTEzcOsycx4Jw89Bh1E00oldyCqyA'
  );
  const [stripeError, setStripeError] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const handleCheckOut = async () => {
    setLoading(true);
    try {
      const res = await checkoutSession(tourSlug);
      const stripe = await stripePromise;
      console.log(res);
      const { error } = await stripe.redirectToCheckout({
        sessionId: res.data.id,
      });
      if (error) setStripeError(error.message);
    } catch (err) {
      console.log(err);
      setStripeError(err.message);
    }
    setLoading(false);
  };
  if (stripeError) alert(stripeError);
  return (
    <>
      <button
        className='btn btn--green span-all-rows'
        onClick={handleCheckOut}
        disabled={isLoading}
      >
        {isLoading ? 'Processing' : 'Book tour now!'}
      </button>
    </>
  );
};

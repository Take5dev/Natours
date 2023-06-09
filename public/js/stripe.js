/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alert';

// const stripe = Stripe(
//   'pk_test_51N3ky5JtWwIE9Ig8BLVJh5YmicgQedZKCmwusYSY3wTku1RiC01SZxduTR5WGAGBySCUIvBOKg40bO9xw6ZdZAPW00haQaJm5a'
// );

export const bookTour = async (tourID) => {
  try {
    const session = await axios(`/api/v1/bookings/checkout-session/${tourID}`);
    //console.log(session.data.data.session.url);
    location.replace(session.data.data.session.url);
  } catch (err) {
    console.error(err.response.data);
    showAlert('error', err.response.data.message);
  }
};

/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alert';

export const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `/api/v1/users/login`,
      data: {
        email,
        password,
      },
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Login successful');
      window.setTimeout(() => location.assign('/'), 1500);
    }
  } catch (err) {
    console.error(err.response.data);
    showAlert('error', err.response.data.message);
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: `/api/v1/users/logout`,
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Logout successful');
      location.reload(true);
    }
  } catch (err) {
    console.error(err.response.data);
    showAlert('error', err.response.data.message);
  }
};

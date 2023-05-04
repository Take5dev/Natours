/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alert';

export const updateSettings = async (data, type) => {
  try {
    const url = type === 'data' ? 'updateCurrentUser' : 'updatePassword';
    const res = await axios({
      method: 'PATCH',
      url: `http://localhost:8000/api/v1/users/${url}`,
      data,
    });
    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} updated successfully`);
      //location.reload(true);
    }
  } catch (err) {
    console.error(err.response.data);
    showAlert('error', err.response.data.message);
  }
};

// export const updateData = async (name, email) => {
//   try {
//     const res = await axios({
//       method: 'PATCH',
//       url: `http://localhost:8000/api/v1/users/updateCurrentUser`,
//       data: {
//         name,
//         email,
//       },
//     });
//     if (res.data.status === 'success') {
//       showAlert('success', 'Your settings have been updated successfully');
//       location.reload(true);
//     }
//   } catch (err) {
//     console.error(err.response.data);
//     showAlert('error', err.response.data.message);
//   }
// };

// export const updatePassword = async (
//   oldPassword,
//   password,
//   passwordConfirm
// ) => {
//   try {
//     const res = await axios({
//       method: 'PATCH',
//       url: `http://localhost:8000/api/v1/users/updatePassword`,
//       data: {
//         oldPassword,
//         password,
//         passwordConfirm,
//       },
//     });
//     if (res.data.status === 'success') {
//       showAlert('success', 'Your password have been changed');
//     }
//   } catch (err) {
//     console.error(err.response.data);
//     showAlert('error', err.response.data.message);
//   }
// };

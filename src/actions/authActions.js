/**
 * Auth Actions
 */

import { AsyncStorage } from 'react-native';
import { getTokenPayload } from '../helpers/JwtHelper';

export function userLogin(token) {
  AsyncStorage.getItem('token')
    .then((value) => {
      if (value !== token) {
        AsyncStorage.setItem('token', token);
        // AsyncStorage.setItem('email', email);
      }
    });

  const payload = getTokenPayload(token);
  const sessionData = {
    expiration: payload.exp,
    customer: payload.customer,
    id: payload._id,
    name: payload.name,
  };

  return {
    type: 'LOGGING_USER',
    token,
    // email,
    sessionData,
  };
}

export function userLogout() {
  AsyncStorage.removeItem('token')
    .catch(err => console.log('[Error] - userLogoutAction', err));

  return {
    type: 'LOGOUT_USER',
  };
}

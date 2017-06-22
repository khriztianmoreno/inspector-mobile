/**
 * Service for handling login request
 *
 */

import AppConfig from '../config';
import request from '../helpers/FetchTimeout';

class AuthService {
  constructor() {
    this.baseUrl = `${AppConfig.serverURL}/auth/local`;
  }

  login(email, password) {
    return request(this.baseUrl, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    }, 15000);
  }

}

export default new AuthService();

/**
 * Service for making requests to the Customer Service
 * Methods:
 * searchByPlate(plate)   -> Promise
 * update(vehicleObject)  -> Promise
 */

import AppConfig from '../config';

class UserService {
  constructor() {
    this.baseUrl = `${AppConfig.serverURL}/api/users`;
  }

  findById(id, token) {
    return fetch(`${this.baseUrl}/${id}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
  }

  findByEmail(email, token) {
    return fetch(`${this.baseUrl}/mobile/find/${email}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
  }

}

export default new UserService();

/**
 * Service for making requests to the Vehicle Service
 * Methods:
 * searchByPlate(plate)   -> Promise
 * update(vehicleObject)  -> Promise
 */

import AppConfig from '../config';
import request from '../helpers/FetchTimeout';

class VehicleService {
  constructor() {
    this.baseUrl = `${AppConfig.serverURL}/api/vehicles`;
  }

  searchByPlate(plate, token) {
    return fetch(`${this.baseUrl}/plate/${plate}/`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
  }

  get(id, token) {
    return request(`${this.baseUrl}/${id}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }, 8000);
  }

  create(vehicle, token) {
    return request(`${this.baseUrl}/`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(vehicle),
    }, 8000);
  }

  update(vehicle, token) {
    return request(`${this.baseUrl}/${vehicle._id}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(vehicle),
    }, 8000);
  }

}

export default new VehicleService();

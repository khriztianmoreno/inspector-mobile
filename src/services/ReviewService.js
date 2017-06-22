/**
 * Inspection Service
 * Description: Retrieve data from the inspection end point
 * 
 */

import AppConfig from '../config';

// TODO: Add token support

class ReviewService {
  constructor() {
    this.baseUrl = `${AppConfig.serverURL}/api/reviews`;
  }

  create(review, token) {
    return fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'Content-type': 'application/json',
      },
      body: JSON.stringify(review),
    });
  }

  getAll(token) {
    return fetch(this.baseUrl, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
  }
}

export default new ReviewService();

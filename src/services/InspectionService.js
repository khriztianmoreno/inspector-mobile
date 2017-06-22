/**
 * Inspection Service
 * Description: Retrieve data from the inspection end point
 * 
 */

import AppConfig from '../config';

// TODO: Add token support

class InspectionService {
  constructor() {
    this.baseUrl = `${AppConfig.serverURL}/api/inspections`;
  }

  getInspections(callback, token) {
    return fetch(this.baseUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    })
      .then(res => res.json())
      .then(json => callback(json))
      .catch(err => callback(undefined, err));
  }
}

export default new InspectionService;
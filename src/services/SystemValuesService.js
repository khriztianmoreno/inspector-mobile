/**
 * Service for fetching system values from
 *  the Mobi API.
 */

import AppConfig from '../config';

const groups = {
  cities: 'cities',
  roles: 'roles',
  brands: 'brands',
  class: 'class',
  line: 'line',
  line2: 'line2',
  documents: 'documents',
  insuranceCompany: 'insuranceCompany',
  customerTypes: 'customerTypes',
  inspectionType: 'inspectionType',
};

const baseUrl = `${AppConfig.serverURL}/api/systemvalues`;

function fetchByGroup(group) {
  return fetch(`${baseUrl}/${group}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  });
}

const SystemValuesService = {
  fetchCities: () => fetchByGroup(groups.cities),
  fetchBrands: () => fetchByGroup(groups.brands),
  fetchClasses: () => fetchByGroup(groups.class),
  fetchLines: () => fetchByGroup(groups.line),
};

export default SystemValuesService;

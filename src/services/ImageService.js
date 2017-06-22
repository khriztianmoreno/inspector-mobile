/**
 * Service to upload images through the Mobi API
 */

import AppConfig from '../config';

const BASE_URL = `${AppConfig.serverURL}/api/images`;
const TOKEN_BASE = 'Bearer ';

function uploadFromBase64(base64WebImage, token) {
  return fetch(`${BASE_URL}/upload`, {
    method: 'POST',
    headers: {
      Authorization: `${TOKEN_BASE}${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ image: base64WebImage }),
  });
}

function uploadFromBase64Ref(base64WebImage, token, itemId) {
  return new Promise((resolve, reject) => {
    uploadFromBase64(base64WebImage, token)
      .then(res => res.json())
      .then(image => resolve({ itemId, url: image.image_url }))
      .catch(err => reject(err));
  });
}

const service = {
  uploadFromBase64,
  uploadFromBase64Ref,
};

export default service;

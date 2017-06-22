import CryptoJS from 'crypto-js';
import path from 'path';
import AppConfig from '../config';

class CDService {
  uploadMultiple(images) {
    const results = [];
    images.forEach((image) => {
      const promise = this.uploadPicture(image);
      results.push(promise);
    });
    return results;
  }

  uploadPicture(uri) {
    const timestamp = (Date.now() / 1000 | 0).toString();
    const { apiKey, apiSecret, cloudName } = AppConfig.cloudinary;
    const hashString = `timestamp=${timestamp}${apiSecret}`;
    const signature = CryptoJS.SHA1(hashString).toString();
    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const formData = new FormData();

      // Set the form data
      formData.append('file', { uri, type: 'image/png', name: path.basename(uri) });
      formData.append('timestamp', timestamp);
      formData.append('api_key', apiKey);
      formData.append('signature', signature);

      // Set XHR Params
      xhr.open('POST', uploadUrl);

      // XHR Callbacks
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(xhr.response);
        } else {
          reject({
            status: xhr.status,
            statusText: xhr.statusText,
          });
        }
      };

      xhr.onerror = () => {
        reject({
          status: xhr.status,
          statusText: xhr.statusText,
        });
      };

      xhr.send(formData);
    });
  }
}

export default new CDService();

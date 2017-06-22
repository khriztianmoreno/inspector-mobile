export default function request(url, options, timeout) {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => reject(new Error('Timeout')), timeout);
    fetch(url, options)
      .then(
        res => {
          clearTimeout(timeoutId);
          resolve(res);
        }
      )
      .catch(
        err => {
          clearTimeout(timeoutId);
          resolve(err);
        }
      );
  });
}

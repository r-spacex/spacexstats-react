import request from 'superagent';

// Do a GET request with the appropriate CSRF token set
const apiGet = (uri, payload) => {
  return request
    .get('https://api.spacexdata.com/v1' + uri, payload)
  ;
};
export default apiGet;

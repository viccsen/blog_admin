import request from '../utils/request';

export async function login(data) {
  return request('/api/user/login', {data, method: "POST"});
}

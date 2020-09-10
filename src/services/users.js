import request from '../utils/request';

export async function list(data) {
  return request('/api/user/list', {data, method: "GET"});
}

/**
 *
 * @param {*} name 用户名
 * @param {*} password 用户密码
 */
export async function create({
  name, password,
}) {
  return request('/api/user/create', {
    data: {
      name, password,
    }, method: "POST"
  });
}

/**
 * 删除用户
 * @param {*} id 用户id
 */
export async function remove({id}) {
  return request('/api/user/' + id, {method: "DELETE"});
}

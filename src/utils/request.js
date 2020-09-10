import {fetch} from 'dva';
import QueryString from 'qs';
import {history} from 'umi';
import {localCache, sessionCache} from "../caches";


const config = {};

export function set(key, value) {
  config[key] = value;
}

export function get(key) {
  return config[key];
}

function checkHttpStatus(url, opts) {
  return (response) => {
    if (response.status >= 200 && response.status < 300) {
      set('status', false);
      return response;
    }
    set('status', response.status);
    if (response.status === 401) {
      console.error({
        '错误原因': '401登录超时或未授权',
        '接口地址': url,
        '请求参数': opts,
        '接口返回': response,
      })
      // 登录超时的种情况不是太常见， 后台有效期28天， 前端缓存7天， 7天后自动刷新了，
      // 使用关闭窗口，有个好处，重新进入系统的时候 历史记录是正确的，
      // 如果是重新刷新Token，需要从微信那边拿到code 这样在浏览器历史记录中会有一个微信认证地址， 真的很麻烦
      // alert('登录超时');
      localCache.clear();
      sessionCache.clear();
    }

    if (response.status === 403) {
      console.error({
        '错误原因': '403用户无权限',
        '接口地址': url,
        '请求参数': opts,
        '接口返回': response,
      })
      history.replace('/403');
    }

    const error = new Error(response.statusText);
    error.response = response;
    error.code = response.status;
    throw error;
  }
}

function getResult(url, opts) {
  return (json) => {
    if (json.status === 1) {
      return {result: json.result};
    }
    const error = new Error(json.message || json.msg || '数据加载错误！');
    error.code = json.code;
    error.data = json;
    console.error({
      '错误原因': '调用接口出错',
      '接口地址': url,
      '请求参数': opts,
      '接口返回': error,
    })
    throw error;
  }
}

export default function request(url = '', options = {}, cache) {
  // if (get('status') * 1 === 401 && !options.ignoreStatus) {
  //   return Promise.reject('wait auth...')
  // }
  console.info('request ' + url);
  let data;
  if (typeof cache === 'function') {
    data = cache();
    if (data) {
      console.info(`Cache: ${options.method}`, url, data);
      return Promise.resolve(data);
    }
  }
  data = options.data;
  delete options.data;
  const opts = {
    method: 'POST',
    ...options,
  };
  opts.headers = {
    ...opts.headers,
  };

  const token = get('token');

  if (token) {
    opts.headers.authorization = token;
  }

  if (opts.method === 'GET' || (opts.method === 'DELETE' && data)) {
    url += (url.match(/\?/g) ? '&' : '?') + QueryString.stringify(data);
  } else {
    opts.headers['content-type'] = 'application/x-www-form-urlencoded'; //
    opts.body = QueryString.stringify(data);
    // opts.headers['content-type'] = 'application/json; charset=UTF-8';
    // opts.body = JSON.stringify(data); //QueryString.stringify(data); //JSON.stringify(data);
  }

  // 支持处理缓存
  const handleCache = data => {
    typeof cache === 'function' && cache(data.result);
    return data;
  };

  return fetch(url, opts)
    .then(checkHttpStatus(url, opts))
    .then(res => res.json())
    .then(getResult(url, opts))
    .then(handleCache);
}

import Model from 'dva-model';
import { Authenticate as namespace } from '../utils/namespace';
import { login } from '../services/authenticate';
import { set as setToken } from '../utils/request';
import { sessionCache, localCache } from '../caches';
import authenticateCache from '../caches/authenticate';


const auth = authenticateCache();
if (auth && auth.token) {
  setToken('token', auth.token);
}

export default Model({
  namespace,
  state: {
    authenticate: auth
  },
  subscriptions: {
    // setup({dispatch, history}) {

    // }
  },
  effects: {
    * logout(action, saga) {
      const state = yield saga.select(state => state);
      const nss = Object.keys(state);
      for (let i = 0, len = nss.length; i < len; i++) {
        if (nss[i] !== namespace) {
          yield saga.put({ type: nss[i] + '/clean' });
        }
      }
      yield saga.put({ type: 'logoutSuccess' });
    }
  },
  reducers: {
    loginSuccess(state, action) {
      const authenticate = action.payload;
      if (authenticate.token) {
        setToken('token', authenticate.token);
        authenticateCache(authenticate);
        return { ...state, authenticate };
      }
      return { ...state, authenticate: null };
    },
    logoutSuccess() {
      console.log('登出');
      setToken('token', null);
      authenticateCache.clear();
      sessionCache.clear();
      localCache.clear();
      return {};
    },
  },
}, {
    //services
    login
  }, {
    //caches
    login: authenticateCache
  });

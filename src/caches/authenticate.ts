import { localCache as storage, WEEK } from './index';

const KEY = 'authenticate';

export default function cache(authenticate: string): void | object {
  return authenticate ? storage.setItem(KEY, authenticate, WEEK) : storage.getItem(KEY);
}
cache.clear = function() {
  storage.removeItem(KEY);
};

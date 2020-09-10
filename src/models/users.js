import Model from 'dva-model';
import { Users as namespace } from '../utils/namespace';
import { list, create, remove } from '../services/users';

export default Model({
  namespace,
  state: {
  },
  subscriptions: {
    // setup({dispatch, history}) {

    // }
  },
  effects: {

  },
  reducers: {
  },
}, {
  //services
  list, create, remove
}, {
  //caches
});

import { notification } from 'antd';

export const dva = {
  config: {
    onError(err: ErrorEvent) {
      err.preventDefault();
      console.error(err.message);
      notification.error({
        message: err.message || '系统错误，请联系管理员',
        // description: err.stack
      });
    },
  },
};

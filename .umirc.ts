import { defineConfig } from 'umi';

export default defineConfig({
  title: "viccsen's management",
  antd: {},
  dva: {
    skipModelValidate: true
  },
  dynamicImport: {loading: '@/components/Loading'},
  favicon: "http://res.viccsen.com/static/%E5%B0%8F%E8%B7%AF%E7%97%B4-294852.png!s",
  hash: true,
  proxy: {
    '/api/*': {
      'target': 'http://192.168.1.157:3000/',
      // 'target': 'http://smart-campus-mp-test.yunzhiyuan100.com.cn/',
      'changeOrigin': true,
    },
  },
  theme: {
    '@primary-color': '#d38115',
  },
})


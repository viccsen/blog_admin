import { UserOutlined, SnippetsOutlined } from '@ant-design/icons';

export const menus = [{
  key: 'userManage',
  title: '用户管理',
  icon: <UserOutlined />,
  children: [{
    key: 'list',
    title: '用户列表',
    link: '/users'
  }, {
    key: 'visitor',
    title: '访客列表',
    link: '/visitor'
  }]
}, {
  key: 'bolgManage',
  title: "博客管理",
  icon: <SnippetsOutlined />,
  children: [{
    key: 'list',
    title: '博客列表',
    link: '/blogs'
  }]
}];

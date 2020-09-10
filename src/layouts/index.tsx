import React, { Component, Fragment, useState, useEffect } from 'react';
import { withRouter, Link, history } from 'umi';
import { Redirect } from 'react-router';
import zhCN from 'antd/es/locale/zh_CN';
import classNames from 'classnames';
import { connect } from 'dva';
import { BarsOutlined } from '@ant-design/icons';
import { Spin, Menu, ConfigProvider } from 'antd';
import { Authenticate as namespace } from '../utils/namespace';
import { addClass, removeClass } from '../utils/dom';
import Flex from '../components/Flex';
import { menus } from '../assets/config';
import styles from './index.less';


function MenuItemContent({ menu }) {

  const { link, title, onClick } = menu;
  const _onClick = onClick || (() => {
    // debugger
    history.push(link);
  });
  return (
    <a onClick={_onClick}>
      <span>{title}</span>
    </a>
  );
}

function SideHeader() {
  return (
    <header className={styles['side-header']}>
      <Link to="/">
        <span>管理后台</span>
      </Link>
    </header>
  );
}

function Bars({ onChange, isMin }) {
  return (
    <a className={styles['menu-handle']} onClick={() => {
      onChange(!isMin);
    }}>
      <BarsOutlined />
    </a>
  );
}

const UserSide = connect(state => ({
  resources: state[namespace].resources,
  loading: state.loading.models[namespace],
}))(
  function Side(props) {

    const {
      profile, loading, dispatch, location,
    } = props;

    const [isMin, setIsMin] = useState(true);

    useEffect(() => {
      dispatch({
        type: namespace + '/menu',
      });
    }, [dispatch]);

    useEffect(() => {
      if (isMin) {
        addClass(document.documentElement, 'side-small');
      } else {
        removeClass(document.documentElement, 'side-small');
      }
    }, [isMin]);

    const { pathname } = location;
    const [, defaultOpenKeys] = pathname.split('/');


    const [openKeys, setOpenKeys] = useState([]);

    return (
      <Fragment>
        <Flex direction="column"
          className={classNames(styles['side'], { [styles['min-side']]: isMin })}>
          <SideHeader />
          <Flex.Item className={styles['side-main']}>
            <Bars isMin={isMin} onChange={setIsMin} />
            <Spin spinning={!!loading}>
              {
                <Menu
                  theme="dark"
                  mode={'inline'}
                  inlineCollapsed={!!isMin}
                  defaultOpenKeys={[defaultOpenKeys]}
                  defaultSelectedKeys={[pathname]}
                  onOpenChange={openKeys => setOpenKeys(openKeys.length ? [openKeys.pop()] : [])}
                  openKeys={openKeys}
                >
                  {
                    menus && menus.map(submenu => (
                      <Menu.SubMenu
                        key={submenu.key}
                        icon={submenu.icon}
                        title={<span>{submenu.title}</span>}
                      >
                        {
                          submenu.children.map((menu) => (
                            <Menu.Item key={menu.link || menu.key}>
                              <MenuItemContent menu={menu} min={isMin} dispatch={dispatch} />
                            </Menu.Item>
                          ))
                        }
                      </Menu.SubMenu>
                    ))}
                </Menu>
              }
            </Spin>
          </Flex.Item>
        </Flex>
      </Fragment>
    );
  },
);


const AppLayout = withRouter(function AppLayout({ children, ...props }) {
  return (
    <div className={styles['layout']}>
      <UserSide {...props} />
      <div className={styles['main']}>
        {children}
      </div>
    </div>
  );
});

function BaseLayout({ location, children, ...props }) {
  const { pathname } = location;
  const notLayoutUrlList = ['/login', '/reset-password'];
  if (notLayoutUrlList.indexOf(pathname) >= 0) {
    return children;
  }
  return (
    <AppLayout {...props} location={location}>{children}</AppLayout>
  );
}

const PrivateRoute = ({ children, location, profile }) => {
  return (
    profile && profile.token ?
      children
      :
      <Redirect
        to={{
          pathname: '/login',
          state: { from: location },
        }}
      />
  );
};

function CheckProfile(props) {
  const { location: { pathname }, children } = props;
  if (pathname === '/login' || pathname === '/reset-password') {
    return children;
  } else {
    return <PrivateRoute {...props} />;
  }
}

class ErrorBoundary extends Component {
  state = {
    error: null,
    info: null,
  };

  componentDidCatch(error, info) {
    this.setState({ error, info });
  }

  render() {
    const { children } = this.props;
    const { error, info } = this.state;
    return (
      <Fragment>
        {children}
        {
          error ?
            <div>
              <h1>出错了</h1>
              <div>{error.message}</div>
              <div>{info}</div>
            </div>
            :
            null
        }
      </Fragment>
    );
  }
}

const App = connect(state => ({
  profile: state[namespace].authenticate,
}))(
  function _App({ children, ...props }) {
    return (
      <ConfigProvider locale={zhCN}>
        <ErrorBoundary {...props}>
          <CheckProfile {...props}>
            <BaseLayout {...props}>
              {children}
            </BaseLayout>
          </CheckProfile>
        </ErrorBoundary>
      </ConfigProvider>
    );
  },
);

export default App;




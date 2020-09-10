import React from 'react';
import {connect} from 'dva';
import {history} from 'umi';
import moment from 'moment';
import Page from '../../components/Page';
import {Authenticate} from '../../utils/namespace';
import styles from './index.less';
import {menus} from '../../assets/config';

const _weekMap = new Map([
  [0, '日'],
  [1, '一'],
  [2, '二'],
  [3, '三'],
  [4, '四'],
  [5, '五'],
  [6, '六'],
]);

function Home({loading, dispatch}) {

  const breadcrumb = ['首页'];
  const title = "欢迎来到Viccsen的后台管理系统";
  const headerOperation = <Page.Header.Operation dispatch={dispatch} />;
  const header = <Page.Header breadcrumb={breadcrumb} title={title} operation={headerOperation}/>;

  const menuList = menus && menus.length ? menus.reduce((arr, it) => {
    if (it.children && it.children.length) {
      arr = arr.concat(it.children);
    }
    return arr;
  }, []) : null;
  console.log('menus', menus);
  console.log('menuList', menuList);
  return (
    <Page className={styles['home-page']} mainClassName={styles['page-main']} header={header} loading={!!loading}>
      <div className={styles['welcome']}>
        <h3>今日，</h3>
        <p><span>{`${moment().format('YYYY年MM月DD日')}星期${_weekMap.get(moment().weekday())}`}，</span>{`欢迎您使用${name || ''}viccsen的后台管理系统`}</p>
      </div>
      <div className={styles['page-nav-list']}>
        <h3>当前功能</h3>
        <nav>
          {
            menuList && menuList.length ?
              menuList.map(it =>
                // eslint-disable-next-line
                <a key={it.id || it.link} onClick={() => {
                  history.push(it.link);
                }}>
                  <i className={styles['icon']}>{it.title.charAt(0)}</i>
                  {`${it.title} ${(it.controllerName || '').replace(/admin|Resource/g, '').replace(/^\w/, (a) => {
                    return a.toUpperCase();
                  })}`}
                </a>
              )
              :
              null
          }
        </nav>
      </div>
    </Page>

  );
};

export default connect(state => ({
  loading: state.loading.global,
}))(Home)

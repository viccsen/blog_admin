import React, { FC, useEffect, useState } from 'react';
import {connect} from 'react-redux';
import Page from '@/components/Page';
import styles from './create.less';

type Props = {
  dispatch: (action:any) => void;
};

const BlogCreate:FC<Props> = (props) => {
  const {dispatch} = props;
  const title = '添加博客';
  const breadcrumb = ['首页', '博客列表', '添加'];
  const headerOperation = <Page.Header.Operation dispatch={dispatch} />;
  const header = <Page.Header breadcrumb={breadcrumb} title={title} operation={headerOperation}/>;
  const pageProps = {
    header,
    loading: false,
    className: styles['create-page'],
  };
  return (<Page {...pageProps}>

  </Page>);
};

export default connect(state => ({

}))(BlogCreate);

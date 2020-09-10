import React, {FC} from 'react';
import {history} from 'umi';
import {connect} from 'react-redux';

import Page from '@/components/ListPage';

type Props = {
  location: any;
  dispatch: (action: any) => void;
};

const BolgList:FC<Props> = (props) => {
  const {location, dispatch} = props;
  const title = "博客列表";
  const breadcrumb = ['管理后台', title];

  const operations = [{
    key: 'create',
    title: '发表',
    type: 'primary',
    onClick: () => history.push('/blogs/create')
  }];

  const columns = [{
    title: 'ID',
    key: 'id',
  }, {
    title: '名称',
    key: 'name'
  }, {
    title: '创建时间',
    key: 'createTime',
  }, {
    title: '标签',
    key: 'tagList'
  }];

  const pageProps = {
    title,
    list: [],
    total: 0,
    columns,
    dispatch,
    location,
    breadcrumb,
    operations
  };

  return (
    <Page {...pageProps}>

    </Page>
  );
}

export default connect(state => ({

}))(BolgList);

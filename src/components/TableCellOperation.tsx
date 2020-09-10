import React, { Component, Fragment, ReactElement, FC } from 'react';
import { Link } from 'umi';
import { Popconfirm } from 'antd';
import Separate from './Separate';

enum OperationType {
  modify = '修改',
  remove = '删除',
  create = '创建',
  add = '添加',
  look = '查看',
  detail = '详情',
  allot = '分配',
  relate = '关联',
  edit = '编辑',
  print = '打印',
  preview = '预览',
  publish = '发布',
  offline = '下线',
  teachCalendar = '教学日历',
  save = '保存',
  cancel = '取消',
  graduate = '毕业此年级',
  changeUnit = '转班',
  addContacts = '添加家长',
  reStart = '重启',
  shutDown = '关机',
  timing = '定时',
};

interface Props {
  operations: any;
  children?: ReactElement<any>;
}

const TableCellOperation:FC<Props> = ({ children, operations = {} }) => {
  const style = { display: 'inline-block' };
  const list = Object.entries(operations)
    .map(([key, it]) => {
      const title = OperationType[key];
      if (!it || it.hidden) {
        return null;
      } else if (typeof it === 'function' && title) {
        return (
          <a key={key} style={style} onClick={it} children={title}/>
        );
      } else if (typeof it === 'string' && title) {
        return <Link key={key} children={title} to={it}/>;
      } else if (it.to && title) {
        return <Link key={key} children={title} {...it} />;
      } else if (it.onConfirm) {
        const onConfirm = it.onConfirm;
        delete it.onConfirm;
        let title = '';
        it.children = it.children || OperationType[key];
        if (typeof it.children === 'string') {
          title = it.children;
        } else {
          title = OperationType[key] || '';
        }
        title = '确定要' + title + '吗？';
        return (
          <Popconfirm key={key} title={it.confirmtitle || it.confirmTitle || title} onConfirm={onConfirm}>
            <a style={style} {...it}>{it.children}</a>
          </Popconfirm>
        );
      } else {
        return (
          <a key={key} style={style} {...it}>{it.children}</a>
        );
      }
    })
    .concat(children)
    .filter(it => !!it)
    .reduce((arr, it, index, array) => {
      if (it instanceof Component && !it.key) {
        it.key = 'operation-' + index;
      }
      arr.push(it);
      if (index < array.length - 1) {
        arr.push(<Separate key={'separate-' + index}/>);
      }
      return arr;
    }, []);
  return (
    <Fragment>
      {list}
    </Fragment>
  );
}

export default TableCellOperation;

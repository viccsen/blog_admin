import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table } from 'antd';
import { history } from 'umi';
import moment from 'moment';
import classNames from 'classnames';
import Page from '@/components/Page';
import PageHeaderOperation from '@/components/Page/HeaderOperation';
import styles from './index.less';


/**
 * 默认的分页组件配置
 * @param query
 * @param total
 * @returns {{total: *, pageSize: (Number|number), current: (Number|number), showSizeChanger: boolean, showTotal: (function(*): string), pageSizeOptions: string[]}}
 */
export function paginationConfig(query, total) {
  return {
    total: total,
    showSizeChanger: true,
    hideOnSinglePage: true,
    current: parseInt(query.p, 10) || 1,
    showTotal: total => `共 ${total} 条`,
    pageSize: parseInt(query.s, 10) || 30,
    pageSizeOptions: ['10', '30', '50', '100'],
  };
}

export function stdColumns(cols) {
  return cols.map(col => {
    if (
      (col.key === 'operation' || col.key === 'operate') &&
      typeof col.dataIndex === 'undefined'
    ) {
      col.dataIndex = 'id';
    }
    if (
      col.key === 'created_at' ||
      col.key === 'updated_at' ||
      col.key === 'dateCreated' ||
      col.key === 'date_created' ||
      col.key === 'last_updated' ||
      col.key === 'lastUpdated' ||
      col.key === 'releaseTime' ||
      col.type === 'dateTime'
    ) {
      col.render = v => (v ? moment(v).format(col.format || 'YYYY-MM-DD HH:mm:ss') : '');
      if (typeof col.width === 'undefined') {
        col.width = 120;
      }
    }
    if (typeof col.dataIndex === 'undefined') {
      col.dataIndex = col.key;
    }
    if (col.tac !== false) {
      col.className = (col.className || '') + ' tac';
    }

    if (typeof col.width === 'undefined') {
      col.width = 60;
    }

    if(!col.align) {
      col.align = 'center';
    }

    return col;
  });
}

export function buildHandleTableChange({
  onChange, location
}) {
  return (pagination, filters, sorter) => {
    const { query, pathname } = location;
    let _query = { ...query };
    Object.keys(filters).forEach(key => {
      if (filters[key] && filters[key].length) {
        _query[key] = filters[key].join(',');
      } else {
        delete _query[key];
      }
    });
    if (pagination) {
      _query.p = pagination.current;
      _query.s = pagination.pageSize;
    }
    const __query = onChange && onChange(pagination, filters, sorter) || {};
    history.replace({ pathname, query: { ..._query, ...__query } });
  }
};

interface PageProps {
  list: any[],
  total: number,
  loading?: boolean,
  columns: any[],
  breadcrumb?: any[],
  title: string,
  operations: any[],
  headerChildren?: any,
  location: any,
  pagination?: boolean,
  scrollHeight?: number,
  rowClassName?: any,
  rowKey?: string,
  rowSelection?: any,
  className?: string,
  footer?: any,
  dispatch?: (action: any) => void
}

export default class ListPage extends Component<PageProps> {
  static propTypes = {
    list: PropTypes.array,
    total: PropTypes.number,
    loading: PropTypes.bool,
    columns: PropTypes.array,
    breadcrumb: PropTypes.array,
    title: PropTypes.string,
    operations: PropTypes.array,
    headerChildren: PropTypes.any,
    location: PropTypes.object,
    pagination: PropTypes.bool,
    scrollHeight: PropTypes.number,
    rowClassName: PropTypes.func,
    rowKey: PropTypes.string,
    rowSelection: PropTypes.object,
    className: PropTypes.string,
    footer: PropTypes.any,
  };

  render() {
    const {
      list,
      total,
      loading,
      columns,
      breadcrumb,
      title,
      operations,
      headerChildren,
      dispatch,
      location,
      pagination,
      scrollHeight = 155,
      children,
      rowClassName,
      rowKey = 'id',
      rowSelection,
      className,
      footer
    } = this.props;
    const { query } = location;
    const headerOperation = <PageHeaderOperation dispatch={dispatch} buttons={operations} />;
    const header = (
      <Page.Header breadcrumb={breadcrumb} title={title} operation={headerOperation}>
        {headerChildren}
      </Page.Header>
    );
    const handleTableChange = buildHandleTableChange({
      onChange: this.props.onChange,
      location
    });

    const _columns = stdColumns(columns) || [];

    return (
      <Page header={header} loading={!!loading} className={classNames(styles['list-page'], className)}>
        {
          <div className="list-page-main">
            {children}
            {
              _columns && _columns.length ?
                <div className="list-table-container">
                  <Table
                    className="list-table"
                    bordered
                    columns={_columns}
                    dataSource={Array.isArray(list) ? list : []}
                    pagination={pagination ? paginationConfig(query, total) : false}
                    onChange={handleTableChange}
                    scroll={{ y: window.innerHeight - (pagination ? scrollHeight : (scrollHeight || 105)) }}
                    rowClassName={rowClassName}
                    rowKey={rowKey}
                    rowSelection={rowSelection}
                  />
                </div>
                :
                null
            }
          </div>
        }
        {footer}
      </Page>
    );
  }
}

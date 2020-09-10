import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'dva';
import {UserOutlined, PlusOutlined} from '@ant-design/icons';
import {Button, Popconfirm, Popover, Tooltip, Modal, Cascader} from 'antd';
import {Authenticate} from '../../utils/namespace';
import {history, Link} from 'umi';
import './index.less';

@connect(state => ({
  profile: state[Authenticate].authenticate,
}))
class HeaderOperation extends Component {
  static propTypes = {
    profile: PropTypes.object,
    buttons: PropTypes.array,
  };

  render() {
    const {profile, buttons = [], children, dispatch} = this.props;

    const defaultButtons = {
      create: {
        title: '创建',
        icon: <PlusOutlined />
      },
      edit: {
        title: '编辑',
        icon: 'edit',
        onClick: () => {
          console.error('没有实现的编辑操作');
        },
      },
      remove: {
        title: '删除',
        icon: 'cross-circle-o',
        confirm: '',
        onConfirm: () => {
          console.error('没有实现的删除操作');
        },
      },
      cancel: {
        title: '取消',
        icon: 'rollback',
        onClick: e => {
          e.preventDefault();
          history.goBack();
          // dispatch(routerRedux.goBack());
        },
      },
      rollback: {
        title: '返回',
        icon: 'rollback',
        onClick: e => {
          e.preventDefault();
          history.goBack();
        },
      },
      add: {
        title: '添加',
        icon: 'plus',
        onClick: () => {
          console.error('没有实现的添加操作');
        },
      },
      filter: {
        title: '筛选',
        icon: 'filter',
        onClick: () => {
          console.error('没有实现的筛选操作');
        },
      },
      save: {
        title: '保存',
        icon: 'save',
        onClick() {
          console.error('没有实现的保存操作');
        },
      },
    };
    const operations =
      buttons && buttons.length ? (
        <Button.Group className={'page-header-right-operations'}>
          {buttons.map(button => {
            const props = {...defaultButtons[button.key], ...button};
            const title = props.title;
            const onConfirm = props.onConfirm;
            const confirm = props.confirm;

            if (!props.children) {
              props.children = title || props.key;
            }

            delete props.title;
            delete props.onConfirm;
            delete props.confirm;

            if (props.link) {
              const link = props.link;
              delete props.link;
              return (
                <Tooltip title={title} key={props.key + 'tooltip'}>
                  <Link to={link}>
                    <Button type="ghost" {...props} />
                  </Link>
                </Tooltip>
              );
            }
            const btn = (
              <Tooltip title={title} key={props.key + 'tooltip'}>
                <Button type="ghost" {...props} />
              </Tooltip>
            );

            return onConfirm ? (
              <Popconfirm
                title={confirm || '确定要删除吗？'}
                key={props.key + 'pop-confirm'}
                onConfirm={onConfirm}
              >
                {btn}
              </Popconfirm>
            ) : (
                btn
              );
          })}
        </Button.Group>
      ) : null;

    const handleExit = e => {
      e.preventDefault();
      dispatch({
        type: Authenticate + '/logout',
      });
    };

    const userOperations = profile ? (
      <a href="/" onClick={handleExit}>退出</a>
    ) : null;

    console.log('profile', profile);
    return (
      <div className="page-header-right">
        {operations}
        {children}
        <Popover placement="leftTop" title={`用户：${profile.nick || profile.username || 'admin'}`} content={userOperations}>
          <Button type="ghost" shape="circle" style={{marginLeft: '1em', border: 'none'}}>
            <UserOutlined style={{fontSize: '24px', color: '#0088ff'}} />
          </Button>
        </Popover>
      </div>
    );
  }
}

export default HeaderOperation;

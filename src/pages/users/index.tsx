import React, { FC, useEffect, useState } from 'react';
import { Modal, Form, Input, Button, notification, message } from 'antd';
import moment from 'moment';
import { history } from 'umi';
import { connect } from 'react-redux';
import Page from '@/components/ListPage';
import { Users as namespace } from '@/utils/namespace';
import TableCellOperation from '@/components/TableCellOperation';

type Props = {
  list?: any[];
  location: any;
  total?: number;
  loading?: boolean;
  dispatch: (action: any) => void;
};

const UsersList: FC<Props> = (props) => {
  const { loading, total, list = [], location, dispatch } = props;
  const { query } = location;
  const title = "用户列表";
  const breadcrumb = ['管理后台', title];
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [refreshTime, setRefreshTime] = useState(Date.now());
  const [currentItem, setCurrentItem] = useState();
  console.log('loading++', loading);

  const buttons = [{
    key: 'create',
    type: 'primary',
    onClick: () => {
      setCreateModalVisible(true);
    }
  }];

  const columns = [{
    title: 'ID',
    key: '_id',
    width: 120
  }, {
    title: '名称',
    key: 'name'
  }, {
    title: '创建时间',
    key: 'createdAt',
    render: v => v ? moment(v).format('YYYY-MM-DD HH:mm') : '-',
  }, {
    title: '更新时间',
    key: 'updatedAt',
    render: v => v ? moment(v).format('YYYY-MM-DD HH:mm') : '-',
  }, {
    title: '标签',
    key: 'tagList'
  }, {
    title: '操作',
    key: 'action',
    render: (_, row) => (
      <TableCellOperation
      operations={{
        remove: {
          onConfirm: () => {
            dispatch({
              type: namespace + '/remove',
              payload: {
                id: row._id
              }
            }).then(() => {
              setRefreshTime(Date.now());
              message.success('删除成功！');
            })
          }
        },
      }}
    />
    )
  }];

  const pageProps = {
    title,
    list,
    total,
    loading,
    columns,
    dispatch,
    location,
    breadcrumb,
    rowKey: '_id',
    operations: buttons,
    pagination: true,
  };

  const modalProps = {
    loading,
    item: currentItem,
    visible: createModalVisible,
    onClickCancel: () => setCreateModalVisible(false),
    onClickOk: payload => {
      console.log('payload', payload);
      dispatch({
        type: namespace + '/create',
        payload
      }).then(() => {
        message.success(`${payload.id ? '修改' : '创建'}成功`);
        setCreateModalVisible(false)
        setRefreshTime(Date.now());
      });
    }
  };

  useEffect(() => {
    dispatch({
      type: namespace + '/list',
      payload: {
        ...query
      }
    });
  }, [query, refreshTime]);

  return (
    <Page {...pageProps}>
      <CreateModal {...modalProps} />
    </Page>
  );
}

type CreateModalProps = {
  item?: any;
  visible: boolean;
  loading?: boolean;
  onClickCancel?: () => void;
  onClickOk?: (values: any) => void;
};

const CreateModal: FC<CreateModalProps> = (props) => {
  const { item, visible, loading, onClickOk, onClickCancel } = props;
  const [form] = Form.useForm();
  const onOk = (payload) => {
    form.validateFields()
    .then(onClickOk);
  }
  const modalProps = {
    title: `${item && item.id ? '修改' : '创建'}用户`,
    visible,
    onCancel: onClickCancel,
    footer: [
      <Button key="back" onClick={onClickCancel}>取消</Button>,
      <Button key="submit" type="primary" loading={loading} onClick={onOk}>确定</Button>,
    ]
  };
  const formProps = {
    form,
    name: 'userForm',
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
    initialValues: {}
  };
  return (
    <Modal {...modalProps}>
      <Form {...formProps}>
        <Form.Item
          name="name"
          label="大名"
          rules={[
            {
              required: true,
              message: 'Please input your name!',
            }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="password"
          label="密码"
          rules={[
            {
              required: true,
              message: 'Please input your password!',
            }, {
              pattern: /.{6,}/,
              message: '密码至少6位'
            }
          ]}
        >
          <Input.Password maxLength={16} />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default connect(state => ({
  list: state[namespace].list,
  total: state[namespace].total,
  loading: state.loading.global,
}))(UsersList);

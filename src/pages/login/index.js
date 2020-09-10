/* eslint-disable */
import React, {Component} from 'react';
import {connect} from 'dva';
import {history} from 'umi';
import { Input, Spin, Button, Checkbox, Form } from 'antd';
import {UserOutlined, LockOutlined} from '@ant-design/icons';
import {Authenticate as namespace, } from '../../utils/namespace';
import Particles from '../../components/Particles';
import styles from './index.less';
import CountDown from '../../utils/CountDown';
import {Redirect} from "react-router-dom";

const MOUNTED = Symbol('mount');

const LoginPage = connect(state => ({
  loading: state.loading.models[namespace],
}))(
  class LoginPageView extends Component {

    render() {
      const {loading} = this.props;
      return (
        <div className={styles['login-page']}>
          <Particles />
          <Spin spinning={!!loading} size="large" tip="正在登录...">
            <div className={styles['login-box']}>
              <div className={styles['login-box-left']}>
                <h1>后台</h1>
                <h1>管理系统</h1>
              </div>
              {/* <div className={styles['line']}/> */}
              <MobilepswdLogin {...this.props} />
            </div>
          </Spin>
        </div>
      );
    }
  }
);

export default LoginPage;

/**
 * 手机号、密码登录
 */
class MobilepswdLogin extends Component {

  state = {
    codeMode: false, //验证码登录
    redirectToReferrer: false,
    schoolTreeData: [],
    countDown: '获取',
    form: {}
  };

  formRef = React.createRef();

  countDown = new CountDown(
    count => {
      if (this[MOUNTED]) {
        this.setState({countDown: `${count}s `});
      }
    },
    () => {
      if (this[MOUNTED]) {
        this.setState({
          countDown: '获取',
        });
      }
    }
  );

  componentDidMount() {
    this[MOUNTED] = true;
  }

  onSubmit = () => {
    const {
      dispatch
    } = this.props;

    this.formRef.current.validateFields().then(payload => {
      console.log('payload', payload);
      dispatch({
        type: namespace + '/login',
        payload,
      }).then(res => {
        if (res && res.token) {
          history.replace('/');
        }
      });
    }).catch((errors) => {
      console.error(errors);
    });
  };

  componentWillUnmount() {
    delete this[MOUNTED];
    this.countDown.stop();
  }

  onCheckboxChange = e => {
    if (window.localStorage) {
      window.localStorage.setItem('rememberMe', e.target.checked ? 1 : 0);
    }
  }

  render() {
    let {from} = this.props.location.state || {from: {pathname: "/"}};
    let {redirectToReferrer} = this.state;
    if (redirectToReferrer) {
      console.log('Redirect -----> 手机号+密码登录成功，应该跳转', from);
      return <Redirect to={from} />;
    }
    // console.log('schoolTreeData', schoolTreeData)
    return (
      <Form layout="horizontal" wrapperCol={{span: 18, offset: 3}} name="control-ref" ref={this.formRef}>
        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) => prevValues.name !== currentValues.name}
        >
          {({getFieldValue}) => {
            return getFieldValue('name') !== 'other' ? (
              <Form.Item name="name" label="" rules={[{required: true, message: '请输入帐号'}]}>
                <Input
                  prefix={<UserOutlined className="site-form-item-icon" />}
                  placeholder="帐号" />
              </Form.Item>
            ) : null;
          }}
        </Form.Item>
        <Form.Item noStyle
          shouldUpdate={(prevValues, currentValues) => prevValues.password !== currentValues.password}
        >
          {({getFieldValue}) => {
            return getFieldValue('password') !== 'other' ? (
              <Form.Item name="password" label="" rules={[{required: true, message: '请输入密码'}]}>
                <Input.Password
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  placeholder="密码"
                />
              </Form.Item>
            ) : null;
          }}
        </Form.Item>
        <p style={{
          display: 'flex',
          margin: '-8px 0 12px 45px',
          justifyContent: 'space-between',
        }}>
          <Checkbox onChange={this.onCheckboxChange} defaultChecked={localStorage && localStorage.getItem('rememberMe') * 1 === 1 ? true : false}>记住密码</Checkbox>
          {/* <Link to='/reset-pswd'>忘记密码</Link> */}
          {/* <a onClick={() => this.setState({codeMode: !codeMode})}>{codeMode ? '密码登录' : '验证码登录'}</a> */}
        </p>
        <Form.Item wrapperCol={{span: 18, offset: 3}}>
          <Button type="primary" htmlType="submit" style={{display: 'block', width: '100%'}}
            onClick={this.onSubmit}>登录</Button>
        </Form.Item>
      </Form>
    )
  }
}

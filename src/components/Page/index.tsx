import React, { Component, FunctionComponent } from 'react';
import { HeartOutlined } from '@ant-design/icons';
// import { Icon as LegacyIcon } from '@ant-design/compatible';
import { Breadcrumb, Spin, Menu, Modal } from 'antd';
import { ModalFuncProps } from 'antd/lib/Modal';
import classNames from 'classnames';
import Operation from './HeaderOperation';
import Flex from '../Flex';
import './index.less';



const prefixCls = 'page-wrapper';

export type PageProps = {
  header?: React.ReactElement | string;
  footer?: React.ReactElement | string;
  loading?: boolean;
  mainClassName?: string;
  mainDirection?: 'column' | 'row';
  className?: string;
  style?: React.CSSProperties;
}

export default class Page extends Component<PageProps>{

  static Header: typeof PageHeader;
  static Footer: typeof PageFooter;

  static defaultProps = {
    mainDirection: 'column',
  };

  render() {
    const { children, header, footer, loading, className, style, mainClassName, mainDirection } = this.props;
    return (
      <Spin spinning={!!loading}>
        <Flex direction="column" className={classNames(prefixCls, className)} style={style}>
          {header}
          <Flex id="page-main" isItem direction={mainDirection}
            className={classNames(prefixCls + '-main', mainClassName)}>
            {children}
          </Flex>
          {footer}
        </Flex>
      </Spin>
    );
  }
}


export type PageHeaderPropsMenuItemProps = {
  key?: any;
  icon?: string;
  onClick?: (...args: any[]) => void;
  exec?: (...args: any[]) => void;
  confirm?: ModalFuncProps;
  disabled?: boolean;
  group?: PageHeaderPropsMenuItemProps[];
  subMenu?: PageHeaderPropsMenuItemProps[];
  children?: React.ReactElement | string;
  divider?: boolean;
  title?: React.ReactElement | string;
}

export type PageHeaderProps = {
  breadcrumb?: any[] | boolean;
  title?: string;
  operation?: React.ReactElement;
  className?: string;
  style?: React.CSSProperties;
  menu?: PageHeaderPropsMenuItemProps[];
}

export class PageHeader extends Component<PageHeaderProps>  {

  static Operation = Operation;

  render() {
    const { breadcrumb, title, operation, children, className, style, menu } = this.props;
    if (title && window.document.title !== title) {
      //只在标题不相同的时候设置
      window.document.title = title;
    }
    const _className = classNames(prefixCls + '-header', className);
    const map = {};

    return (
      <Flex className={_className} justify="space-around" align="middle" style={style}>
        <div className={prefixCls + '-header-title'}>
          <h1 title={title}>{title}</h1>
          {
            breadcrumb ?
              <Flex style={{ alignItems: 'center' }}>
                <HeartOutlined />
                <Breadcrumb>{renderBreadcrumb(breadcrumb)}</Breadcrumb>
              </Flex>
              :
              null
          }

        </div>
        <Flex.Item className={prefixCls + '-header-main'}>{children}</Flex.Item>
        {menu ? (
          <Menu
            selectable={false}
            style={{ position: 'relative', zIndex: 100, borderBottom: 0 }}
            mode="horizontal"
            onClick={({ item, key, keyPath }) => {
              // console.log(item, key, keyPath);
              const func = map[key];
              func && func();
            }}
          >
            {renderMenu(menu, map)}
          </Menu>
        ) : null}
        {operation}
      </Flex>
    );
  }
}

Page.Header = PageHeader;


const renderMenu = (data: PageHeaderPropsMenuItemProps[], map: any) =>
  data.map((menu, index) => {
    if (menu.onClick) {
      map[menu.key] = menu.onClick;
    } else if (menu.exec) {
      map[menu.key] = menu.exec;
    } else if (menu.confirm) {
      map[menu.key] = () => {
        menu.confirm && Modal.confirm(menu.confirm);
      };
    }

    if (menu.subMenu) {
      return (
        <Menu.SubMenu
          key={menu.key}
          disabled={menu.disabled}
          title={
            <span>
              {/* {menu.icon ? <LegacyIcon type={menu.icon}/> : null} */}
              {menu.title || menu.children || menu.key}
            </span>
          }
        >
          {renderMenu(menu.subMenu, map)}
        </Menu.SubMenu>
      );
    } else if (menu.group) {
      return (
        <Menu.ItemGroup
          //@ts-ignore
          title={
            <span>
              {/* {menu.icon ? <LegacyIcon type={menu.icon}/> : null} */}
              {menu.title || menu.children || menu.key}
            </span>
          }
        >
          {renderMenu(menu.group, map)}
        </Menu.ItemGroup>
      );
    } else if (menu.divider) {
      return <Menu.Divider key={menu.key || index} />;
    } else {
      return (
        <Menu.Item key={menu.key} disabled={menu.disabled}>
          {/* {menu.icon ? <LegacyIcon type={menu.icon}/> : null} */}
          {menu.title || menu.children || menu.key}
        </Menu.Item>
      );
    }
  });


function renderBreadcrumb(breadcrumb?: any[]) {
  return breadcrumb && breadcrumb.length
    ? breadcrumb.map((b, i) => <Breadcrumb.Item key={i}>{b}</Breadcrumb.Item>)
    : null;
}

export type PageFooterProps = {
  className?: string;
  style?: React.CSSProperties;
}
export const PageFooter: FunctionComponent<PageFooterProps> = (props) => {
  const className = classNames(prefixCls + '-footer', props.className);
  return <footer {...{ ...props, className }} />;
};

// @ts-ignore
Page.Footer = PageFooter;

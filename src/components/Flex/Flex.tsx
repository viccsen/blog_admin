import React, {Component} from 'react';
import classNames from 'classnames';
import './index.less';
import FlexItem from "@/components/Flex/FlexItem";

export interface FlexProps {
  id?: string;
  prefixCls?: string;
  className?: string;
  direction?: string,
  justify?: string,
  align?: string,
  isItem?: boolean,
  style?: React.CSSProperties,
  overflow?: string,
  wrap?: boolean,
  draggable?: boolean;
  onDragStart?: React.DragEventHandler<HTMLElement>;
  onDragOver?: React.DragEventHandler<HTMLElement>;
  onDragEnd?: React.DragEventHandler<HTMLElement>;
  onDrop?: React.DragEventHandler<HTMLElement>;
  // onTransitionEnd?: React.DragEventHandler<HTMLElement>;
}


export default class Flex extends Component<FlexProps> {

  static Item: typeof FlexItem;

  static defaultProps = {
    prefixCls: 'flex-wrapper',
  };

  render() {
    const {
      className, children, direction, isItem, justify, align, overflow, wrap,
      prefixCls,
      ...props
    } = this.props;
    const _className = classNames(className, prefixCls, {
      [prefixCls + '-direction-' + direction]: direction,
      [prefixCls + '-justify-' + justify]: justify,
      [prefixCls + '-align-' + align]: align,
      [prefixCls + '-item']: isItem,
      [prefixCls + '-overflow-' + overflow]: overflow,
      [prefixCls + '-wrap']: wrap,
      [prefixCls + '-nowrap']: !wrap,
    });
    return (
      <section className={_className} {...props}>
        {children}
      </section>
    );
  }

};


import React, {FunctionComponent} from 'react';
import classNames from 'classnames';
import './index.less';

export interface FlexItemProps {
  prefixCls?: string;
  className?: string;
  style?: React.CSSProperties,
  overflow?: string,
  onClick?: React.MouseEventHandler<HTMLElement>,
  onContextMenu?: React.MouseEventHandler<HTMLElement>,
  onDoubleClick?: React.MouseEventHandler<HTMLElement>,
  onMouseDown?: React.MouseEventHandler<HTMLElement>,
  onMouseEnter?: React.MouseEventHandler<HTMLElement>,
  onMouseLeave?: React.MouseEventHandler<HTMLElement>,
  onMouseMove?: React.MouseEventHandler<HTMLElement>,
  onMouseOut?: React.MouseEventHandler<HTMLElement>,
  onMouseOver?: React.MouseEventHandler<HTMLElement>,
  onMouseUp?: React.MouseEventHandler<HTMLElement>,
  onScroll?:React.UIEventHandler<HTMLElement>,
  onWheel?:React.WheelEventHandler<HTMLElement>,
}

const FlexItem: FunctionComponent<FlexItemProps> = (
  {
    prefixCls= 'flex-wrapper-item',
    className, style, children, overflow,
    onClick,
    onContextMenu,
    onDoubleClick,
    onMouseDown,
    onMouseEnter,
    onMouseLeave,
    onMouseMove,
    onMouseOut,
    onMouseOver,
    onMouseUp,
    onScroll,
    onWheel,
  }
)=>{
  return (
    <main className={classNames(prefixCls, className, {
      [prefixCls + '-' + overflow]: overflow
    })} style={style}
          onClick={onClick}
          onContextMenu={onContextMenu}
          onDoubleClick={onDoubleClick}
          onMouseDown={onMouseDown}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          onMouseMove={onMouseMove}
          onMouseOut={onMouseOut}
          onMouseOver={onMouseOver}
          onMouseUp={onMouseUp}
          onScroll={onScroll}
          onWheel={onWheel}
    >
      {children}
    </main>
  );
};

export default FlexItem;

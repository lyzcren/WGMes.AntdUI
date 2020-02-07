import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Form, Card, Button, Icon, List, Menu } from 'antd';

import Ellipsis from '@/components/Ellipsis';
import WgPageHeaderWrapper from '@/wg_components/WgPageHeaderWrapper';
import BasicView from './components/BasicView';
import ErpView from './components/ErpView';
import FieldsView from './components/FieldsView';

import styles from './List.less';

const { Item } = Menu;

/* eslint react/no-multi-comp:0 */
@connect(({ businessConfig }) => ({
  businessConfig,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    selectKey: 'basic',
    menuMap: {
      basic: '基础设置',
      erp: '同步设置',
      fields: '自定义字段',
    },
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'businessConfig/fetch',
    });
  }

  getMenu = () => {
    const { menuMap } = this.state;
    return Object.keys(menuMap).map(item => <Item key={item}>{menuMap[item]}</Item>);
  };

  getRightTitle = () => {
    const { selectKey, menuMap } = this.state;
    return menuMap[selectKey];
  };

  selectKey = key => {
    this.setState({
      selectKey: key,
    });
  };

  renderChildren = () => {
    const { selectKey } = this.state;
    switch (selectKey) {
      case 'basic':
        return <BasicView />;
      case 'erp':
        return <ErpView />;
      case 'fields':
        return <FieldsView />;
      default:
        break;
    }

    return null;
  };

  render() {
    const {} = this.props;
    const { selectKey } = this.state;

    const content = (
      <div className={styles.pageHeaderContent}>
        <p>
          全局业务设置，请务必在清晰了解整体业务后根据实际需要修改。若随意修改，可能导致系统无法正常使用。
        </p>
      </div>
    );

    const extraContent = (
      <div className={styles.extraImg}>
        {/* <img
          alt="这是一个标题"
          src="https://gw.alipayobjects.com/zos/rmsportal/RzwpdLnhmvDJToTdfDPe.png"
        /> */}
      </div>
    );

    return (
      <WgPageHeaderWrapper title="业务设置" content={content} extraContent={extraContent}>
        <div className={styles.main}>
          <div className={styles.leftMenu}>
            <Menu selectedKeys={[selectKey]} onClick={({ key }) => this.selectKey(key)}>
              {this.getMenu()}
            </Menu>
          </div>
          <div className={styles.right}>
            <div className={styles.title}>{this.getRightTitle()}</div>
            {this.renderChildren()}
          </div>
        </div>
      </WgPageHeaderWrapper>
    );
  }
}

export default TableList;

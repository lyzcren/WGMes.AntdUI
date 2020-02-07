import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Form, Card, Button, Icon, List, Menu } from 'antd';
import WgPageHeaderWrapper from '@/wg_components/WgPageHeaderWrapper';
import GridContent from '@/components/PageHeaderWrapper/GridContent';

import styles from './ErpView.less';

class ErpView extends PureComponent {
  state = {};

  render() {
    const {} = this.props;
    const { selectKey } = this.state;

    return <GridContent />;
  }
}

export default ErpView;

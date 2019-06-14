import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Modal } from 'antd';

import styles from './index.less';

/* eslint react/no-multi-comp:0 */
@connect(({ menu }) => ({
  menu,
}))
/* eslint react/no-multi-comp:0 */
@Form.create()
export class WgModal extends PureComponent {
  static defaultProps = {};

  constructor(props) {
    super(props);

    const { menu } = props;
    const container = menu.refPanes.find(x => x.id === menu.activeKey);
    this.state = {
      container: container || document.body,
    };
  }

  render() {
    const { container } = this.state;

    return (
      <Modal
        getContainer={() => container}
        maskStyle={{
          position: 'absolute',
          top: '108px',
        }}
        wrapClassName={styles.modalWrap}
        {...this.props}
      />
    );
  }
}

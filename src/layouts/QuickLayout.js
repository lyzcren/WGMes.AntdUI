import React, { Fragment } from 'react';
import { FormattedMessage, formatMessage } from 'umi/locale';
import monment from 'moment';
import Link from 'umi/link';
import { Icon, Tooltip } from 'antd';
import GlobalFooter from '@/components/GlobalFooter';
import SelectLang from '@/components/SelectLang';
import WgIcon from '@/wg_components/WgIcon';
import screenfull from 'screenfull';
import { autoSreenfull, watchFullScreen, changeFullScreen } from '@/utils/wgUtils';

import { connect } from 'dva';
import styles from './QuickLayout.less';
import logo from '../assets/logoOri.svg';

const links = [
  {
    key: 'help',
    title: formatMessage({ id: 'layout.user.link.help' }),
    href: 'http://n2027797j5.iok.la',
    blankTarget: true,
  },
  {
    key: 'privacy',
    title: formatMessage({ id: 'layout.user.link.privacy' }),
    href: '',
  },
  {
    key: 'terms',
    title: formatMessage({ id: 'layout.user.link.terms' }),
    href: '',
  },
];

const copyright = (
  <Fragment>
    Copyright <Icon type="copyright" /> 2019~{monment().format('YYYY')} 望果信息科技有限公司
  </Fragment>
);

@connect(({ global }) => ({
  global,
}))
class QuickLayout extends React.PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    // 监听全屏事件
    watchFullScreen(dispatch);
    // 默认全屏
    // autoSreenfull();
  }

  moreOps = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'global/moreOps',
    });
  };

  render() {
    const {
      children,
      global: { isFullScreen },
    } = this.props;
    return (
      // @TODO <DocumentTitle title={this.getPageTitle()}>
      <div className={styles.container}>
        <div className={styles.quickOps}>
          <Tooltip title="进入更多操作界面">
            <a onClick={this.moreOps} className={styles.action}>
              <WgIcon type="thunder" color="#ffffff" size={18} />
            </a>
          </Tooltip>
          {screenfull.enabled && (
            <Tooltip title={formatMessage({ id: 'component.globalHeader.fullScreen' })}>
              <a
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => changeFullScreen()}
                className={styles.action}
              >
                <Icon
                  type={isFullScreen ? 'fullscreen-exit' : 'fullscreen'}
                  style={
                    isFullScreen
                      ? { fontSize: 20, color: '#52c41a' }
                      : { fontSize: 20, color: '#ffffff' }
                  }
                />
              </a>
            </Tooltip>
          )}
        </div>
        <div className={styles.content}>{children}</div>
      </div>
    );
  }
}

export default QuickLayout;

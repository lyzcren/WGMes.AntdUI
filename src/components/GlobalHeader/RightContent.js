import React, { PureComponent } from 'react';
import { FormattedMessage, formatMessage } from 'umi/locale';
import { Spin, Tag, Menu, Icon, Avatar, Tooltip } from 'antd';
import moment from 'moment';
import groupBy from 'lodash/groupBy';
import screenfull from 'screenfull';
import NoticeIcon from '../NoticeIcon';
// import HeaderSearch from '../HeaderSearch';
import HeaderScan from '../HeaderScan';
import HeaderDropdown from '../HeaderDropdown';
import SelectLang from '../SelectLang';
import styles from './index.less';

export default class GlobalHeaderRight extends PureComponent {
  componentDidMount = () => {
    // 监听全屏事件
    this.watchFullScreen();
  };

  getNoticeData() {
    const { notices = [] } = this.props;
    if (notices.length === 0) {
      return {};
    }
    const newNotices = notices.map(notice => {
      const newNotice = { ...notice };
      if (newNotice.datetime) {
        newNotice.datetime = moment(notice.datetime).fromNow();
      }
      if (newNotice.id) {
        newNotice.key = newNotice.id;
      }
      if (newNotice.extra && newNotice.status) {
        const color = {
          todo: '',
          processing: 'blue',
          urgent: 'red',
          doing: 'gold',
        }[newNotice.status];
        newNotice.extra = (
          <Tag color={color} style={{ marginRight: 0 }}>
            {newNotice.extra}
          </Tag>
        );
      }
      return newNotice;
    });
    return groupBy(newNotices, 'type');
  }

  getUnreadData = noticeData => {
    const unreadMsg = {};
    Object.entries(noticeData).forEach(([key, value]) => {
      if (!unreadMsg[key]) {
        unreadMsg[key] = 0;
      }
      if (Array.isArray(value)) {
        unreadMsg[key] = value.filter(item => !item.read).length;
      }
    });
    return unreadMsg;
  };

  changeReadState = clickedItem => {
    const { id } = clickedItem;
    const { dispatch } = this.props;
    dispatch({
      type: 'global/changeNoticeReadState',
      payload: id,
    });
  };

  fetchMoreNotices = tabProps => {
    const { list, name } = tabProps;
    const { dispatch, notices = [] } = this.props;
    const lastItemId = notices[notices.length - 1].id;
    dispatch({
      type: 'global/fetchMoreNotices',
      payload: {
        lastItemId,
        type: name,
        offset: list.length,
      },
    });
  };

  changeFullScreen = () => {
    const { dispatch } = this.props;
    if (screenfull.isFullscreen) {
      screenfull.exit();
    } else {
      screenfull.request();
    }
  };

  // 监听fullscreenchange事件
  watchFullScreen = () => {
    const { dispatch } = this.props;
    const screenChange = () => {
      dispatch({
        type: 'global/fullScreen',
        payload: {
          isFullScreen: screenfull.isFullscreen,
        },
      });
    };

    if (screenfull.enabled) {
      screenfull.on('change', screenChange);
    }

    // // IE 11, chrome
    // window.addEventListener("resize", screenChange);
    // // firefox
    // document.addEventListener(
    //   "fullscreenchange",
    //   screenChange,
    //   false
    // );
    // document.addEventListener(
    //   "mozfullscreenchange",
    //   function () {
    //     alert('mozfullscreenchange');
    //   },
    //   false
    // );
    // document.addEventListener(
    //   "msfullscreenchange",
    //   function () {
    //     alert('msfullscreenchange');
    //   },
    //   false
    // );
    // document.addEventListener(
    //   "webkitfullscreenChange",
    //   function () {
    //     alert('webkitfullscreenChange');
    //   },
    //   false
    // );
  };

  render() {
    const {
      currentUser,
      fetchingMoreNotices,
      fetchingNotices,
      loadedAllNotices,
      onNoticeVisibleChange,
      onMenuClick,
      onNoticeClear,
      skeletonCount,
      theme,
      isFullScreen,
    } = this.props;
    const menu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
        {/* <Menu.Item key="userCenter">
          <Icon type="user" />
          <FormattedMessage id="menu.account.center" defaultMessage="account center" />
        </Menu.Item>
        <Menu.Item key="userinfo">
          <Icon type="setting" />
          <FormattedMessage id="menu.account.settings" defaultMessage="account settings" />
        </Menu.Item>
        <Menu.Item key="triggerError">
          <Icon type="close-circle" />
          <FormattedMessage id="menu.account.trigger" defaultMessage="Trigger Error" />
        </Menu.Item>
        <Menu.Divider /> */}
        <Menu.Item key="logout">
          <Icon type="logout" />
          <FormattedMessage id="menu.account.logout" defaultMessage="logout" />
        </Menu.Item>
      </Menu>
    );
    const loadMoreProps = {
      skeletonCount,
      loadedAll: loadedAllNotices,
      loading: fetchingMoreNotices,
    };
    const noticeData = this.getNoticeData();
    const unreadMsg = this.getUnreadData(noticeData);
    let className = styles.right;
    if (theme === 'dark') {
      className = `${styles.right}  ${styles.dark}`;
    }
    return (
      <div className={className}>
        {/* <HeaderScan
          className={`${styles.action} ${styles.search}`}
          placeholder={formatMessage({ id: 'component.globalHeader.scan' })}
          onSearch={value => {
            console.log('input', value); // eslint-disable-line
          }}
          onPressEnter={value => {
            console.log('enter', value); // eslint-disable-line
          }}
        /> */}
        <Tooltip title={formatMessage({ id: 'component.globalHeader.help' })}>
          <a
            target="_blank"
            href="http://www.wgyun.com.cn/Html/Train.asp?ID=40"
            rel="noopener noreferrer"
            className={styles.action}
          >
            <Icon type="question-circle-o" />
          </a>
        </Tooltip>
        <NoticeIcon
          className={styles.action}
          count={currentUser.unreadCount}
          onItemClick={(item, tabProps) => {
            console.log(item, tabProps); // eslint-disable-line
            this.changeReadState(item, tabProps);
          }}
          locale={{
            emptyText: formatMessage({ id: 'component.noticeIcon.empty' }),
            clear: formatMessage({ id: 'component.noticeIcon.clear' }),
            loadedAll: formatMessage({ id: 'component.noticeIcon.loaded' }),
            loadMore: formatMessage({ id: 'component.noticeIcon.loading-more' }),
          }}
          onClear={onNoticeClear}
          onLoadMore={this.fetchMoreNotices}
          onPopupVisibleChange={onNoticeVisibleChange}
          loading={fetchingNotices}
          clearClose
        >
          <NoticeIcon.Tab
            count={unreadMsg.notification}
            list={noticeData.notification}
            title={formatMessage({ id: 'component.globalHeader.notification' })}
            name="notification"
            emptyText={formatMessage({ id: 'component.globalHeader.notification.empty' })}
            emptyImage="https://gw.alipayobjects.com/zos/rmsportal/wAhyIChODzsoKIOBHcBk.svg"
            {...loadMoreProps}
          />
          <NoticeIcon.Tab
            count={unreadMsg.message}
            list={noticeData.message}
            title={formatMessage({ id: 'component.globalHeader.message' })}
            name="message"
            emptyText={formatMessage({ id: 'component.globalHeader.message.empty' })}
            emptyImage="https://gw.alipayobjects.com/zos/rmsportal/sAuJeJzSKbUmHfBQRzmZ.svg"
            {...loadMoreProps}
          />
          <NoticeIcon.Tab
            count={unreadMsg.event}
            list={noticeData.event}
            title={formatMessage({ id: 'component.globalHeader.event' })}
            name="event"
            emptyText={formatMessage({ id: 'component.globalHeader.event.empty' })}
            emptyImage="https://gw.alipayobjects.com/zos/rmsportal/HsIsxMZiWKrNUavQUXqx.svg"
            {...loadMoreProps}
          />
        </NoticeIcon>
        {currentUser.fName ? (
          <HeaderDropdown overlay={menu}>
            <span className={`${styles.action} ${styles.account}`}>
              <Avatar
                size="small"
                className={styles.avatar}
                src={currentUser.avatar}
                alt="avatar"
              />
              <span className={styles.name}>{currentUser.fName}</span>
            </span>
          </HeaderDropdown>
        ) : (
          <Spin size="small" style={{ marginLeft: 8, marginRight: 8 }} />
        )}
        {/* <SelectLang className={styles.action} /> */}
        {screenfull.enabled && (
          <Tooltip title={formatMessage({ id: 'component.globalHeader.fullScreen' })}>
            <a
              target="_blank"
              rel="noopener noreferrer"
              onClick={this.changeFullScreen}
              className={styles.action}
            >
              {/* <Icon type="border" style={isFullScreen ? { fontSize: 20, color: '#52c41a' } : {}} /> */}
              <Icon
                type={isFullScreen ? 'fullscreen-exit' : 'fullscreen'}
                style={isFullScreen ? { fontSize: 20, color: '#52c41a' } : { fontSize: 20 }}
              />
            </a>
          </Tooltip>
        )}
      </div>
    );
  }
}

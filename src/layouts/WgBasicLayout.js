import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { Layout, Tabs, Button, Icon, Dropdown, Menu } from 'antd';
import DocumentTitle from 'react-document-title';
import isEqual from 'lodash/isEqual';
import memoizeOne from 'memoize-one';
import { connect } from 'dva';
import { ContainerQuery } from 'react-container-query';
import classNames from 'classnames';
import pathToRegexp from 'path-to-regexp';
import Media from 'react-media';
import { Route } from 'umi';
import Footer from './Footer';
import Header from './WgHeader';
import Context from './MenuContext';
import PageLoading from '@/components/PageLoading';
import WgSiderMenu from '@/wg_components/WgSiderMenu';
import { getToken } from '@/utils/token';

// import logo from '../assets/logo.svg';
import { logoUrl } from '@/utils/GlobalConst';
import styles from './BasicLayout.less';

const { TabPane } = Tabs;

// lazy load SettingDrawer
const SettingDrawer = React.lazy(() => import('@/components/SettingDrawer'));

const query = {
  'screen-xs': {
    maxWidth: 575,
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767,
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991,
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199,
  },
  'screen-xl': {
    minWidth: 1200,
    maxWidth: 1599,
  },
  'screen-xxl': {
    minWidth: 1600,
  },
};

class WgBasicLayout extends React.PureComponent {
  constructor(props) {
    super(props);
    this.getPageTitle = memoizeOne(this.getPageTitle);
    this.matchParamsPath = memoizeOne(this.matchParamsPath, isEqual);
    // const { location: { pathname } } = props;

    this.state = {};
  }

  componentDidMount() {
    const {
      dispatch,
      route: { routes, authority },
    } = this.props;
    const token = getToken();
    if (!token) {
      dispatch({
        type: 'user/logout',
      });
      return;
    }
    dispatch({
      type: 'menu/getMenuData',
      payload: { routes, authority },
    });

    dispatch({
      type: 'setting/getSetting',
    });
    dispatch({
      type: 'basicData/getPrintRootUrl',
    });
    dispatch({
      type: 'user/fetchCurrent',
    }).then(this.reloadIndexPage);
  }

  componentDidUpdate(preProps) {
    // After changing to phone mode,
    // if collapsed is true, you need to click twice to display
    const { collapsed, isMobile } = this.props;
    if (isMobile && !preProps.isMobile && !collapsed) {
      this.handleMenuCollapse(false);
    }
  }

  reloadIndexPage = () => {
    const {
      dispatch,
      user: {
        currentUser: { indexPage },
      },
    } = this.props;
    // 首次进入界面默认加载标签页
    let defaultPath = '/dashboard/analysis';
    if (indexPage === 'flow') {
      defaultPath = '/prod/flow';
    } else if (indexPage === 'mission') {
      defaultPath = '/prod/mission';
    }
    // dispatch({
    //   type: 'menu/getMenuData',
    //   payload: { routes, authority, defaultActiveKey: defaultPath },
    // })
    dispatch({
      type: 'menu/openMenu',
      payload: { path: defaultPath, closable: false },
    });
  };

  getContext() {
    const { location, breadcrumbNameMap } = this.props;
    return {
      location,
      breadcrumbNameMap,
    };
  }

  matchParamsPath = (pathname, breadcrumbNameMap) => {
    const pathKey = Object.keys(breadcrumbNameMap).find(key => pathToRegexp(key).test(pathname));
    return breadcrumbNameMap[pathKey];
  };

  getPageTitle = (pathname, breadcrumbNameMap) => '望果制造执行系统';

  // const currRouterData = this.matchParamsPath(pathname, breadcrumbNameMap);
  // if (!currRouterData) {
  //   return '望果制造执行系统';
  // }
  // alert('todo：获取路由页面信息');
  // const pageName = formatMessage({
  //   id: currRouterData.locale || currRouterData.name,
  //   defaultMessage: currRouterData.name,
  // });

  // return `${pageName} - 望果制造执行系统`;

  getLayoutStyle = () => {
    const { fixSiderbar, isMobile, collapsed, layout } = this.props;
    if (fixSiderbar && layout !== 'topmenu' && !isMobile) {
      return {
        paddingLeft: collapsed ? '80px' : '256px',
      };
    }
    return null;
  };

  handleMenuCollapse = collapsed => {
    const { dispatch } = this.props;
    dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: collapsed,
    });
  };

  renderSettingDrawer = () => {
    // Do not render SettingDrawer in production
    // unless it is deployed in preview.pro.ant.design as demo
    if (process.env.NODE_ENV === 'production' && APP_TYPE !== 'site') {
      return null;
    }
    return <SettingDrawer />;
  };

  onChange = activeKey => {
    this.add({ path: activeKey });
  };

  onEdit = (targetKey, action) => {
    if (action === 'remove') {
      this.remove(targetKey);
    } else {
      this[action](targetKey);
    }
  };

  add = ({ path }) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'menu/openMenu',
      payload: { path },
    });
  };

  remove = targetKey => {
    const { dispatch } = this.props;
    dispatch({
      type: 'menu/closeMenu',
      payload: { path: targetKey },
    });
  };

  closeAll() {
    const { dispatch } = this.props;
    dispatch({
      type: 'menu/closeAllMenu',
    });
  }

  handleDropdownMenu = e => {
    const { dispatch, activeKey } = this.props;
    switch (e.key) {
      case 'closeCurrent':
        this.remove(activeKey);
        break;
      case 'closeOther':
        this.closeOther();
        break;
      case 'closeAll':
        this.closeAll();
        break;
      default:
        break;
    }
  };

  closeOther() {
    const { dispatch } = this.props;
    dispatch({
      type: 'menu/closeOtherMenu',
    });
  }

  render() {
    const {
      navTheme,
      layout: PropsLayout,
      location: { pathname },
      isMobile,
      menuData,
      breadcrumbNameMap,
      activeKey,
      panes,
    } = this.props;

    const isTop = PropsLayout === 'topmenu';

    const tabBar = (
      <div
        style={{
          backgroundColor: '#fff',
          border: '1px solid #e8e8e8',
          borderBottom: '1px solid #fff',
          borderRadius: '4px 4px 0 0',
          marginTop: '-2px',
        }}
      >
        <Button
          icon="close"
          shape="circle"
          size="small"
          style={{ marginLeft: '5px', border: 0 }}
          onClick={() => this.closeAll()}
        />
        <Dropdown
          overlay={
            <Menu onClick={this.handleDropdownMenu} selectedKeys={[]}>
              <Menu.Item key="closeCurrent">关闭当前页</Menu.Item>
              <Menu.Item key="closeOther">关闭其他页</Menu.Item>
              <Menu.Item key="closeAll">关闭所有页</Menu.Item>
            </Menu>
          }
        >
          <Button
            icon="down"
            shape="circle"
            style={{ marginLeft: '5px', marginRight: '5px', border: 0 }}
          />
        </Dropdown>
      </div>
    );

    const layout = (
      <Layout>
        {isTop && !isMobile ? null : (
          <WgSiderMenu
            logo={logoUrl}
            theme={navTheme}
            onCollapse={this.handleMenuCollapse}
            menuData={menuData}
            isMobile={isMobile}
            {...this.props}
          />
        )}
        <Layout
          style={{
            ...this.getLayoutStyle(),
            minHeight: '100vh',
          }}
        >
          <Header
            menuData={menuData}
            handleMenuCollapse={this.handleMenuCollapse}
            logo={logoUrl}
            isMobile={isMobile}
            {...this.props}
          />
          <Tabs
            className={styles.tabMenu}
            activeKey={activeKey}
            onChange={this.onChange}
            onEdit={this.onEdit}
            tabBarStyle={{ backgroundColor: 'white', marginBottom: 0 }}
            // TODO: Tabs标签页右键菜单
            tabBarExtraContent={tabBar}
            hideAdd
            type="editable-card"
          >
            {panes.map(pane => (
              <TabPane
                tab={pane.name}
                className={styles.tabContent}
                id={pane.key}
                key={pane.key}
                closable={pane.closable}
              >
                <pane.component {...pane} />
              </TabPane>
            ))}
          </Tabs>
          <Footer />
        </Layout>
      </Layout>
    );
    return (
      <React.Fragment>
        <DocumentTitle title={this.getPageTitle(pathname, breadcrumbNameMap)}>
          <ContainerQuery query={query}>
            {params => (
              <Context.Provider value={this.getContext()}>
                <div className={classNames(params)}>{layout}</div>
              </Context.Provider>
            )}
          </ContainerQuery>
        </DocumentTitle>
        <Suspense fallback={<PageLoading />}>{this.renderSettingDrawer()}</Suspense>
      </React.Fragment>
    );
  }
}

export default connect(({ global, setting, menu, user, basicData }) => ({
  collapsed: global.collapsed,
  layout: setting.layout,
  menuData: menu.menuData,
  panes: menu.panes,
  activeKey: menu.activeKey,
  path: menu.path,
  selectedKeys: menu.selectedKeys,
  breadcrumbNameMap: menu.breadcrumbNameMap,
  user,
  ...setting,
  basicData,
}))(props => (
  <Media query="(max-width: 599px)">
    {isMobile => <WgBasicLayout {...props} isMobile={isMobile} />}
  </Media>
));

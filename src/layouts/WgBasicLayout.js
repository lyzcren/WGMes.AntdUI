import React, { Suspense } from 'react';
import { Layout, Tabs, notification, Button } from 'antd';
import DocumentTitle from 'react-document-title';
import isEqual from 'lodash/isEqual';
import memoizeOne from 'memoize-one';
import { connect } from 'dva';
import { ContainerQuery } from 'react-container-query';
import classNames from 'classnames';
import pathToRegexp from 'path-to-regexp';
import Media from 'react-media';
import { formatMessage } from 'umi/locale';
import Authorized from '@/utils/Authorized';
import logo from '../assets/logo.svg';
import Footer from './Footer';
import Header from './WgHeader';
import Context from './MenuContext';
import Exception403 from '../pages/Exception/403';
import PageLoading from '@/components/PageLoading';
import WgSiderMenu from '@/components/WgSiderMenu';
import { urlToList } from '@/components/_utils/pathTools';
import { getFlatMenuKeys } from '@/components/WgSiderMenu/SiderMenuUtils';
import { Route, Switch } from 'react-router-dom'
import { ComposeApplicator } from 'lodash-decorators/applicators';
import { getComponentMaps } from '@/utils/utils'

import styles from './BasicLayout.less';



const TabPane = Tabs.TabPane;

// lazy load SettingDrawer
const SettingDrawer = React.lazy(() => import('@/components/SettingDrawer'));

const { Content } = Layout;

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
    let { location: { pathname } } = props;
    // 首次进入界面默认加载标签页
    this.defaultPath = "/techStd/route";

    const panes = [];
    this.state = {
      panes,
      activeKey: props.selectedPath,
      selectedKeys: props.selectedKeys
    }
  }

  componentDidMount () {
    const {
      dispatch,
      route: { routes, authority },
      menuData,
      routeData,
    } = this.props;

    dispatch({
      type: 'user/fetchCurrent',
    });
    dispatch({
      type: 'setting/getSetting',
    });
    dispatch({
      type: 'menu/getMenuData',
      payload: { routes, authority, defaultPath: this.defaultPath },
    });
  }

  componentDidUpdate (preProps) {
    // After changing to phone mode,
    // if collapsed is true, you need to click twice to display
    const { collapsed, isMobile } = this.props;
    if (isMobile && !preProps.isMobile && !collapsed) {
      this.handleMenuCollapse(false);
    }
    // 默认加载首页
    if (this.props.selectedPath !== preProps.selectedPath) {
      const { selectedPath } = this.props;
      this.add({ selectedPath });
    }
  }

  getContext () {
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

  getRouterAuthority = (pathname, routes) => {
    let routeAuthority = ['noAuthority'];
    const getAuthority = (key, routes) => {
      routes.map(route => {
        if (route.path && pathToRegexp(route.path).test(key)) {
          routeAuthority = route.authority;
        } else if (route.routes) {
          routeAuthority = getAuthority(key, route.routes);
        }
        return route;
      });
      return routeAuthority;
    };
    return getAuthority(pathname, routes);
  };

  getPageTitle = (pathname, breadcrumbNameMap) => {
    const currRouterData = this.matchParamsPath(pathname, breadcrumbNameMap);

    return '望果制造执行系统';
    if (!currRouterData) {
      return '望果制造执行系统';
    }
    alert('todo：获取路由页面信息');
    const pageName = formatMessage({
      id: currRouterData.locale || currRouterData.name,
      defaultMessage: currRouterData.name,
    });

    return `${pageName} - 望果制造执行系统`;
  };

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

  onChange = (activeKey) => {
    this.changeTabActiveKey({ activeKey });
  }

  onEdit = (targetKey, action) => {
    this[action](targetKey);
  }

  add = ({ selectedPath }) => {
    const { panes } = this.state;
    const activeKey = selectedPath;
    const pane = panes.find(p => p.key === activeKey);
    const componentMap = getComponentMaps(this.props.routeData).find(com => com.path == selectedPath);
    if (!pane) {
      if (componentMap) {// 打开Tab页
        componentMap.closable = selectedPath === this.defaultPath ? false : true;
        panes.push({ ...componentMap, key: activeKey });
        this.changeTabActiveKey({ panes, activeKey });
      } else {
        // TODO: 未找到路由时进行特殊处理
        notification.error({
          message: "未找到路由.",
        });
      }
    } else {
      // 主要用于修改Tab页传入附加参数
      const newPanes = panes.map((p) => {
        if (p.key === activeKey) {
          return { ...componentMap, key: activeKey };
        } else {
          return p;
        }
      });
      this.changeTabActiveKey({ panes: newPanes, activeKey });
    }
  }

  remove = (targetKey) => {
    const { dispatch } = this.props;
    let activeKey = this.state.activeKey;
    let lastIndex;
    this.state.panes.forEach((pane, i) => {
      if (pane.key === targetKey) {
        lastIndex = i > 0 ? (i - 1) : 0;
      }
    });
    const panes = this.state.panes.filter(pane => pane.key !== targetKey);
    if (lastIndex >= 0 && activeKey === targetKey) {
      activeKey = panes[lastIndex].key;
    }
    this.changeTabActiveKey({ panes, activeKey });
  }

  changeTabActiveKey = (state) => {
    const { dispatch } = this.props;
    const { activeKey } = state;
    dispatch({
      type: 'menu/setSelected',
      payload: { selectedPath: activeKey },
    });
    this.setState(state);
  }

  render () {
    const {
      navTheme,
      layout: PropsLayout,
      children,
      location: { pathname },
      isMobile,
      menuData,
      breadcrumbNameMap,
      route: { routes },
      fixedHeader,
    } = this.props;

    const isTop = PropsLayout === 'topmenu';
    const routerConfig = this.getRouterAuthority(pathname, routes);
    const contentStyle = !fixedHeader ? { paddingTop: 0 } : {};

    const layout = (
      <Layout>
        {isTop && !isMobile ? null : (
          <WgSiderMenu
            logo={logo}
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
            logo={logo}
            isMobile={isMobile}
            {...this.props}
          />
          <Tabs className={styles.tabMenu} activeKey={this.state.activeKey}
            onChange={this.onChange} onEdit={this.onEdit}
            // TODO: Tabs标签页右键菜单
            // tabBarExtraContent={<Button type="primary">主操作</Button>}
            hideAdd type="editable-card">
            {
              this.state.panes.map(pane =>
                <TabPane tab={pane.name} className={styles.tabContent} key={pane.key} closable={pane.closable}>
                  <Route>{<pane.component {...pane} />}</Route>
                </TabPane>)
            }
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

export default connect(({ global, setting, menu }) => ({
  collapsed: global.collapsed,
  layout: setting.layout,
  menuData: menu.menuData,
  routeData: menu.routeData,
  selectedPath: menu.selectedPath,
  selectedKeys: menu.selectedKeys,
  breadcrumbNameMap: menu.breadcrumbNameMap,
  ...setting,
}))(props => (
  <Media query="(max-width: 599px)">
    {isMobile => <WgBasicLayout {...props} isMobile={isMobile} />}
  </Media>
));

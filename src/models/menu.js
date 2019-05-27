import memoizeOne from 'memoize-one';
import { notification } from 'antd';
import isEqual from 'lodash/isEqual';
import { formatMessage } from 'umi/locale';
import Authorized from '@/utils/Authorized';
import pathToRegexp from 'path-to-regexp';
import { urlToList } from '@/components/_utils/pathTools';
import { getFlatMenuKeys } from '@/components/WgSiderMenu/SiderMenuUtils';
import { getComponentMaps } from '@/utils/utils';

const { check } = Authorized;

// Conversion router to menu.
function formatter(data, parentAuthority, parentName) {
  return data
    .map(item => {
      if (!item.name || !item.path) {
        return null;
      }

      let locale = 'menu';
      if (parentName) {
        locale = `${parentName}.${item.name}`;
      } else {
        locale = `menu.${item.name}`;
      }

      const result = {
        ...item,
        name: formatMessage({ id: locale, defaultMessage: item.name }),
        locale,
        authority: item.authority || parentAuthority,
      };
      if (item.routes) {
        const children = formatter(item.routes, item.authority, locale);
        // Reduce memory usage
        result.children = children;
      }
      delete result.routes;
      return result;
    })
    .filter(item => item);
}

const memoizeOneFormatter = memoizeOne(formatter, isEqual);

/**
 * get SubMenu or Item
 */
const getSubMenu = item => {
  // doc: add hideChildrenInMenu
  if (item.children && !item.hideChildrenInMenu && item.children.some(child => child.name)) {
    return {
      ...item,
      children: filterMenuData(item.children), // eslint-disable-line
    };
  }
  return item;
};

/**
 * filter menuData
 */
const filterMenuData = menuData => {
  if (!menuData) {
    return [];
  }
  return menuData
    .filter(item => item.name && !item.hideInMenu)
    .map(item => check(item.authority, getSubMenu(item)))
    .filter(item => item);
};

const getSubRoute = item => {
  // doc: add hideChildrenInMenu
  if (item.children && item.children.some(child => child.name)) {
    return {
      ...item,
      children: filterRouteData(item.children), // eslint-disable-line
    };
  }
  return item;
};

/**
 * filter routeData
 */
const filterRouteData = menuData => {
  if (!menuData) {
    return [];
  }
  return menuData
    .filter(item => item.name)
    .map(item => check(item.authority, getSubRoute(item)))
    .filter(item => item);
};

/**
 * 获取面包屑映射
 * @param {Object} menuData 菜单配置
 */
const getBreadcrumbNameMap = menuData => {
  const routerMap = {};

  const flattenMenuData = data => {
    data.forEach(menuItem => {
      if (menuItem.children) {
        flattenMenuData(menuItem.children);
      }
      // Reduce memory usage
      routerMap[menuItem.path] = menuItem;
    });
  };
  flattenMenuData(menuData);
  return routerMap;
};

const getMenuMatches = (flatMenuKeys, path) =>
  flatMenuKeys.filter(item => {
    if (item) {
      return pathToRegexp(item).test(path);
    }
    return false;
  });

// Get the currently selected menu
const getSelectedMenuKeys = (pathname, menuData) => {
  const flatMenuKeys = getFlatMenuKeys(menuData);
  return urlToList(pathname).map(itemPath => getMenuMatches(flatMenuKeys, itemPath).pop());
};

const matchParamsPath = (pathname, breadcrumbNameMap) => {
  const pathKey = Object.keys(breadcrumbNameMap).find(key => pathToRegexp(key).test(pathname));
  return breadcrumbNameMap[pathKey];
};

// 传参处理
const appendRouteParam = (routeItems, path, params) => {
  return routeItems.map(routeItem => {
    if (routeItem && routeItem.children) {
      routeItem.children = appendRouteParam(routeItem.children, path, params);
    }
    if (routeItem.path == path) {
      return { ...routeItem, ...params };
    } else {
      return routeItem;
    }
  });
};

const memoizeOneGetBreadcrumbNameMap = memoizeOne(getBreadcrumbNameMap, isEqual);

export default {
  namespace: 'menu',

  state: {
    menuData: [],
    routeData: [],
    panes: [],
    breadcrumbNameMap: {},
    activeKey: '',
    path: '',
    selectedKeys: [],
  },

  effects: {
    *getMenuData({ payload }, { put }) {
      const { routes, authority } = payload;
      const menuData = filterMenuData(memoizeOneFormatter(routes, authority));
      const routeData = filterRouteData(memoizeOneFormatter(routes, authority));
      const breadcrumbNameMap = memoizeOneGetBreadcrumbNameMap(menuData);
      yield put({
        type: 'save',
        payload: { menuData, routeData, breadcrumbNameMap },
      });
    },
    *openMenu({ payload }, { put, call, select }) {
      const { name, path, closable } = payload;
      const { menuData, routeData, panes } = yield select(state => state.menu);
      const activeKey = path;
      const selectedKeys = getSelectedMenuKeys(activeKey, routeData);
      const pane = panes.find(p => p.key === activeKey);
      const componentMap = getComponentMaps(routeData).find(com => com.path == path);
      if (!pane) {
        if (componentMap) {
          // 打开Tab页
          panes.push({ ...componentMap, key: activeKey, closable });
        } else {
          // TODO: 未找到路由时进行特殊处理
          notification.error({
            message: '未找到路由.',
          });
          return;
        }
      }

      delete payload.path;
      // 主要用于修改Tab页传入附加参数
      const newPanes = panes.map(p => {
        if (p.key === activeKey) {
          return { ...p, ...payload, key: activeKey };
        } else {
          return p;
        }
      });

      yield put({
        type: 'save',
        payload: { ...payload, path, activeKey, selectedKeys, panes: newPanes },
      });
    },
    *closeMenu({ payload }, { put, call, select }) {
      const { path, closable } = payload;
      const { menuData, routeData, panes, activeKey } = yield select(state => state.menu);
      let newActiveKey = activeKey;
      const newPanes = panes.filter(pane => pane.key !== path);
      if (activeKey === path) {
        panes.forEach((pane, i) => {
          if (pane.key === path) {
            const lastIndex = i > 0 ? i - 1 : 0;
            newActiveKey = newPanes[lastIndex].key;
          }
        });
      }
      const selectedKeys = getSelectedMenuKeys(newActiveKey, routeData);

      yield put({
        type: 'save',
        payload: {
          ...payload,
          path: newActiveKey,
          activeKey: newActiveKey,
          selectedKeys,
          panes: newPanes,
        },
      });
    },
    *disposeMenu({ payload }, { put }) {
      yield put({
        type: 'save',
        payload: {
          menuData: [],
          routeData: [],
          panes: [],
          breadcrumbNameMap: {},
          activeKey: '',
          path: '',
          selectedKeys: [],
        },
      });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};

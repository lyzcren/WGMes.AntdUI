export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', name: 'login', component: './User/Login' },
      { path: '/user/register', name: 'register', component: './User/Register' },
      {
        path: '/user/register-result',
        name: 'register.result',
        component: './User/RegisterResult',
      },
      {
        component: '404',
      },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/WgBasicLayout',
    Routes: ['src/pages/Authorized'],
    routes: [
      // dashboard
      { path: '/', redirect: '/dashboard/analysis' },
      {
        path: '/dashboard',
        name: 'dashboard',
        icon: 'dashboard',
        routes: [
          {
            path: '/dashboard/analysis',
            name: 'analysis',
            component: './Dashboard/Analysis',
          },
          {
            path: '/dashboard/monitor',
            name: 'monitor',
            component: './Dashboard/Monitor',
          },
          {
            path: '/dashboard/workplace',
            name: 'workplace',
            component: './Dashboard/Workplace',
          },
        ],
      },
      {
        path: '/prod',
        name: 'prod',
        icon: 'tool',
        authority: ['Mission_Read', 'Flow_Read', 'Record_Read'],
        routes: [
          {
            path: '/prod/mission',
            name: 'mission',
            component: './Prod/Mission/List',
            authority: ['Mission_Read'],
            routes: [
              {
                path: '/prod/mission/profile',
                name: 'profile',
                component: './Prod/Mission/Profile',
                authority: ['Mission_Read'],
                hideInMenu: true,
              },
            ],
          },
          {
            path: '/prod/flow',
            name: 'flow',
            component: './Prod/Flow/List',
            authority: ['Flow_Read'],
            routes: [
              {
                path: '/prod/flow/transfer',
                name: 'transfer',
                component: './Prod/Flow/Transfer',
                authority: ['Flow_Transfer'],
                hideInMenu: true,
              },
            ],
          },
          {
            path: '/prod/record',
            name: 'record',
            component: './Prod/Record/List',
            authority: ['Record_Read'],
          },
        ],
      },
      {
        path: '/techStd',
        name: 'techStd',
        icon: 'cluster',
        authority: ['Defect_Read', 'Param_Read', 'Route_Read'],
        routes: [
          {
            path: '/techStd/defect',
            name: 'defect',
            component: './Tech/Defect/List',
            authority: ['Defect_Read'],
          },
          {
            path: '/techStd/param',
            name: 'param',
            component: './Tech/Param/List',
            authority: ['Param_Read'],
          },
          {
            path: '/techStd/route',
            name: 'route',
            component: './Tech/Route/List',
            authority: ['Route_Read'],
            routes: [
              {
                path: '/techStd/route/profile',
                name: 'routeProfile',
                component: './Tech/Route/Profile',
                authority: ['Route_Read'],
                hideInMenu: true,
              },
            ],
          },
        ],
      },
      {
        path: '/basic',
        name: 'basic',
        icon: 'deployment-unit',
        authority: ['Product_Read', 'Dept_Read', 'Unit_Read', 'Machine_Read', 'Emp_Read'],
        routes: [
          {
            path: '/basic/product',
            name: 'product',
            component: './Basic/ProductList/List',
            authority: ['Product_Read'],
            routes: [
              {
                path: '/basic/product/import',
                name: 'productImport',
                component: './Basic/ProductList/Import',
                authority: ['Product_Create'],
                hideInMenu: true,
              },
            ],
          },
          {
            path: '/basic/dept',
            name: 'dept',
            component: './Basic/Dept/List',
            authority: ['Dept_Read'],
          },
          {
            path: '/basic/unit',
            name: 'unit',
            component: './Basic/Unit/List',
            authority: ['Unit_Read'],
          },
          {
            path: '/basic/machine',
            name: 'machine',
            component: './Basic/Machine/List',
            authority: ['Machine_Read'],
          },
          {
            path: '/basic/emp',
            name: 'emp',
            component: './Basic/Emp/List',
            authority: ['Emp_Read'],
          },
        ],
      },
      // sysConfig
      {
        path: '/sysConfig',
        name: 'sysConfig',
        icon: 'setting',
        authority: ['User_Read', 'Role_Read', 'BillNoRule_Read'],
        routes: [
          {
            path: '/sysConfig/user',
            name: 'user',
            component: './SysConfig/User/List',
            authority: ['User_Read'],
          },
          {
            path: '/sysConfig/role',
            name: 'role',
            component: './SysConfig/Role/List',
            authority: ['Role_Read'],
          },
          {
            path: '/sysConfig/billNoRule',
            name: 'billNoRule',
            component: './SysConfig/BillNoRule/List',
            authority: ['BillNoRule_Read'],
          },
        ],
      },
      // {
      //   name: 'exception',
      //   icon: 'warning',
      //   path: '/exception',
      //   routes: [
      //     // exception
      //     {
      //       path: '/exception/403',
      //       name: 'not-permission',
      //       component: './Exception/403',
      //     },
      //     {
      //       path: '/exception/404',
      //       name: 'not-find',
      //       component: './Exception/404',
      //     },
      //     {
      //       path: '/exception/500',
      //       name: 'server-error',
      //       component: './Exception/500',
      //     },
      //     {
      //       path: '/exception/trigger',
      //       name: 'trigger',
      //       hideInMenu: true,
      //       component: './Exception/TriggerException',
      //     },
      //   ],
      // },
      // account
      {
        name: 'account',
        icon: 'user',
        path: '/account',
        routes: [
          {
            path: '/account/center',
            name: 'center',
            component: './Account/Center/Center',
            routes: [
              {
                path: '/account/center',
                redirect: '/account/center/articles',
              },
              {
                path: '/account/center/articles',
                component: './Account/Center/Articles',
              },
              {
                path: '/account/center/applications',
                component: './Account/Center/Applications',
              },
              {
                path: '/account/center/projects',
                component: './Account/Center/Projects',
              },
            ],
          },
          {
            path: '/account/settings',
            name: 'settings',
            component: './Account/Settings/Info',
            routes: [
              {
                path: '/account/settings',
                redirect: '/account/settings/base',
              },
              {
                path: '/account/settings/base',
                component: './Account/Settings/BaseView',
              },
              {
                path: '/account/settings/security',
                component: './Account/Settings/SecurityView',
              },
              {
                path: '/account/settings/binding',
                component: './Account/Settings/BindingView',
              },
              {
                path: '/account/settings/notification',
                component: './Account/Settings/NotificationView',
              },
            ],
          },
        ],
      },
      {
        component: '404',
      },
    ],
  },
];

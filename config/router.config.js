export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './User/Login' },
      { path: '/user/register', component: './User/Register' },
      { path: '/user/register-result', component: './User/RegisterResult' },
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
        path: '/basic',
        name: 'basic',
        icon: 'cluster',
        authority: ['Dept_Read', 'Unit_Read', 'Machine_Read', 'Emp_Read',],
        routes: [
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
        authority: ['User_Read', 'Role_Read',],
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
        ],
      },
      // account
      {
        path: '/account',
        name: 'account',
        icon: 'setting',
        routes: [
          {
            path: '/account/center',
            name: 'center',
            component: './Account/Center/Center',
          },
          {
            path: '/account/settings',
            name: 'settings',
            component: './Account/Settings/BaseView',
          },
        ],
      },
    ],
  },
];

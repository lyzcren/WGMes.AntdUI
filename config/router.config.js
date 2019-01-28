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
    authority: ['admin', 'user'],
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
      // sysConfig
      { path: '/', redirect: '/sysConfig/user' },
      {
        path: '/sysConfig',
        name: 'sysConfig',
        icon: 'setting',
        routes: [
          {
            path: '/sysConfig/user',
            name: 'user',
            component: './SysConfig/User/List',
          },
          // {
          //   path: '/sysConfig/role',
          //   name: 'role',
          //   component: './SysConfig/Role',
          // },
        ],
      },
    ],
  },
];

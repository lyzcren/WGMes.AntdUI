export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', name: 'login', component: './User/Login' },
      {
        path: '/user/privacyAndTerms',
        name: 'privacyAndTerms',
        component: './User/PrivacyAndTerms',
      },
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
  {
    path: '/quickOps',
    component: '../layouts/QuickLayout',
    routes: [
      { path: '/quickOps', component: './Quick/List' },
      {
        path: '/quickOps/transfer',
        name: 'transfer',
        component: './Prod/Flow/Transfer',
        authority: ['Flow_Transfer'],
        hideInMenu: true,
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
      { path: '/', redirect: '/prod/flow' },
      {
        path: '/dashboard',
        name: 'dashboard',
        icon: 'dashboard',
        routes: [
          {
            path: '/dashboard/analysis',
            name: 'analysis',
            component: './Dashboard/Analysis',
            authority: ['Anylasis_Read'],
          },
          // {
          //   path: '/dashboard/monitor',
          //   name: 'monitor',
          //   component: './Dashboard/Monitor',
          // },
          // {
          //   path: '/dashboard/workplace',
          //   name: 'workplace',
          //   component: './Dashboard/Workplace',
          // },
        ],
      },
      {
        path: '/prod',
        name: 'prod',
        icon: 'tool',
        authority: [
          'Mission_Read',
          'Flow_Read',
          'Inv_Read',
          'PassInv_Read',
          'ProdDefect_Read',
          'InvCheck_Read',
          'DefectCheck_Read',
          'Report_Read',
        ],
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
              {
                path: '/prod/flow/profile',
                name: 'profile',
                component: './Prod/Flow/Profile',
                authority: ['Flow_Read'],
                hideInMenu: true,
              },
            ],
          },
          {
            path: '/prod/inv',
            name: 'inv',
            component: './Prod/Inv/List',
            authority: ['Inv_Read'],
          },
          {
            path: '/prod/passInv',
            name: 'passInv',
            component: './Prod/PassInv/List',
            authority: ['PassInv_Read'],
          },
          {
            path: '/prod/defect',
            name: 'defect',
            component: './Prod/Defect/List',
            authority: ['ProdDefect_Read'],
            // routes: [
            //   {
            //     path: '/prod/defect/profile',
            //     name: 'profile',
            //     component: './Prod/Defect/Profile',
            //     authority: ['Defect_Read'],
            //     hideInMenu: true,
            //   },
            // ],
          },
          {
            path: '/prod/invCheck',
            name: 'invCheck',
            component: './Prod/InvCheck/List',
            authority: ['InvCheck_Read'],
            routes: [
              {
                path: '/prod/invCheck/create',
                name: 'create',
                component: './Prod/InvCheck/Create',
                authority: ['InvCheck_Create'],
                hideInMenu: true,
              },
              {
                path: '/prod/invCheck/update',
                name: 'update',
                component: './Prod/InvCheck/Update',
                authority: ['InvCheck_Update'],
                hideInMenu: true,
              },
              {
                path: '/prod/invCheck/profile',
                name: 'profile',
                component: './Prod/InvCheck/Profile',
                authority: ['InvCheck_Read'],
                hideInMenu: true,
              },
            ],
          },
          {
            path: '/prod/defectCheck',
            name: 'defectCheck',
            component: './Prod/DefectCheck/List',
            authority: ['DefectCheck_Read'],
            routes: [
              {
                path: '/prod/defectCheck/create',
                name: 'create',
                component: './Prod/DefectCheck/Create',
                authority: ['DefectCheck_Create'],
                hideInMenu: true,
              },
              {
                path: '/prod/defectCheck/update',
                name: 'update',
                component: './Prod/DefectCheck/Update',
                authority: ['DefectCheck_Update'],
                hideInMenu: true,
              },
              {
                path: '/prod/defectCheck/profile',
                name: 'profile',
                component: './Prod/DefectCheck/Profile',
                authority: ['DefectCheck_Read'],
                hideInMenu: true,
              },
            ],
          },
          {
            path: '/prod/report',
            name: 'report',
            component: './Prod/Report/List',
            authority: ['Report_Read'],
            routes: [
              {
                path: '/prod/report/create',
                name: 'create',
                component: './Prod/Report/Create',
                authority: ['Report_Create'],
                hideInMenu: true,
              },
              {
                path: '/prod/report/update',
                name: 'update',
                component: './Prod/Report/Update',
                authority: ['Report_Update'],
                hideInMenu: true,
              },
              {
                path: '/prod/report/profile',
                name: 'profile',
                component: './Prod/Report/Profile',
                authority: ['Report_Read'],
                hideInMenu: true,
              },
            ],
          },
        ],
      },
      {
        path: '/record',
        name: 'record',
        icon: 'book',
        authority: [
          'MissionInput_Read',
          'Record_Read',
          'RecordTake_Read',
          'Flow_ChangeRoute',
          'Flow_Split',
          'DefectRepair_Read',
          'DefectScrap_Read',
        ],
        routes: [
          {
            path: '/record/missionInput',
            name: 'missionInput',
            component: './Record/MissionInput/List',
            authority: ['MissionInput_Read'],
          },
          {
            path: '/record/record',
            name: 'record',
            component: './Record/Record/List',
            authority: ['Record_Read'],
            routes: [
              {
                path: '/record/record/profile',
                name: 'profile',
                component: './Record/Record/Profile',
                authority: ['Record_Read'],
                hideInMenu: true,
              },
            ],
          },
          {
            path: '/record/take',
            name: 'take',
            component: './Record/Take/List',
            authority: ['RecordTake_Read'],
          },
          {
            path: '/record/changeRoute',
            name: 'changeRoute',
            component: './Record/ChangeRoute/List',
            authority: ['Flow_ChangeRoute'],
          },
          {
            path: '/record/batchSplit',
            name: 'batchSplit',
            component: './Record/BatchSplit/List',
            authority: ['Flow_Split'],
          },
          {
            path: '/record/defectRepair',
            name: 'defectRepair',
            component: './Record/DefectRepair/List',
            authority: ['DefectRepair_Read'],
          },
          {
            path: '/record/defectScrap',
            name: 'defectScrap',
            component: './Record/DefectScrap/List',
            authority: ['DefectScrap_Read'],
          },
        ],
      },
      {
        path: '/report',
        name: 'report',
        icon: 'area-chart',
        authority: ['Output_Read', 'PassRate_Read', 'MissionExecution_Read', 'ReportWorkTime_Read'],
        routes: [
          {
            path: '/report/output',
            name: 'output',
            component: './Rpt/Output/List',
            authority: ['Output_Read'],
          },
          {
            path: '/report/passRate',
            name: 'passRate',
            component: './Rpt/PassRate/List',
            authority: ['PassRate_Read'],
          },
          {
            path: '/report/missionExecution',
            name: 'missionExecution',
            component: './Rpt/MissionExecution/List',
            authority: ['MissionExecution_Read'],
          },
          {
            path: '/report/workTime',
            name: 'workTime',
            component: './Rpt/WorkTime/List',
            authority: ['ReportWorkTime_Read'],
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
                path: '/techStd/route/create',
                name: 'create',
                component: './Tech/Route/Create',
                authority: ['Route_Create'],
                hideInMenu: true,
              },
              {
                path: '/techStd/route/update',
                name: 'update',
                component: './Tech/Route/Update',
                authority: ['Route_Update'],
                hideInMenu: true,
              },
              {
                path: '/techStd/route/profile',
                name: 'profile',
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
        authority: [
          'Product_Read',
          'Dept_Read',
          'UnitConverter_Read',
          'Machine_Read',
          'Emp_Read',
          'WorkTime_Read',
        ],
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
            path: '/basic/unitConverter',
            name: 'unitConverter',
            component: './Basic/UnitConverter/List',
            authority: ['UnitConverter_Read'],
            routes: [
              {
                path: '/basic/unitConverter/create',
                name: 'create',
                component: './Basic/UnitConverter/Create',
                authority: ['UnitConverter_Create'],
                hideInMenu: true,
              },
              {
                path: '/basic/unitConverter/update',
                name: 'update',
                component: './Basic/UnitConverter/Update',
                authority: ['UnitConverter_Update'],
                hideInMenu: true,
              },
            ],
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
          {
            path: '/basic/workTime',
            name: 'workTime',
            component: './Basic/WorkTime/List',
            authority: ['WorkTime_Read'],
          },
        ],
      },
      // sysConfig
      {
        path: '/sysConfig',
        name: 'sysConfig',
        icon: 'setting',
        authority: ['User_Read', 'Role_Read', 'BillNoRule_Read', 'PrintTemplate_Read'],
        routes: [
          {
            path: '/sysConfig/user',
            name: 'user',
            component: './Sys/User/List',
            authority: ['User_Read'],
          },
          {
            path: '/sysConfig/role',
            name: 'role',
            component: './Sys/Role/List',
            authority: ['Role_Read'],
          },
          {
            path: '/sysConfig/billNoRule',
            name: 'billNoRule',
            component: './Sys/BillNoRule/List',
            authority: ['BillNoRule_Read'],
          },
          {
            path: '/sysConfig/printTemplate',
            name: 'printTemplate',
            component: './Sys/PrintTemplate/List',
            authority: ['PrintTemplate_Read'],
          },
          {
            path: '/sysConfig/businessConfig',
            name: 'businessConfig',
            component: './Sys/BusinessConfig/List',
            authority: ['BusinessConfig_Read'],
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
      {
        component: '404',
      },
    ],
  },
];

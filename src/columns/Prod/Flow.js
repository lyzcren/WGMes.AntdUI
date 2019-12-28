export const columns =
  [
    {
      title: '批号',
      dataIndex: 'fFullBatchNo',
      width: 220,
      sorter: true,
    },
    {
      title: '良品数量',
      dataIndex: 'fCurrentPassQty',
      width: 120,
      sorter: true,
    },
    {
      title: '投入数量',
      dataIndex: 'fInputQty',
      width: 120,
      sorter: true,
    },
    {
      title: '良品率',
      dataIndex: 'fCurrentPassRate',
      width: 120,
    },
    {
      title: '状态',
      dataIndex: 'fStatusNumber',
      width: 150,
    },
    {
      title: '当前岗位',
      dataIndex: 'fCurrentDeptName',
      width: 150,
    },
    {
      title: '任务单号',
      dataIndex: 'fMoBillNo',
      width: 200,
      sorter: true,
    },
    {
      title: '总投入数量',
      dataIndex: 'fTotalInputQty',
      width: 130,
      sorter: true,
    },
    {
      title: '订单号',
      dataIndex: 'fSoBillNo',
      width: 150,
    },
    {
      title: '产品名称',
      dataIndex: 'fProductName',
      width: 150,
    },
    {
      title: '产品全称',
      dataIndex: 'fProductFullName',
      width: 350,
    },
    {
      title: '产品编码',
      dataIndex: 'fProductNumber',
      sorter: true,
      width: 150,
    },
    {
      title: '规格型号',
      dataIndex: 'fProductModel',
      width: 220,
    },
    {
      title: '工艺路线',
      dataIndex: 'fRouteName',
      width: 150,
    },
    {
      title: '工艺路线编码',
      dataIndex: 'fRouteNumber',
      width: 150,
    },
    {
      title: '产品分类',
      dataIndex: 'fErpClsName',
      sorter: true,
      width: 150,
    },
    {
      title: '优先级',
      dataIndex: 'fPriority',
      sorter: true,
      width: 120,
    },
    {
      title: '车间',
      dataIndex: 'fWorkShopName',
      sorter: true,
      width: 120,
    },
    {
      title: '车间编码',
      dataIndex: 'fWorkShopNumber',
      sorter: true,
      width: 120,
    },
    {
      title: '汇报单',
      dataIndex: 'fMoRptBillNo',
      sorter: true,
      width: 120,
    },
    {
      title: '父件型号',
      dataIndex: 'fMesSelf002',
      sorter: true,
      width: 120,
    },
    {
      title: '底色编号',
      dataIndex: 'fMesSelf001',
      sorter: true,
      width: 120,
    },
    {
      title: '内部订单号',
      dataIndex: 'fMesSelf003',
      sorter: true,
      width: 140,
    },
    {
      title: '操作',
      dataIndex: 'operators',
      fixed: 'right',
      width: 250,
    },
  ];
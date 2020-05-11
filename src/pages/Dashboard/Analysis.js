import React, { Component, Suspense } from 'react';
import { connect } from 'dva';
import { Row, Col, Icon, Menu, Dropdown } from 'antd';

import GridContent from '@/components/PageHeaderWrapper/GridContent';
import { getTimeDistance } from '@/utils/utils';

import styles from './Analysis.less';
import PageLoading from '@/components/PageLoading';

const IntroduceRow = React.lazy(() => import('./IntroduceRow'));
const ProduceCard = React.lazy(() => import('./ProduceCard'));
const TopSearch = React.lazy(() => import('./TopSearch'));
const ProportionSales = React.lazy(() => import('./ProportionSales'));
const OfflineData = React.lazy(() => import('./OfflineData'));

@connect(({ chart, loading }) => ({
  chart,
  loading: loading.effects['chart/fetch'],
}))
class Analysis extends Component {
  state = {
    workshop: {},
    processes: [],
    deptId: 0,
    rangePickerValue: getTimeDistance('month'),
  };

  componentDidMount() {
    const { dispatch } = this.props;
    this.reqRef = requestAnimationFrame(() => {
      dispatch({
        type: 'chart/fetch',
      }).then(() => {
        const {
          chart: { workshops },
        } = this.props;
        const workshop = workshops && workshops[0] ? workshops[0] : {};
        const processes = workshop.processes || [];
        this.setState({ workshop, processes });
        // 统计行加载完成后，默认条件加载产量图表
        if (processes.length > 0) {
          this.handleProcessChange(processes[0].fItemID);
        }
      });
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'chart/clear',
    });
    cancelAnimationFrame(this.reqRef);
    clearTimeout(this.timeoutId);
  }

  handleRangePickerChange = rangePickerValue => {
    const { dispatch } = this.props;
    const { deptId } = this.state;
    this.setState({
      rangePickerValue,
    });

    dispatch({
      type: 'chart/fetchSalesData',
      payload: { deptId, beginDate: rangePickerValue[0], endDate: rangePickerValue[1] },
    });
  };

  handleWorkShopChange = workShopId => {
    const {
      chart: { workshops },
    } = this.props;
    const workshop = workshops.find(x => x.fItemID == workShopId);
    const { processes } = workshop;
    this.setState({ workshop, processes });
  };

  handleProcessChange = deptId => {
    const { dispatch } = this.props;
    const { rangePickerValue } = this.state;
    this.setState({ deptId });
    dispatch({
      type: 'chart/fetchSalesData',
      payload: { deptId, beginDate: rangePickerValue[0], endDate: rangePickerValue[1] },
    });
  };

  selectDate = type => {
    const { dispatch } = this.props;
    const { deptId } = this.state;
    const rangePickerValue = getTimeDistance(type);
    this.setState({
      rangePickerValue,
    });

    dispatch({
      type: 'chart/fetchSalesData',
      payload: { deptId, beginDate: rangePickerValue[0], endDate: rangePickerValue[1] },
    });
  };

  isActive = type => {
    const { rangePickerValue } = this.state;
    const value = getTimeDistance(type);
    if (!rangePickerValue[0] || !rangePickerValue[1]) {
      return '';
    }
    if (
      rangePickerValue[0].isSame(value[0], 'day') &&
      rangePickerValue[1].isSame(value[1], 'day')
    ) {
      return styles.currentDate;
    }
    return '';
  };

  render() {
    const { workshop, processes, rangePickerValue } = this.state;
    const { chart, loading } = this.props;
    const { workshops, produceData, passRateData, topProduces } = chart;

    return (
      <GridContent>
        <Suspense fallback={<PageLoading />}>
          <IntroduceRow
            loading={loading}
            workshops={workshops}
            onTabChange={this.handleWorkShopChange}
          />
        </Suspense>
        <Suspense fallback={null}>
          <ProduceCard
            processes={processes}
            rangePickerValue={rangePickerValue}
            produceData={produceData}
            passRateData={passRateData}
            topProduces={topProduces}
            isActive={this.isActive}
            handleRangePickerChange={this.handleRangePickerChange}
            loading={loading}
            selectDate={this.selectDate}
            onTabChange={this.handleProcessChange}
          />
        </Suspense>
      </GridContent>
    );
  }
}

export default Analysis;

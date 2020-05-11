﻿import React, { memo } from 'react';
import { Row, Col, Icon, Tabs, Tooltip, DatePicker, Card } from 'antd';
import { FormattedMessage } from 'umi/locale';
import styles from './Analysis.less';
import { ChartCard, MiniArea, MiniBar, MiniProgress, Field } from '@/components/Charts';
import Trend from '@/components/Trend';
import numeral from 'numeral';
import Yuan from '@/utils/Yuan';

const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

const topColResponsiveProps = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12,
  xl: 6,
  style: { marginBottom: 24 },
};

const IntroduceRow = memo(
  ({
    loading,
    rangePickerValue,
    isActive,
    selectDate,
    handleRangePickerChange,
    workshops,
    onTabChange,
  }) =>
    workshops && (
      <Card>
        <Tabs
          style={{ marginTop: -23 }}
          onChange={onTabChange}
          tabBarExtraContent={
            <div className={styles.salesExtraWrap}>
              <div className={styles.salesExtra}>
                <a className={isActive('today')} onClick={() => selectDate('today')}>
                  <FormattedMessage id="app.analysis.all-day" defaultMessage="All Day" />
                </a>
                <a className={isActive('week')} onClick={() => selectDate('week')}>
                  <FormattedMessage id="app.analysis.all-week" defaultMessage="All Week" />
                </a>
                <a className={isActive('month')} onClick={() => selectDate('month')}>
                  <FormattedMessage id="app.analysis.all-month" defaultMessage="All Month" />
                </a>
                <a className={isActive('year')} onClick={() => selectDate('year')}>
                  <FormattedMessage id="app.analysis.all-year" defaultMessage="All Year" />
                </a>
              </div>
              <RangePicker
                value={rangePickerValue}
                onChange={handleRangePickerChange}
                style={{ width: 256 }}
                allowClear={false}
              />
            </div>
          }
        >
          {workshops.map(workshop => (
            <TabPane tab={workshop.fName} key={workshop.fItemID}>
              <Row gutter={24}>
                <Col {...topColResponsiveProps}>
                  <ChartCard
                    style={{ backgroundColor: '#A8D8B9' }}
                    bordered={false}
                    title="投入数量"
                    action={
                      <Tooltip title="已开出流程单的数量">
                        <Icon type="info-circle-o" />
                      </Tooltip>
                    }
                    loading={loading}
                    total={() => `${numeral(workshop.totalInputQty).format('0,0')}`}
                    footer={
                      <Field
                        label="今日投入数量"
                        value={`${numeral(workshop.todayInputQty).format('0,0')}`}
                      />
                    }
                    contentHeight={46}
                  >
                    <MiniBar data={workshop.inputData} />
                  </ChartCard>
                </Col>
                <Col {...topColResponsiveProps}>
                  <ChartCard
                    bordered={false}
                    style={{ backgroundColor: '#DCB879' }}
                    loading={loading}
                    title="已开工数量"
                    action={
                      <Tooltip title="生产生产任务汇报数量">
                        <Icon type="info-circle-o" />
                      </Tooltip>
                    }
                    total={`${numeral(workshop.totalBeginQty).format('0,0')}`}
                    footer={
                      <Field
                        label="今日开工数量"
                        value={`${numeral(workshop.todayBeginQty).format('0,0')}`}
                      />
                    }
                    contentHeight={46}
                  >
                    <MiniBar data={workshop.beginData} />
                  </ChartCard>
                </Col>
                <Col {...topColResponsiveProps}>
                  <ChartCard
                    bordered={false}
                    style={{ backgroundColor: '#A8D8B9' }}
                    loading={loading}
                    title="良品数量"
                    action={
                      <Tooltip title="流程单良品数量">
                        <Icon type="info-circle-o" />
                      </Tooltip>
                    }
                    total={`${numeral(workshop.totalPassQty).format('0,0')}`}
                    footer={
                      <Field
                        label="今日良品数量"
                        value={`${numeral(workshop.todayPassQty).format('0,0')}`}
                      />
                    }
                    contentHeight={46}
                  >
                    <MiniArea color="#975FE4" data={workshop.passData} />
                  </ChartCard>
                </Col>
                <Col {...topColResponsiveProps}>
                  <ChartCard
                    loading={loading}
                    bordered={false}
                    style={{ backgroundColor: '#DCB879' }}
                    title="良品率"
                    action={
                      <Tooltip title="生产流程单良品率">
                        <Icon type="info-circle-o" />
                      </Tooltip>
                    }
                    total={`${numeral(workshop.totalPassRate * 100).format('0,0')}% `}
                    footer={
                      <Field
                        label="今日一次良率"
                        value={`${numeral(workshop.todayPassRate * 100).format('0,0')}% `}
                      />
                    }
                    contentHeight={46}
                  >
                    <MiniProgress
                      percent={workshop.totalPassRate * 100.0}
                      strokeWidth={8}
                      target={80}
                      color="#13C2C2"
                    />
                  </ChartCard>
                </Col>
              </Row>
            </TabPane>
          ))}
        </Tabs>
      </Card>
    )
);

export default IntroduceRow;

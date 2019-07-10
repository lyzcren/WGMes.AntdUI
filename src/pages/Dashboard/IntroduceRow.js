import React, { memo } from 'react';
import { Row, Col, Icon, Tabs, Tooltip } from 'antd';
import { FormattedMessage } from 'umi/locale';
import styles from './Analysis.less';
import { ChartCard, MiniArea, MiniBar, MiniProgress, Field } from '@/components/Charts';
import Trend from '@/components/Trend';
import numeral from 'numeral';
import Yuan from '@/utils/Yuan';

const { TabPane } = Tabs;

const topColResponsiveProps = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12,
  xl: 6,
  style: { marginBottom: 24 },
};

const IntroduceRow = memo(({ loading, visitData, workshops, onTabChange }) => (
  <Tabs style={{ marginTop: -23 }} onChange={onTabChange}>
    {workshops.map(workshop => (
      <TabPane tab={workshop.fName} key={workshop.fItemID}>
        <Row gutter={24}>
          <Col {...topColResponsiveProps}>
            <ChartCard
              bordered={false}
              title={'投入数量'}
              action={
                <Tooltip title={'已开出流程单的数量'}>
                  <Icon type="info-circle-o" />
                </Tooltip>
              }
              loading={loading}
              total={() => `${numeral(workshop.totalInputQty).format('0,0')}`}
              footer={
                <Field
                  label={'今日投入数量'}
                  value={`${numeral(workshop.todayInputQty).format('0,0')}`}
                />
              }
              contentHeight={46}
            >
              <Trend flag="up" style={{ marginRight: 16 }}>
                周同比
                <span className={styles.trendText}>--%</span>
              </Trend>
              <Trend flag="down">
                日同比
                <span className={styles.trendText}>--%</span>
              </Trend>
            </ChartCard>
          </Col>

          <Col {...topColResponsiveProps}>
            <ChartCard
              bordered={false}
              loading={loading}
              title={'完工数量'}
              action={
                <Tooltip title={'已完工流程单数量'}>
                  <Icon type="info-circle-o" />
                </Tooltip>
              }
              total={`${numeral(workshop.totalPassQty).format('0,0')}`}
              footer={
                <Field
                  label={'今日完工数量'}
                  value={`${numeral(workshop.todayPassQty).format('0,0')}`}
                />
              }
              contentHeight={46}
            >
              <MiniArea color="#975FE4" data={visitData} />
            </ChartCard>
          </Col>
          <Col {...topColResponsiveProps}>
            <ChartCard
              bordered={false}
              loading={loading}
              title={'汇报数量'}
              action={
                <Tooltip title={'生产流程单汇报数量'}>
                  <Icon type="info-circle-o" />
                </Tooltip>
              }
              total={`${numeral(workshop.totalReportQty).format('0,0')}`}
              footer={
                <Field
                  label={'今日汇报'}
                  value={`${numeral(workshop.todayReportQty).format('0,0')}`}
                />
              }
              contentHeight={46}
            >
              <MiniBar data={visitData} />
            </ChartCard>
          </Col>
          <Col {...topColResponsiveProps}>
            <ChartCard
              loading={loading}
              bordered={false}
              title={'良品率'}
              action={
                <Tooltip title={'生产流程单良品率'}>
                  <Icon type="info-circle-o" />
                </Tooltip>
              }
              total={`${numeral(
                workshop.totalInputQty === 0
                  ? 0
                  : (workshop.totalPassQty / workshop.totalInputQty) * 100
              ).format('0,0')}% `}
              footer={
                <div style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}>
                  <Trend flag="up" style={{ marginRight: 16 }}>
                    周同比
                    <span className={styles.trendText}>--%</span>
                  </Trend>
                  <Trend flag="down">
                    日同比
                    <span className={styles.trendText}>--%</span>
                  </Trend>
                </div>
              }
              contentHeight={46}
            >
              <MiniProgress percent={78} strokeWidth={8} target={80} color="#13C2C2" />
            </ChartCard>
          </Col>
        </Row>
      </TabPane>
    ))}
  </Tabs>
));

export default IntroduceRow;

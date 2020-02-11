import React, { memo } from 'react';
import { Row, Col, Card, Tabs, DatePicker } from 'antd';
import { FormattedMessage, formatMessage } from 'umi/locale';
import numeral from 'numeral';
import styles from './Analysis.less';
import { Bar } from '@/components/Charts';

const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

const rankingListData = [];
for (let i = 0; i < 12; i += 1) {
  rankingListData.push({
    title: `操作员${i}`,
    total: 32334,
  });
}

const passRateListData = [
  { x: '1月', y: 89 },
  { x: '2月', y: 87 },
  { x: '3月', y: 80 },
  { x: '4月', y: 91 },
  { x: '5月', y: 83 },
  { x: '6月', y: 77 },
  { x: '7月', y: 89 },
  { x: '8月', y: 96 },
  { x: '9月', y: 96 },
  { x: '10月', y: 94 },
  { x: '11月', y: 97 },
  { x: '12月', y: 98 },
];

const ProduceCard = memo(
  ({
    processes,
    rangePickerValue,
    producesData,
    isActive,
    handleRangePickerChange,
    loading,
    selectDate,
  }) => (
    <Card loading={loading} bordered={false} bodyStyle={{ padding: 0 }}>
      <div className={styles.produceCard}>
        <Tabs
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
              />
            </div>
          }
          size="large"
          tabBarStyle={{ marginBottom: 24 }}
        >
          {processes.map(dept => (
            <TabPane tab={dept.fName} key={dept.fItemID}>
              <Row>
                <Col xl={16} lg={12} md={12} sm={24} xs={24}>
                  <div className={styles.salesBar}>
                    <Bar height={250} title="产量" data={producesData} />
                    <Bar
                      color="rgba(24, 205, 104, 0.85)"
                      scale={{ x: { type: 'cat' }, y: { min: 60 } }}
                      height={250}
                      title="良率（%）"
                      data={passRateListData}
                    />
                  </div>
                </Col>
                <Col xl={8} lg={12} md={12} sm={24} xs={24}>
                  <div className={styles.salesRank}>
                    <h4 className={styles.rankingTitle}>操作员产量排名</h4>
                    <ul className={styles.rankingList}>
                      {rankingListData.map((item, i) => (
                        <li key={item.title}>
                          <span
                            className={`${styles.rankingItemNumber} ${i < 3 ? styles.active : ''}`}
                          >
                            {i + 1}
                          </span>
                          <span className={styles.rankingItemTitle} title={item.title}>
                            {item.title}
                          </span>
                          <span className={styles.rankingItemValue}>
                            {numeral(item.total).format('0,0')}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Col>
              </Row>
            </TabPane>
          ))}
        </Tabs>
      </div>
    </Card>
  )
);

export default ProduceCard;

import React, { memo } from 'react';
import { Row, Col, Card, Tabs, DatePicker } from 'antd';
import { FormattedMessage, formatMessage } from 'umi/locale';
import numeral from 'numeral';
import styles from './Analysis.less';
import { Bar } from '@/components/Charts';

const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

const ProduceCard = memo(
  ({
    processes,
    produceData,
    passRateData,
    topProduces,
    topMachineProduces,
    loading,
    onTabChange,
  }) => (
    <div className={styles.produceCard}>
      <Row>
        <Col xl={16} lg={12} md={12} sm={24} xs={24}>
          <Card loading={loading} bordered={true} bodyStyle={{ padding: 0 }}>
            <Tabs onChange={onTabChange} size="large" tabBarStyle={{ marginBottom: 24 }}>
              {processes.map(dept => (
                <TabPane tab={dept.fName} key={dept.fItemID}>
                  <div className={styles.salesBar}>
                    <Bar height={250} title="产量" data={produceData} />
                    <Bar
                      color="rgba(24, 205, 104, 0.85)"
                      scale={{ x: { type: 'cat' }, y: { min: 0, max: 100 } }}
                      height={250}
                      title="良率（%）"
                      data={passRateData}
                    />
                  </div>
                </TabPane>
              ))}
            </Tabs>
          </Card>
        </Col>
        <Col xl={8} lg={12} md={12} sm={24} xs={24}>
          <Card loading={loading} bordered={true} bodyStyle={{ padding: 0 }}>
            <Tabs
              size="small"
              tabBarStyle={{
                marginBottom: 24,
              }}
              style={{
                minHeight: '610px',
              }}
            >
              <TabPane tab={'操作员产量排名'} key={'operator'}>
                <ul className={styles.rankingList}>
                  {topProduces.map((item, i) => (
                    <li key={item.fOperatorName}>
                      <span className={`${styles.rankingItemNumber} ${i < 3 ? styles.active : ''}`}>
                        {i + 1}
                      </span>
                      <span className={styles.rankingItemTitle} title={item.fOperatorName}>
                        {item.fOperatorName}
                      </span>
                      <span className={styles.rankingItemValue}>
                        {numeral(item.total).format('0,0')}
                      </span>
                    </li>
                  ))}
                </ul>
              </TabPane>
              <TabPane tab={'设备产量排名'} key={'machine'}>
                <ul className={styles.rankingList}>
                  {topMachineProduces.map((item, i) => (
                    <li key={item.fMachineName}>
                      <span className={`${styles.rankingItemNumber} ${i < 3 ? styles.active : ''}`}>
                        {i + 1}
                      </span>
                      <span className={styles.rankingItemTitle} title={item.fMachineName}>
                        {item.fMachineName}
                      </span>
                      <span className={styles.rankingItemValue}>
                        {numeral(item.total).format('0,0')}
                      </span>
                    </li>
                  ))}
                </ul>
              </TabPane>
            </Tabs>
          </Card>
        </Col>
      </Row>
    </div>
  )
);

export default ProduceCard;

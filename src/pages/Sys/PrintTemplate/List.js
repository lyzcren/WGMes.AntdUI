import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Form, Card, Button, Icon, List } from 'antd';

import Ellipsis from '@/components/Ellipsis';
import WgPageHeaderWrapper from '@/components/WgPageHeaderWrapper';

import { ManageForm } from './ManageForm';

import styles from './List.less';

/* eslint react/no-multi-comp:0 */
@connect(({ printTemplateManage, loading }) => ({
  printTemplateManage,
  loading: loading.models.printTemplateManage,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    // 界面是否可见
    modalVisible: {
      manage: false,
    },
    // 当前操作选中列的数据
    currentFormValues: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'printTemplateManage/groups',
    });
  }

  handleModalVisible = ({ key, flag }, record) => {
    const { modalVisible } = this.state;
    modalVisible[key] = !!flag;
    this.setState({
      modalVisible: { ...modalVisible },
      currentFormValues: record || {},
    });
  };

  viewManage = record => {
    this.handleModalVisible({ key: 'manage', flag: true }, record);
  };

  render() {
    const {
      printTemplateManage: { groups },
      loading,
    } = this.props;
    const { modalVisible, currentFormValues } = this.state;

    const content = (
      <div className={styles.pageHeaderContent}>
        <p>
          当前系统使用锐浪报表作为打印解决方案，若要了解更多相关内容请访问：
          <a>http://www.gridreport.cn</a>。
        </p>
        <div className={styles.contentLink}>
          <a href="http://www.rubylong.cn/download/gridreport6-webapp.exe">
            <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/MjEImQtenlyueSmVEfUD.svg" />{' '}
            打印插件
          </a>
          <a href="http://www.rubylong.cn/download/Grid++Report6.zip">
            <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/MjEImQtenlyueSmVEfUD.svg" />{' '}
            报表开发插件
          </a>
          <a href="http://www.gridreport.cn/demos/html5/" target="_blank">
            <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/ohOEPSYdDTNnyMbGuyLb.svg" />{' '}
            参考设计文档
          </a>
        </div>
      </div>
    );

    const extraContent = (
      <div className={styles.extraImg}>
        <img
          alt="这是一个标题"
          src="https://gw.alipayobjects.com/zos/rmsportal/RzwpdLnhmvDJToTdfDPe.png"
        />
      </div>
    );

    return (
      <WgPageHeaderWrapper title="打印模板" content={content} extraContent={extraContent}>
        <div className={styles.cardList}>
          <List
            rowKey="id"
            loading={loading}
            grid={{ gutter: 24, lg: 4, md: 3, sm: 2, xs: 1 }}
            dataSource={groups}
            renderItem={item => (
              <List.Item key={item.fNumber}>
                <Card
                  hoverable
                  className={styles.card}
                  actions={[
                    <a onClick={() => this.viewManage(item)}>模板管理</a>,
                    <a>打印权限</a>,
                    <a>设计权限</a>,
                  ]}
                >
                  <Card.Meta
                    // avatar={<img alt="" className={styles.cardAvatar} src={item.avatar} />}
                    title={<a>{item.fName}</a>}
                    description={
                      <Ellipsis className={styles.item} lines={3}>
                        {item.fDescription}
                      </Ellipsis>
                    }
                  />
                </Card>
              </List.Item>
            )}
          />
        </div>
        {currentFormValues ? (
          <ManageForm
            modalVisible={modalVisible.manage}
            handleModalVisible={(flag, record) =>
              this.handleModalVisible({ key: 'manage', flag }, record)
            }
            values={currentFormValues}
          />
        ) : null}
      </WgPageHeaderWrapper>
    );
  }
}

export default TableList;

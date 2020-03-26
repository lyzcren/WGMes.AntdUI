import React, { Fragment } from 'react';
import { Layout, Icon } from 'antd';
import monment from 'moment';
import GlobalFooter from '@/components/GlobalFooter';

const { Footer } = Layout;
const FooterView = () => (
  <Footer style={{ padding: 0 }}>
    <GlobalFooter
      links={[
        {
          key: '望果首页',
          title: '望果首页',
          href: 'http://www.wgyun.com.cn',
          blankTarget: true,
        },
        // {
        //   key: 'github',
        //   title: <Icon type="github" />,
        //   href: 'https://github.com/ant-design/ant-design-pro',
        //   blankTarget: true,
        // },
        {
          key: '望果云',
          title: '望果云',
          href: 'http://wgyun.com.cn',
          blankTarget: true,
        },
      ]}
      copyright={
        <Fragment>
          Copyright <Icon type="copyright" /> 2019~{monment().format('YYYY')} 望果信息科技有限公司
        </Fragment>
      }
    />
  </Footer>
);
export default FooterView;

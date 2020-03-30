import React, { Fragment } from 'react';
import monment from 'moment';
import { formatMessage } from 'umi/locale';
import Link from 'umi/link';
import { Icon } from 'antd';
import GlobalFooter from '@/components/GlobalFooter';
import SelectLang from '@/components/SelectLang';
import styles from './UserLayout.less';
import logo from '../assets/logoOri.svg';

const links = [
  {
    key: 'help',
    title: formatMessage({ id: 'layout.user.link.help' }),
    href: 'https://doc.ywlin.cn/',
    blankTarget: true,
  },
  {
    key: 'privacyAndTerms',
    title: formatMessage({ id: 'layout.user.link.privacyAndTerms' }),
    href: '/user/privacyAndTerms',
  },
];

const copyright = (
  <Fragment>
    Copyright <Icon type="copyright" /> {`2019~${monment().format('YYYY')} 望果信息科技有限公司`}
  </Fragment>
);

class UserLayout extends React.PureComponent {
  // @TODO title
  // getPageTitle() {
  //   const { routerData, location } = this.props;
  //   const { pathname } = location;
  //   let title = 'Ant Design Pro';
  //   if (routerData[pathname] && routerData[pathname].name) {
  //     title = `${routerData[pathname].name} - Ant Design Pro`;
  //   }
  //   return title;
  // }

  render() {
    const { children } = this.props;
    return (
      // @TODO <DocumentTitle title={this.getPageTitle()}>
      <div className={styles.container}>
        <div className={styles.lang}>
          <SelectLang />
        </div>
        <div className={styles.content}>
          <div className={styles.top}>
            <div className={styles.header}>
              <Link to="/">
                <img alt="logo" className={styles.logo} src={logo} />
                <span className={styles.title}>望果制造执行系统</span>
              </Link>
            </div>
            <div className={styles.desc}>工厂智能化管理专家</div>
          </div>
          {children}
        </div>
        <GlobalFooter links={links} copyright={copyright} />
      </div>
    );
  }
}

export default UserLayout;

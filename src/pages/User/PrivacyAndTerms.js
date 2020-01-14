import React, { Component } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
// import Link from 'umi/link';
import { Checkbox, Alert, Button, Typography, Divider, Card } from 'antd';

import styles from './PrivacyAndTerms.less';

const { Title, Paragraph, Text } = Typography;

@connect(({ user, loading, menu }) => ({
  user,
  menu,
}))
class PrivacyAndTermsPage extends Component {
  state = {
    type: 'account',
    autoPrivacyAndTerms: false,
  };

  render() {
    const { user, submitting } = this.props;
    const { type, autoPrivacyAndTerms } = this.state;
    return (
      <div className={styles.main}>
        <Card>
          <Title style={{ textAlign: 'center' }}>隐私及条款</Title>
          <Title level={4}>引言及特别提示</Title>
          <Paragraph>
            {`
              欢迎您与深圳望果信息科技有限公司(ShenZhen Emblic Information Technology Co. Ltd.)共同签署《望果科技服务使用协议》（下称“本协议”），望果科技在此特别提醒，在您使用望果科技提供的<望果MES>（包括任何免费或者收费服务）前，请审慎阅读本协议的全部条款、充分理解各条款内容，特别是免除或者限制望果科技责任的条款、对您权利限制条款、法律适用和争议解决条款，如您对本协议有任何疑问，可向望果科技电话客服咨询。最终解释权在法律允许范围内归本公司所有。
              `}
          </Paragraph>
          <Title level={4}>目录</Title>
          <Paragraph>
            {`
              1.协议的范围
              `}
          </Paragraph>
          <Paragraph>
            {`
              2.账号的使用
            `}
          </Paragraph>
          <Paragraph>
            {`
              3.服务内容
              `}
          </Paragraph>
          <Paragraph>
            {`
              4.服务变更、中断或终止
              `}
          </Paragraph>
          <Paragraph>
            {`
              5.企业信息的隐私保护
              `}
          </Paragraph>
          <Paragraph>
            {`
              6.用户行为规范
              `}
          </Paragraph>
          <Paragraph>
            {`
              7.广告
              `}
          </Paragraph>
          <Paragraph>
            {`
              8.知识产权
              `}
          </Paragraph>
          <Paragraph>
            {`
              9.免责声明
              `}
          </Paragraph>
          <Paragraph>
            {`
              10.法律管辖
              `}
          </Paragraph>
          <Title level={4}>1.协议的范围</Title>
          <Paragraph>
            {`
              1.1
本协议是由您与望果科技之间关于使用望果MES相关的协议。
              `}
          </Paragraph>
          <Title level={4}>2.账号的使用</Title>
          <Paragraph>
            {`
              2.1
您在使用望果科技提供的望果MES时,需要一个管理员账号进行登录，账号请联系深圳望果信息科技有限公司提供。
              `}
          </Paragraph>
          <Paragraph>
            {`
                2.2
该账户名称和密码为您自行设置并由您负责保管；您应当对以您名称和密码登录后所进行的一切活动和事件负法律责任。
                `}
          </Paragraph>
          <Paragraph>
            {`
                2.3
您不应将帐号、密码转让或出借予他人使用。如您发现帐号遭他人非法使用，应立即通知望果科技。因黑客行为或您的保管疏忽导致帐号、密码遭他人非法使用，望果科技不承担任何责任。
                `}
          </Paragraph>
          <Title level={4}>3.服务内容</Title>
          <Paragraph>
            {`
                3.1
望果MES的具体内容由望果科技根据实际业务情况提供开发设计等。望果科技有权根据业务开展情况不时变更、中止或中断部分或全部网络服务内容。
              `}
          </Paragraph>
          <Paragraph>
            {`
                3.2
望果MES的部分内容可能涉及由第三方个人或单位提供，望果MES的任何第三方所提供的服务品质及内容由该第三方自行负责。您应当知晓并按照第三方服务协议使用第三方服务。第三方的内容、产品、服务、广告和其他任何信息均需由您自行判断并承担风险,望果科技不保证其内容及网络服务的及时性、安全性、准确性，若因此引发任何争议或损害，望果科技对此不承担责任。
              `}
          </Paragraph>
          <Paragraph>
            {`
                3.3
望果科技仅提供相关的望果MES软件，除此之外与相关网络服务有关的设备（如个人电脑、手机、及其他与接入互联网或移动网有关的装置）及所需的费用（如为接入互联网而支付的电话费及上网费、为使用移动网而支付的手机费）均应由您自行负担。
              `}
          </Paragraph>
          <Title level={4}>4.服务变更、中断或终止</Title>
          <Paragraph>
            {`4.1
                望果科技需要定期或不定期地对望果MES软件或相关的设备进行检修或者维护，如因此类情况而造成在合理时间内的中断，望果科技无需为此承担任何责任，但望果科技应尽可能事先进行通告。
                
              `}
          </Paragraph>
          <Paragraph>
            {`4.2
                如发生下列任何一种情形，望果科技有权随时中断或终止向您提供本协议项下的网络服务【该网络服务包括但不限于收费及免费网络服务（其中包括基于广告模式的免费网络服务）】而无需对您或任何第三方承担任何责任：
                
              `}
          </Paragraph>
          <Paragraph>
            {`4.2.1 您违反本协议中规定的使用规则；
              `}
          </Paragraph>
          <Paragraph>
            {`4.2.2 您在使用望果MES时未按规定向望果科技支付相应的服务费；
              `}
          </Paragraph>
          <Paragraph>
            {`4.2.3 因自然灾害、罢工、暴乱、战争、政府行为、司法行政命令等不可抗力因素；
              `}
          </Paragraph>
          <Paragraph>
            {`4.2.4 因电力供应故障、通讯网络故障等公共服务因素或第三人因素；
              `}
          </Paragraph>
          <Paragraph>
            {`4.2.5 在望果科技已尽善意管理的情况下，因常规或紧急的设备与系统维护、设备与系统故障、网络信息与数据安全等因素。
              `}
          </Paragraph>
          <Paragraph>
            {`4.5
                您在望果MES的帐号昵称如存在违反法律法规或国家政策要求，或侵犯任何第三方合法权益的情况，望果科技有权收回该账号昵称。                
              `}
          </Paragraph>
          <Title level={4}>5. 企业信息的隐私保护</Title>
          <Paragraph>
            {`5.1
              保护用户企业信息隐私是望果科技的一项基本政策，望果科技保证不对外公开或向第三方提供您的非公开内容，但下列情况除外：
              
              `}
          </Paragraph>
          <Paragraph>
            {`5.1.1 事先获得您的明确授权；
              `}
          </Paragraph>
          <Paragraph>
            {`5.1.2 根据有关的法律法规要求；
              `}
          </Paragraph>
          <Paragraph>
            {`5.1.3 按照相关政府主管部门的要求；
              `}
          </Paragraph>
          <Paragraph>
            {`5.1.4为完成合并、分立、收购或资产转让而转移；
              `}
          </Paragraph>
          <Paragraph>
            {`5.1.5为维护社会公众的利益；
              `}
          </Paragraph>
          <Title level={4}>6. 用户行为规范</Title>
          <Paragraph>
            {`6.1
              您不得使用未经望果科技授权的插件、外挂或第三方工具对本协议项下的服务进行干扰、破坏、修改或施加其他影响。
              
              `}
          </Paragraph>
          <Paragraph>
            {`6.2
              您在使用望果MES过程中，必须遵循以下原则：
              
              `}
          </Paragraph>
          <Paragraph>
            {`6.2.1 不得制作、复制、发布、传播含有反对宪法所确定的基本原则的信息内容；
              `}
          </Paragraph>
          <Paragraph>
            {`6.2.2 不得制作、复制、发布、传播含有危害国家安全，泄露国家秘密，颠覆国家政权，破坏国家统一的信息内容；
              `}
          </Paragraph>
          <Paragraph>
            {`6.2.3 不得制作、复制、发布、传播含有损害国家荣誉和利益的信息内容；
              `}
          </Paragraph>
          <Paragraph>
            {`6.2.4 不得制作、复制、发布、传播含有煽动民族仇恨、民族歧视，破坏民族团结，破坏国家宗教政策，宣扬邪教和封建迷信的信息内容；
              `}
          </Paragraph>
          <Paragraph>
            {`6.2.5 不得制作、复制、发布、传播含有散布谣言，扰乱社会秩序，破坏社会稳定的信息内容；
              `}
          </Paragraph>
          <Paragraph>
            {`6.2.6 不得制作、复制、发布、传播含有散布淫秽、色情、赌博、暴力、凶杀、恐怖或者教唆犯罪的信息内容；
              `}
          </Paragraph>
          <Paragraph>
            {`6.2.7 不得制作、复制、发布、传播含有侮辱或者诽谤他人，侵害他人合法权益的信息内容；
              `}
          </Paragraph>
          <Paragraph>
            {`6.2.8 不得以任何形式使用望果MES侵犯望果科技的商业利益，包括并不限于发布非经望果科技许可的商业广告；
              `}
          </Paragraph>
          <Paragraph>
            {`6.2.9 不得利用望果MES进行任何可能对互联网或移动网正常运转造成不利影响的行为；
              `}
          </Paragraph>
          <Paragraph>
            {`6.2.10 不得侵犯其他任何第三方的专利权、著作权、商标权、名誉权或其他任何合法权益；
              `}
          </Paragraph>
          <Paragraph>
            {`6.2.11 不得利用望果MES进行任何不利于望果科技及其关联主体的行为；
              `}
          </Paragraph>
          <Paragraph>
            {`6.2.12 必须按照《中华人民共和国英雄烈士保护法》的规定使用望果MES，不得利用望果MES歪曲、丑化、亵渎、否定英雄烈士事迹和精神；
              `}
          </Paragraph>
          <Paragraph>
            {`6.2.13不得含有法律、行政法规禁止的其他内容的。
              `}
          </Paragraph>
          <Title level={4}>7. 广告</Title>
          <Paragraph>
            {`7.1
              您同意望果科技有权在望果MES过程中以各种方式投放各种商业性广告或其他任何类型的商业信息。
              
              `}
          </Paragraph>
          <Title level={4}>8. 知识产权</Title>
          <Paragraph>
            {`8.1
              望果MES提供的任何软件、商业标识、版面设计、排版方式、文字、图片、图形、有关数据等内容、功能和服务的著作权、商标权、专利权、商业秘密等知识产权均归望果科技所有，均受法律法规和相应的国际条约的保护，但相关权利人依照法律规定应享有的权利除外。
              
              `}
          </Paragraph>
          <Paragraph>
            {`8.2
              除法律另有强制性规定外，未经望果科技或相关权利人许可，任何单位或个人不得以任何形式非法地全部或部分复制、转载、引用、链接、抓取、反向工程、反向编译、反汇编或以其他方式使用望果科技或相关权利人提供的望果MES包含的任何文本、图片、图形、资料等信息内容，否则，望果科技或相关权利人有权追究其法律责任。望果科技不就由上述资料产生或在传送或递交全部或部分上述资料过程中产生的延误、不准确、错误和遗漏或从中产生或由此产生的任何损害赔偿，以任何形式，向您或任何第三方负责。
              
              `}
          </Paragraph>
          <Title level={4}>9. 免责声明</Title>
          <Paragraph>
            {`9.1
              望果科技不担保您经由望果MES取得的任何服务、咨询、机会或其他信息内容一定能满足您的要求和期望。您理解并同意使用望果MES时由于非望果科技过错所导致的一切风险和损失由您自行承担，望果科技对您不承担任何责任。
              
              `}
          </Paragraph>
          <Paragraph>
            {`9.2
              对于因不可抗力或望果科技不能控制的原因造成的网络服务中断或其它缺陷，望果科技不承担任何责任，但将按照行业标准合理审慎地采取必要措施减少因此而给您造成的损失和影响。
              
              `}
          </Paragraph>
          <Paragraph>
            {`9.3
              望果科技不保证为您提供的望果MES中可能存在的外部链接的准确性和完整性，同时，对于该等外部链接指向的不由望果科技实际控制的任何链接上的内容，望果科技不承担任何责任。
              
              `}
          </Paragraph>
          <Paragraph>
            {`9.4
              您理解并同意，望果科技将会尽其商业上的合理努力保障您在望果MES的数据存储安全，但是望果科技并不能就此提供完全保证，包括但不限于以下情形：不对您在望果MES中相关数据的删除或存储失败负责。
              
              `}
          </Paragraph>
          <Paragraph>
            {`9.5
              您同意，除产品或服务存在质量问题或法律另有强制性规定外，对于望果科技向您免费提供的或赠送的各项产品或服务，引发的任何损失，望果科技无需承担任何责任。
              
              `}
          </Paragraph>
          <Title level={4}>10. 法律管辖</Title>
          <Paragraph>
            {`10.1
              本协议的成立、生效、履行、解释及争议的解决均应适用中华人民共和国大陆地区法律。
              
              `}
          </Paragraph>
          <Paragraph>
            {`10.2
              本协议签订地为中华人民共和国深圳市龙岗区。
              
              `}
          </Paragraph>
          <Paragraph>
            {`10.3
              如双方就使用望果MES或本协议内容或其执行发生任何争议，双方应尽量友好协商解决；协商不成时，可向望果科技所在地的人民法院提起诉讼。
              
              `}
          </Paragraph>
          <br />
          <Button type="primary" className={styles.ok} href="/user/login">
            确认
          </Button>
        </Card>
      </div>
    );
  }
}

export default PrivacyAndTermsPage;

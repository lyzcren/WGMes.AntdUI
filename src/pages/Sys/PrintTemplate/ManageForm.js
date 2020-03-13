import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Form, Input, Modal, Switch, Tag, message, Button, Icon, Upload } from 'antd';
import { formatMessage, FormattedMessage } from 'umi/locale';

import { getToken } from '@/utils/token';

const FormItem = Form.Item;

@connect(({ printTemplateManage, loading, basicData }) => ({
  printTemplateManage,
  loading: loading.models.printTemplateManage,
  basicData,
}))
@Form.create()
/* eslint react/no-multi-comp:0 */
export class ManageForm extends PureComponent {
  static defaultProps = {
    handleSuccess: () => { },
    handleModalVisible: () => { },
    values: {},
    fileList: [],
  };

  constructor(props) {
    super(props);

    this.state = {
      formVals: props.values,
    };
  }

  componentDidUpdate (preProps) {
    const prevNumber = preProps.values.fNumber;
    const {
      values: { fNumber },
    } = this.props;
    if (prevNumber !== fNumber && !!fNumber) {
      this.refreshFileList();
    }
  }

  refreshFileList () {
    const {
      dispatch,
      values: { fNumber },
    } = this.props;
    dispatch({
      type: 'printTemplateManage/getPrintTemplates',
      payload: { number: fNumber },
    }).then(() => {
      const {
        printTemplateManage: { printTemplates },
      } = this.props;
      let env = process.env.NODE_ENV;
      let printUrl = '';
      if (env === 'development') {
        printUrl = ``;
      } else {
        printUrl = `http://print.ywlin.cn`;
      }
      if (!!printTemplates) {
        this.setState({
          fileList: printTemplates.map(x => {
            return {
              uid: x.fInterID,
              name: x.fName,
              status: 'done',
              // response: 'Server Error 500', // custom error message to show
              url: printUrl + '/api/PrintTemplate/grf?id=' + x.fInterID,
            };
          }),
        });
      } else {
        this.setState({ fileList: [] });
      }
    });
  }

  deleteTemplate (id) {
    const { dispatch } = this.props;
    dispatch({
      type: 'printTemplateManage/removePrintTemplate',
      payload: { id },
    }).then(() => {
      this.refreshFileList();
    });
  }

  handleSubmit = fields => {
    const { dispatch, handleModalVisible, handleSuccess } = this.props;
    dispatch({
      type: 'printTemplateManage/update',
      payload: fields,
    }).then(() => {
      const {
        printTemplateManage: { queryResult },
      } = this.props;
      if (queryResult.status === 'ok') {
        message.success('修改成功');
        handleModalVisible(false);
        // 成功后再次刷新列表
        if (handleSuccess) handleSuccess();
      } else if (queryResult.status === 'warning') {
        message.warning(queryResult.message);
      } else {
        message.error(queryResult.message);
      }
    });
  };

  onFileChange = info => {
    if (info.file.status === 'removed') {
      Modal.confirm({
        title: '删除模板',
        content: '确定删除打印模板吗？',
        okText: '确认',
        cancelText: '取消',
        onOk: () => this.deleteTemplate(info.file.uid),
        onCancel: () => { },
      });
      return;
    }

    if (info.file.status === 'uploading') {
      const fileList = [...info.fileList];
      this.setState({ fileList });
    }
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      this.refreshFileList();
      message.success(`${info.file.name} 文件上传成功.`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} 文件上传失败.`);
    }
  };

  render () {
    const { form, modalVisible, handleModalVisible, values } = this.props;
    const { formVals, fileList } = this.state;
    const footer = (
      <div>
        <Button
          loading={false}
          onClick={() => handleModalVisible(false)}
          prefixCls="ant-btn"
          ghost={false}
          block={false}
        >
          关闭
        </Button>
      </div>
    );

    const uploadProps = {
      name: 'file',
      action: '/api/PrintTemplate/upload',
      headers: {
        enctype: 'multipart/form-data',
        wgToken: getToken(),
      },
      data: {
        number: values.fNumber,
      },
      fileList: fileList,
      onChange: this.onFileChange,
    };

    return (
      <Modal
        destroyOnClose
        title={
          <div>
            模板管理-<Tag color="blue">{values.fName}</Tag>
          </div>
        }
        visible={modalVisible}
        footer={footer}
        onCancel={() => handleModalVisible(false, values)}
        afterClose={() => handleModalVisible()}
      >
        <Upload {...uploadProps}>
          <Button>
            <Icon type="upload" />
            点击上传模板
          </Button>
        </Upload>
      </Modal>
    );
  }
}

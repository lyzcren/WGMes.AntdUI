import { Divider, Drawer, Form, Input, InputNumber } from 'antd';
import { connect } from 'dva';
import React, { PureComponent } from 'react';

const FormItem = Form.Item;

@connect(({ flowTransfer, basicData, loading }) => ({
  flowTransfer,
  basicData,
  loading: loading.models.flowTransfer,
}))
@Form.create()
class DefectDrawer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      // 界面是否可见
      visible: !!props.visible,
    };
    // 使用ref对外暴露当前组件方法，方便交互
    if (this.props.refOpen) {
      this.props.refOpen(this.open);
    }
  }

  componentDidMount() {
    const { dispatch } = this.props;

    dispatch({
      type: 'basicData/getDefectData',
    });
  }

  open = () => {
    this.setState({ visible: true });
    if (this.searchItem) {
      this.searchItem.focus();
    }
  };

  onClose = () => {
    this.setState({ visible: false });
  };

  onSearchKeyDown = e => {
    if (e.key === 'Enter') {
    }
  };

  onKeyDown = (e, fDefectID) => {
    if (e.key === 'Enter') {
      if (this.searchItem) {
        this.searchItem.focus();
      }
    }
  };

  handleQtyChange(fDefectID, fQty = 0) {
    const { dispatch } = this.props;
    dispatch({
      type: 'flowTransfer/changeDefect',
      payload: { fDefectID, fQty: fQty ?? 0 },
    });
  }

  renderItem = d => {
    const {
      form: { getFieldDecorator },
      flowTransfer: {
        data: { defectList, fQtyDecimal = 0 },
      },
    } = this.props;
    const existsDefect = defectList.find(x => x.fDefectID == d.fItemID) || {};

    return (
      <FormItem key={`defectID_${d.fItemID}`} label={`${d.fName}（${d.fNumber}）`}>
        {getFieldDecorator(`defectID_${d.fItemID}`, {
          rules: [{ required: false, message: '' }],
          initialValue: existsDefect.fQty,
        })(
          <InputNumber
            onChange={val => this.handleQtyChange(d.fItemID, val)}
            style={{ width: '100%' }}
            placeholder="请输入数量"
            min={0}
            step={Math.pow(0.1, fQtyDecimal)}
            precision={fQtyDecimal}
            // onChange={val => console.log(val)}
            onKeyDown={e => this.onKeyDown(e, d.fItemID)}
          />
        )}
      </FormItem>
    );
  };

  render() {
    const {
      form: { getFieldDecorator, getFieldValue },
      basicData: { defectData },
      flowTransfer: {
        data: { defectList, fQtyDecimal = 0 },
      },
    } = this.props;
    const { visible } = this.state;
    const queryValue = getFieldValue('queryNumber');

    return (
      <Drawer
        title="更多不良"
        placement="right"
        closable={false}
        onClose={this.onClose}
        visible={visible}
        getContainer={false}
        style={{ position: 'absolute' }}
      >
        <Form layout="vertical" hideRequiredMark>
          <FormItem label="过滤条件">
            {getFieldDecorator('queryNumber')(
              <Input
                autoFocus
                allowClear
                placeholder="请输入不良名称或编码"
                // onKeyDown={this.onSearchKeyDown}
                ref={node => {
                  this.searchItem = node;
                }}
              />
            )}
          </FormItem>
          <Divider>不良</Divider>
          {defectData
            .filter(
              x =>
                !queryValue ||
                x.fName.toLowerCase().includes(queryValue.toLowerCase()) ||
                x.fNumber.toLowerCase().includes(queryValue.toLowerCase())
            )
            .map(d => this.renderItem(d))}
        </Form>
      </Drawer>
    );
  }
}

export default DefectDrawer;

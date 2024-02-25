import {
  ModalForm, ProColumns,
  ProFormDateTimePicker,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProFormTextArea, ProTable,
  StepsForm,
} from '@ant-design/pro-components';
import {Modal} from 'antd';
import React from 'react';

export type FormValueType = {
  target?: string;
  template?: string;
  type?: string;
  time?: string;
  frequency?: string;
} & Partial<API.RuleListItem>;

export type Props = {
  columns: ProColumns<API.InterfaceInfo>[], // 新建弹窗中表单的数据
  onCancel: () => void,// 点击弹窗取消按钮方法
  onSubmit: (values: API.InterfaceInfo) => Promise<void>,// proTable 提交表单的执行的方法
  visible: boolean,// 弹窗是否弹出
};


const ShowAddFrom: React.FC<Props> = (props) => {
  const {columns, onCancel, visible, onSubmit} = props;

  return <Modal onCancel={() => onCancel?.()} visible={visible} footer={null}>
    <ProTable type={"form"} columns={columns} onSubmit={(value) => onSubmit(value)
    }/>
  </Modal>

}

export default ShowAddFrom;

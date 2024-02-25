import {
  ModalForm, ProColumns,
  ProFormDateTimePicker,
  ProFormSelect,
  ProFormText,
  ProFormTextArea, ProTable,
  StepsForm,
} from '@ant-design/pro-components';
import {Modal} from 'antd';
import React, {useEffect, useRef} from 'react';
import {ProFormInstance} from "@ant-design/pro-form/lib";



export type Props = {
  columns: ProColumns<API.InterfaceInfo>[], // 新建弹窗中表单的数据
  onCancel: () => void,// 点击弹窗取消按钮方法
  onSubmit: (values: API.InterfaceInfo) => Promise<void>,// proTable 提交表单的执行的方法
  visible: boolean,// 弹窗是否弹出
  values: API.InterfaceInfo, // 传进来的item接口信息
};



const ShowUpdateFrom: React.FC<Props> = (props) => {
  const {columns, onCancel, visible, onSubmit,values} = props;
  const fromRef = useRef<ProFormInstance>()
  useEffect(() => {// 监听
    if (fromRef) {
      fromRef.current?.setFieldsValue(values)
    }
  },[values])

  return <Modal onCancel={() => onCancel?.()} visible={visible} footer={null}>
    <ProTable type={"form"}
              columns={columns}
              onSubmit={(value) => onSubmit(value)}
              formRef={fromRef}
    />
  </Modal>

}

export default ShowUpdateFrom;

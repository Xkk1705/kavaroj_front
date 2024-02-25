import {PageContainer} from '@ant-design/pro-components';
import {Card, message, theme} from 'antd';
import React, {useEffect, useState} from 'react';
import {
  deleteInterfaceInfoUsingPost,
  getInterfaceInfoVoByIdUsingGet,
  invokeInterfaceInfoUsingPost
} from "@/services/kkapi/interfaceInfoController";
import {useParams} from "@@/exports";
import {ProCard} from '@ant-design/pro-components';
import {ProForm, ProFormTextArea,} from '@ant-design/pro-components';
import {values} from "lodash";

const InterfaceInfoDesc: React.FC = () => {
  const [data, setData] = useState<API.InterfaceInfo>({});
  const [invokeDate, setInvokeDate] = useState<string>("");
  const para = useParams() // 获取动态路由的数据id
  const loadDate = async () => {
    const hide = message.loading('正在请求');
    try {
      const res = await getInterfaceInfoVoByIdUsingGet({
        id: Number(para.id)
      });
      hide();
      if (res.data) {
        setData(res?.data ?? []) // 如果们没有数据给一个空数组
        message.success('请求成功');
      }
      return res;
    } catch (error) {
      hide();
      message.error('请求失败');
      return false;
    }
  }

  // 首次加载的时候调用请求
  useEffect(() => {
    loadDate()
  }, [])


  return (
    <PageContainer>
      <>
        <ProCard
          bordered
          headerBordered
          direction="column"
          gutter={[0, 16]}
          style={{marginBlockStart: 8}}
          size={"small"}
        >
          <ProCard title="接口名称" type="inner" size={"small"} bordered>
            {data.name}
          </ProCard>
          <ProCard title="接口地址" type="inner" size={"small"} bordered>
            {data.url}
          </ProCard>
          <ProCard title="请求方法" type="inner" size={"small"} bordered>
            {data.method}
          </ProCard>
          <ProCard title="请求请求头" type="inner" size={"small"} bordered>
            {data.requestHeader}
          </ProCard>
          <ProCard title="请求参数" type="inner" size={"small"} bordered>
            {data.requestParams}
          </ProCard>
          <ProCard title="响应头" type="inner" size={"small"} bordered>
            {data.responseHeader}
          </ProCard>
          <ProCard title="接口状态" type="inner" size={"small"} bordered>
            {data.status === 1 ? "已上线" : "下线"}
          </ProCard>
          <ProCard title="更新时间" type="inner" size={"small"} bordered>
            {data.updateTime}
          </ProCard>
        </ProCard>
        <ProForm<API.UserInvokeRequest>
          submitter={{
            searchConfig: {
              resetText: '重置',
              submitText: '调用',
            },
            resetButtonProps: {
              style: {
                // 隐藏重置按钮
                display: 'none',
              },
            },
          }}
          onFinish={async (values: API.UserInvokeRequest) => {
            const hide = message.loading('正在调用');
            if (!values) return true;
            try {
              const res =  await invokeInterfaceInfoUsingPost({
                id: data.id,
                ...values,
              });
              setInvokeDate(res?.data ?? "")
              hide();
              return true;
            } catch (error) {
              hide();
              message.error('Delete failed, please try again');
              return false;
            }
          }}
        >
          <ProFormTextArea
            colProps={{span: 24}}
            name="userRequestParams"
            label="请输入接口参数"
          />
        </ProForm>
        {invokeDate ? <ProCard title="返回结果" type="inner" size={"small"} bordered>
          {invokeDate}
        </ProCard> : <></>
        }
      </>
    </PageContainer>
  );
};



export default InterfaceInfoDesc;






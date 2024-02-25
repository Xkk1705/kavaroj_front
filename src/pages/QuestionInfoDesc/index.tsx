import {PageContainer, ProFormSelect} from '@ant-design/pro-components';
import {Card, message, theme} from 'antd';
import React, {useEffect, useState} from 'react';
import {useParams} from "@@/exports";
import {ProCard} from '@ant-design/pro-components';
import {ProForm, ProFormTextArea,} from '@ant-design/pro-components';
import {addQuestionUsingPost, getQuestionVoByIdUsingGet} from "@/services/kaverOJ/questionController";
import {useModel} from "@@/plugin-model";
import {addQuestionSubmitUsingPost} from "@/services/kaverOJ/questionSubmitController";

const QuestionInfoDesc: React.FC = () => {
  const [data, setData] = useState<API.QuestionVO>({});
  const [invokeDate, setInvokeDate] = useState<string>("");
  const {initialState} = useModel('@@initialState');
  const para = useParams() // 获取动态路由的数据id
  const loadDate = async () => {
    const hide = message.loading('正在请求');
    try {
      const res = await getQuestionVoByIdUsingGet({
        id: para.id
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
          <ProCard title="问题名称" type="inner" size={"small"} bordered>
            {data.title}
          </ProCard>
          <ProCard title="时间限制" type="inner" size={"small"} bordered>
            {data.judgeConfig?.limitTime}
          </ProCard>
          <ProCard title="内存限制" type="inner" size={"small"} bordered>
            {data.judgeConfig?.limitMemory}
          </ProCard>
          <ProCard title="题目描述" type="inner" size={"small"} bordered>
            {data.content}
          </ProCard>
          <ProCard title="输入用例" type="inner" size={"small"} bordered>
            {data.judgeCaseList ? data?.judgeCaseList[0].input : ""}
          </ProCard>
          <ProCard title="输出用例" type="inner" size={"small"} bordered>
            {data.judgeCaseList ? data?.judgeCaseList[0].output : ""}
          </ProCard>
        </ProCard>
        <ProForm<API.UserInvokeRequest>
          submitter={{
            searchConfig: {
              resetText: '重置',
              submitText: '提交',
            },
            resetButtonProps: {
              style: {
                // 隐藏重置按钮
                display: 'none',
              },
            },
          }}
          //   code?: string;
          // id?: number;
          // language?: string;
          // questionId?: number;
          // userId?: number;
          onFinish={async (values: API.QuestionSubmitAddRequest) => {
            const hide = message.loading('正在调用');
            if (!values) return true;
            try {
              const res = await addQuestionSubmitUsingPost({
                userId: initialState?.loginUser?.id,
                questionId: para.id as any,
                ...values,
              });
              if (res.code === 0) {
                message.success("提交成功")
              }
              hide();
              return true;
            } catch (error) {
              hide();
              message.error('提交失败');
              return false;
            }
          }}
        >
          {/*<ProForm.Group>*/}
          <ProFormSelect
            name="language"
            label="请选择语言"
            options={[
              {label: 'JAVA', value: 'JAVA'},
              {label: 'GOLANG', value: 'GOLANG'},
              {label: 'C', value: 'C'},
              {label: 'PYTHON', value: 'PYTHON'},
            ]}
            fieldProps={{
              optionItemRender(item: any): string {
                return item.value;
              },
            }}
            placeholder="请选择语言"
            rules={[{required: true, message: '请选择语言'}]}
          />
          {/*</ProForm.Group>*/}
          {/*<ProForm.Group>*/}
          <ProFormTextArea
            colProps={{span: 24}}
            name="code"
            label="请输入答案"
          />
          {/*</ProForm.Group>*/}
        </ProForm>
      </>
    </PageContainer>
  )
    ;
};


export default QuestionInfoDesc;






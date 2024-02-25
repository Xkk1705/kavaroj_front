import {PageContainer} from '@ant-design/pro-components';
import {message, Space, Tag,} from 'antd';
import React, {useEffect, useState} from 'react';
import ProList from "@ant-design/pro-list/lib";
import {listQuestionVoByPageUsingPost} from "@/services/kaverOJ/questionController";
import moment from "moment";


/**
 * 主页接口信息
 * @constructor
 */
const Index: React.FC = () => {
  const [defaultData, setDefaultData] = useState<API.QuestionVO[]>([]);
  const [totol, setTotol] = useState<number>(0);
  const loadDate = async (current: number,
                          pageSize: number) => {
    const hide = message.loading('正在请求');
    try {
      const res: API.BaseResponsePageQuestionVO = await listQuestionVoByPageUsingPost({
        current,
        pageSize
      });
      hide();
      if (res.data) {
        setDefaultData(res.data.records ?? []) // 如果们没有数据给一个空数组
        setTotol(res?.data?.total ?? 0)
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
  useEffect((current = 1, pageSize = 10) => {
    loadDate(current, pageSize)
  }, [])

  type DataItem = (typeof defaultData)[number];

  return (
    <PageContainer>
      <ProList<DataItem>
        rowKey="id"
        headerTitle="精选question"
        dataSource={defaultData}
        showActions="hover"
        editable={{
          onSave: async (key, record, originRow) => {
            console.log(key, record, originRow);
            return true;
          },
        }}
        onDataSourceChange={setDefaultData}
        metas={{
          title: {
            dataIndex: 'title',
          },
          subTitle: {
            render: (_, row) => {
              return (
                <Space size={0}>
                  <Tag color="blue">{row?.tagList?.toString()}</Tag>
                  {/*<Tag color="#5BD8A6">{row?.judgeCaseList?.toString()}</Tag>*/}
                </Space>
              );
            }
          },
          content: {
            dataIndex: "content",
            render: (_, row) => {
              return (
                <Space size={0}>
                  <div
                    style={{
                      flex: 1,
                      display: 'flex',
                      justifyContent: 'flex-end',
                    }}
                  >
                    <div
                      style={{
                        width: 200,
                      }}
                    >
                        <div>通过率：{row.submitNum ?  row?.acceptNum/row.submitNum : 0}</div>
                    </div>
                  </div>
                </Space>
              );
            }
          },
          description: {
            render: (_, row) => {
              return (
                <Space size={0}>
                  {`创建时间` + moment(row?.createTime?.toString()).format("YYYY-MM-DD")}
                </Space>
              );
            }
          },
          actions: {
            render: (text, row) => {
              return <a key="invite" href={`/question_info/${row.id}`}>做题</a>;
            },
          },
        }
        }
        pagination={
          {
            pageSize: 10,
            total: totol,
            onChange(page, pageSize) {
              loadDate(page, pageSize);
            }
          }
        }
      />
    </PageContainer>
  );
};

export default Index;






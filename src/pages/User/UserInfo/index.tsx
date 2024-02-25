import {ActionType, PageContainer, ProColumns} from '@ant-design/pro-components';
import {Button, message} from 'antd';
import React, {useEffect, useRef, useState} from 'react';
import {useParams} from "@@/exports";
import {ProCard} from '@ant-design/pro-components';
import {getUserByIdUsingGet, updateUserUsingPost} from "@/services/kkapi/userController";
import ShowUpdateFrom from "@/pages/Admin/InterfaceInfo/components/ShowUpdateFrom";

const UserInfo: React.FC = () => {
  const [data, setData] = useState<API.User>({});
  const para = useParams() // 获取动态路由的数据id
  /**
   * @en-US The pop-up window of the distribution update window
   * @zh-CN 分布更新窗口的弹窗
   * */
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<API.InterfaceInfo>();
  const actionRef = useRef<ActionType>();
  /**
   * @en-US Update node
   * @zh-CN 更新节点
   *
   * @param fields
   */
  const handleUpdate = async (fields: API.UserVO) => {
    const hide = message.loading('Configuring');
    try {
      await updateUserUsingPost({
        id: data.id,
        ...fields
      });
      hide();
      message.success('Configuration is successful');
      actionRef.current?.reload()
      return true;
    } catch (error) {
      hide();
      message.error('Configuration failed, please try again!');
      return false;
    }
  };
  const loadDate = async () => {
    const hide = message.loading('正在请求');
    try {
      const res = await getUserByIdUsingGet({
        id: para.id as any
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

  const columns: ProColumns<API.UserVO>[] = [
    {
      title: "用户昵称",
      dataIndex: 'userName',
      valueType: 'text',
      initialValue: data.userName, // 设置默认值
    },
    {
      title: "用户简介",
      dataIndex: 'userProfile',
      valueType: 'textarea',
      initialValue: data.userProfile,
    },
    {
      title: "用户头像",
      dataIndex: 'userAvatar',
      valueType: 'text',
      initialValue: data.userAvatar
    },
  ];

  return (
    <PageContainer>
      <Button htmlType="button" key="read" onClick={() => {
        handleUpdateModalOpen(true)
      }} danger={true}>
        修改信息
      </Button>,
      <>
        <ProCard
          bordered
          headerBordered
          direction="column"
          gutter={[0, 16]}
          style={{marginBlockStart: 8}}
          size={"small"}
        >
          <ProCard title="用户昵称" type="inner" size={"small"} bordered>
            {data.userName}
          </ProCard>
          <ProCard title="用户头像" type="inner" size={"small"} bordered>
            <img src={data.userAvatar}/>
          </ProCard>
          <ProCard title="用户简介" type="inner" size={"small"} bordered>
            {data.userProfile}
          </ProCard>
        </ProCard>

        {/*修改弹窗*/}
        <ShowUpdateFrom columns={columns} onCancel={() => {
          handleUpdateModalOpen(false)
        }} onSubmit={async (value) => {
          const success = await handleUpdate(value);
          if (success) {
            handleUpdateModalOpen(false);
            setCurrentRow(undefined);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }} visible={updateModalOpen} values={currentRow || {}}/>
      </>
    </PageContainer>
  );
};


export default UserInfo;






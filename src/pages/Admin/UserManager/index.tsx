import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns, ProDescriptionsItemProps } from '@ant-design/pro-components';
import {
  FooterToolbar,
  ModalForm,
  PageContainer,
  ProDescriptions,
  ProFormText,
  ProFormTextArea,
  ProTable,
} from '@ant-design/pro-components';
import '@umijs/max';
import { Button, Drawer, Input, message } from 'antd';
import React, { useRef, useState } from 'react';
import {
  addInterfaceInfoUsingPost,
  deleteInterfaceInfoUsingPost,
  listInterfaceInfoVoByPageGetUsingGet,
  offlineInterfaceInfoUsingPost,
  onlineInterfaceInfoUsingPost,
  updateInterfaceInfoUsingPost
} from "@/services/kkapi/interfaceInfoController";
import {SortOrder} from "antd/es/table/interface";
import ShowAddFrom from "@/pages/Admin/InterfaceInfo/components/ShowAddFrom";
import ShowUpdateFrom from "@/pages/Admin/InterfaceInfo/components/ShowUpdateFrom";
import {
  deleteUserUsingPost,
  listUserByPageUsingPost,
  listUserVoByPageUsingPost,
  updateUserUsingPost
} from "@/services/kkapi/userController";
import {data} from "@umijs/bundler-webpack/compiled/autoprefixer";


const UserMnager: React.FC = () => {
  /**
   * @en-US Pop-up window of new window
   * @zh-CN 新建窗口的弹窗
   *  */
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  /**
   * @en-US The pop-up window of the distribution update window
   * @zh-CN 分布更新窗口的弹窗
   * */
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.InterfaceInfo>();
  const [selectedRowsState, setSelectedRows] = useState<API.RuleListItem[]>([]);


  /**
   * @en-US Add node
   * @zh-CN 添加节点
   * @param fields
   */
  const handleAdd = async (fields: API.InterfaceInfo) => {
    const hide = message.loading('正在添加');
    try {
      const res = await addInterfaceInfoUsingPost({...fields});
      hide();
      if (res.data) {
        message.success('Added successfully');
        actionRef.current?.reload()
      }
      return true;
    } catch (error) {
      hide();
      message.error('Adding failed, please try again!');
      return false;
    }
  };

  /**
   * @en-US Update node
   * @zh-CN 更新节点
   *
   * @param fields
   */
  const handleUpdate = async (fields: API.User) => {
    if (!currentRow) {
      return
    }
    const hide = message.loading('Configuring');
    try {
      await updateUserUsingPost({
        id: currentRow.id,
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

  /**
   *  Delete node
   * @zh-CN 删除节点
   *
   * @param selectedRows
   */
  const handleRemove = async (recored: API.User) => {
    const hide = message.loading('正在删除');
    if (!recored) return true;
    try {
      await deleteUserUsingPost(recored);
      hide();
      message.success('Deleted successfully and will refresh soon');
      actionRef.current?.reload()
      return true;
    } catch (error) {
      hide();
      message.error('Delete failed, please try again');
      return false;
    }
  };

  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */

  const columns: ProColumns<API.UserVO>[] = [
    {
      title: 'id',
      dataIndex: 'id',
      tip: '用户id',
      hideInForm: true,
    },
    {
      title: "用户账号",
      dataIndex: 'userAccount',
      valueType: 'text',
    },
    {
      title: "用户密码",
      dataIndex: 'userPassword',
      valueType: 'text',
      hideInTable: true,
      hideInForm: true,
    },
    {
      title: "用户昵称",
      dataIndex: 'userName',
      valueType: 'text',
    },
    {
      title: "用户简介",
      dataIndex: 'userProfile',
      valueType: 'textarea',
    },
    {
      title: "用户权限",
      dataIndex: 'userRole',
      valueType: 'text',
    },
    {
      title: "accessKye",
      dataIndex: 'accessKye',
      valueType: 'text',
      hideInForm: true,
    },
    {
      title: "创建时间",
      dataIndex: 'createTime',
      valueType: 'time',
      hideInForm: true,
    },
    {
      title: "操作",
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="config"
          onClick={() => {
            handleUpdateModalOpen(true);
            setCurrentRow(record);
          }}
        >
          修改
        </a>,
        <a
          key="config"
          onClick={() => {
            handleRemove(record);
          }}
        >
          删除
        </a>,
      ],
    },
  ];
  return (
    <PageContainer>
      <ProTable<API.User, API.UserQueryRequest>
        headerTitle={'查询表格'}
        actionRef={actionRef}
        rowKey="key"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
        ]}
        request={async (params: any, sort: Record<string, SortOrder>, filter: Record<string, (string | number)[] | null>) => {
          const res = await listUserByPageUsingPost({
            ...params
          })
          if (res?.data) {
            return {
              data: res?.data.records || [],
              success: true,
              total: res.data.total,
            }
          } else {
            return {
              data: [],
              success: false,
              total: 0,
            }
          }
        }}
        columns={columns}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              已选择{' '}
              <a
                style={{
                  fontWeight: 600,
                }}
              >
                {selectedRowsState.length}
              </a>{' '}
              项 &nbsp;&nbsp;
              <span>
                服务调用次数总计 {selectedRowsState.reduce((pre, item) => pre + item.callNo!, 0)} 万
              </span>
            </div>
          }
        >
          {/*<Button*/}
          {/*  onClick={async () => {*/}
          {/*    await handleRemove(selectedRowsState);*/}
          {/*    setSelectedRows([]);*/}
          {/*    actionRef.current?.reloadAndRest?.();*/}
          {/*  }}*/}
          {/*>*/}
          {/*  批量删除*/}
          {/*</Button>*/}
          {/*<Button type="primary">批量审批</Button>*/}
        </FooterToolbar>
      )}
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

      <Drawer
        width={600}
        open={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.name && (
          <ProDescriptions<API.RuleListItem>
            column={2}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.name,
            }}
            columns={columns as ProDescriptionsItemProps<API.RuleListItem>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};
export default UserMnager;

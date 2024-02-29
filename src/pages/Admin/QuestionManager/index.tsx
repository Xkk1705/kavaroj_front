import {addRule, currentUser, removeRule, rule, updateRule} from '@/services/ant-design-pro/api';
import {PlusOutlined} from '@ant-design/icons';
import type {ActionType, ProColumns, ProDescriptionsItemProps} from '@ant-design/pro-components';
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
import {Button, Drawer, Input, message} from 'antd';
import React, {useRef, useState} from 'react';
import type {FormValueType} from './components/UpdateForm';
import UpdateForm from './components/UpdateForm';
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
import {listQuestionVoByPageUsingPost} from "@/services/kaverOJ/questionController";
import {FormattedMessage} from "react-intl";


const TableList: React.FC = () => {
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
    const handleUpdate = async (fields: API.InterfaceInfo) => {
        if (!currentRow) {
            return
        }
        const hide = message.loading('Configuring');
        try {
            await updateInterfaceInfoUsingPost({
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
    const handleRemove = async (recored: API.InterfaceInfo) => {
        const hide = message.loading('正在删除');
        if (!recored) return true;
        try {
            await deleteInterfaceInfoUsingPost(recored);
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
     *  Delete node
     * @zh-CN 上线接口
     *
     * @param selectedRows
     */
    const handleOnlineInterface = async (recored: API.IdRequest) => {
        const hide = message.loading('正在上线');
        if (!recored) return true;
        try {
            await onlineInterfaceInfoUsingPost(recored);
            hide();
            message.success('online successfully and will refresh soon');
            actionRef.current?.reload()
            return true;
        } catch (error) {
            hide();
            message.error('online failed, please try again');
            return false;
        }
    };

    /**
     *  Delete node
     * @zh-CN 下线接口
     *
     * @param selectedRows
     */
    const handleOfflineInterface = async (recored: API.IdRequest) => {
        const hide = message.loading('正在上线');
        if (!recored) return true;
        try {
            await offlineInterfaceInfoUsingPost(recored);
            hide();
            message.success('Offline successfully and will refresh soon');
            actionRef.current?.reload()
            return true;
        } catch (error) {
            hide();
            message.error('Offline failed, please try again');
            return false;
        }
    };


    /**
     * @en-US International configuration
     * @zh-CN 国际化配置
     *     updateTime?: string;
     *     userId?: number;
     * */

    const columns: ProColumns<API.QuestionVO>[] = [
        {
            title: 'id',
            dataIndex: 'id',
            tip: '问题id',
            hideInForm: true,
        },
        {
            title: "题目标题",
            dataIndex: 'title',
            valueType: 'text',
        },
        {
            title: 'tagList',
            valueType: 'text',
            render: (text, record, _, action) => [
                record.tagList ? JSON.stringify(record.tagList) : ""
            ],
        },
        {
            title: "tagList",
            dataIndex: 'tagList',
            valueType: 'textarea',
        },
        {
            title: 'judgeCaseList',
            valueType: 'text',
            render: (text, record, _, action) => [
                record.judgeCaseList ? JSON.stringify(record.judgeCaseList) : ""
            ],
        },
        {
            title: 'judgeConfig',
            valueType: 'text',
            render: (text, record, _, action) => [
                record.judgeConfig ? JSON.stringify(record.judgeConfig) : ""
            ],
        },
        {
            title: "acceptNum",
            dataIndex: 'acceptNum',
            valueType: 'text',
        },
        {
            title: "submitNum",
            dataIndex: 'submitNum',
            valueType: 'text',
        },
        {
            title: "创建者",
            dataIndex: 'userId',
            valueType: 'text',
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
                </a>
            ],
        },
    ];
    return (
        <PageContainer>
            <ProTable<API.QuestionVO, API.QuestionQueryRequest>
                headerTitle={'查询表格'}
                actionRef={actionRef}
                rowKey="key"
                search={{
                    labelWidth: 120,
                }}
                toolBarRender={() => [
                    <Button
                        type="primary"
                        key="primary"
                        onClick={() => {
                            handleModalOpen(true);
                        }}
                    >
                        <PlusOutlined/> 新建
                    </Button>,
                ]}
                request={async (params: any, sort: Record<string, SortOrder>, filter: Record<string, (string | number)[] | null>) => {
                    const res = await listQuestionVoByPageUsingPost({
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
                </FooterToolbar>
            )}
            {/*新增接口弹窗*/}
            <ShowAddFrom columns={columns} onCancel={() => {
                handleModalOpen(false)
            }} onSubmit={async (value) => {
                const success = await handleAdd(value);
                if (success) {
                    handleModalOpen(false);
                }
            }} visible={createModalOpen}/>
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
export default TableList;

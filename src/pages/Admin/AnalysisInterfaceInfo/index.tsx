import {message} from 'antd';
import React, {useEffect, useState} from 'react';
import ReactECharts from 'echarts-for-react'

import {getPostVoByIdUsingGet} from "@/services/kkapi/analysisController";

const Index: React.FC = () => {
  const [data, setData] = useState<API.UserInterfaceInfoVo[]>([]);

  const loadDate = async () => {
    const hide = message.loading('正在请求');
    try {
      const res = await getPostVoByIdUsingGet({
        limit: 4,// 获取调用最多的4个接口信息
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

  // 解析并映射结果
  //  {value: 1048, name: 'Search Engine'},
  const mapDate = data.map((item => {
    return {
      name: item.interfaceInfoUrl,
      value: item.totalNum
    }
  }))
  const option = {
    title: {
      text: 'Referer of a Website',
      subtext: 'Fake Data',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: '调用次数',
        type: 'pie',
        radius: '50%',
        data: mapDate,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };

  return <ReactECharts option={option}/>;
};

export default Index;






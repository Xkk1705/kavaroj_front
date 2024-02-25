// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** getPostVOById GET /api/analysis/invoke */
export async function getPostVoByIdUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getPostVOByIdUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseListUserInterfaceInfoVo>('/api/analysis/invoke', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

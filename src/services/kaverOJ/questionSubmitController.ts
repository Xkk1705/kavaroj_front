// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** getQuestionSubmitVOById GET /api/question_submit/get/vo */
export async function getQuestionSubmitVoByIdUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getQuestionSubmitVOByIdUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseQuestionSubmitVO>('/api/question_submit/get/vo', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** listQuestionSubmitVOByPage POST /api/question_submit/list/page/vo */
export async function listQuestionSubmitVoByPageUsingPost(
  body: API.QuestionSubmitQueryRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponsePageQuestionSubmitVO>('/api/question_submit/list/page/vo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** listMyQuestionSubmitVOByPage POST /api/question_submit/my/list/page/vo */
export async function listMyQuestionSubmitVoByPageUsingPost(
  body: API.QuestionSubmitQueryRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponsePageQuestionSubmitVO>('/api/question_submit/my/list/page/vo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** addQuestionSubmit POST /api/question_submit/submit */
export async function addQuestionSubmitUsingPost(
  body: API.QuestionSubmitAddRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponselong>('/api/question_submit/submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

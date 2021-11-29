/*
 * @Author: huangjin
 * @Date: 2020-02-13 14:32:23
 * @LastEditors  : huangjin
 * @LastEditTime : 2020-02-14 12:10:19
 * @Descripttion:
 */
import request from '@/utils/request';

// 报销申请汇总列表
export async function getApplyList(params) {
  return request('/api/manager/branchmgr/reimbursement/cashier/applyList', {
    method: 'POST',
    body: params,
  });
}

//标记为已打款
export async function updateRemittance(params) {
  return request('/api/manager/branchmgr/reimbursement/cashier/updateRemittance', {
    method: 'POST',
    body: params,
  });
}

// 标记打款总笔数 金额
export async function beforeUpdateRemittance(params) {
  return request('/api/manager/branchmgr/reimbursement/cashier/beforeUpdateRemittance', {
    method: 'POST',
    body: params,
  });
}


// 标记打款总笔数 金额


//标记为已打款

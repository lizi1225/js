/*
 * @Author: laiqiangqiang
 * @Date: 2019-09-25 14:18:27
 * @LastEditors: huangjin
 * @LastEditTime: 2020-04-10 10:12:01
 * @Description: 合并解决冲突
 */
import { parseFormItem } from '@/utils/formItemUtils';

export const formItemLayout = {
    labelCol: { span: 0 },
    wrapperCol: { span: 24 },
};

const map = {
    ReimbursementType: {
        ...parseFormItem({ fieldName: 'reimbursementType', label: '', component: 'Select' }),
        defaultValue: [{ name: '租金水电费用报销 ', value: 0 }, { name: '交通费', value: 1 }, { name: '差旅费', value: 2 }],
        TagInfo: {
            style: { width: '100%' },
            placeholder: '请选择报销类型',
            allowClear: true,
        },
        formItemLayout,
    },
    SearchTimeType: {
        ...parseFormItem({ fieldName: 'searchTimeType', label: '', component: 'Select' }),
        defaultValue: [{ name: '最迟付款时间', value: 0 }, { name: '提交时间', value: 1 }],
        TagInfo: {
            style: { width: '100%' },
        },
        formItemLayout,
    },
    Time: {
        ...parseFormItem({ fieldName: 'time', label: '', component: 'RangePicker', placeholder: ['开始时间', '结束时间'] }),
        TagInfo: {
            style: { width: '100%' },
        },
        formItemLayout,
    },

    SearchKey: {
        ...parseFormItem({ fieldName: 'searchKey', label: '', component: 'Input' }),
        TagInfo: {
            placeholder: '请输入报销部门或报销单号(模糊查询)',
            style: { width: '100%' },
        },
        formItemLayout,
    },
  Remittance: {
    ...parseFormItem({ fieldName: 'remitStatus', label: '', component: 'Select' }),
    defaultValue: [{ name: '未处理', value: 0 }, { name: '已付款', value: 1 }],
    TagInfo: {
      placeholder: '请选择打款状态',
      style: { width: '100%' },
      allowClear: true,
    },
    formItemLayout,
  },
};

export default map;

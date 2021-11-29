import { Model } from '@/interface/model';
import { publicReducers, publicState } from '@/utils/TableModels';
import { TableModelsGlobal } from '@/interface/global';
import { getApplyList, updateRemittance, beforeUpdateRemittance } from './services';
import { getReApplyDetail } from '@/pages/Process/services/bpmProcess';
import _ from 'lodash';
export interface CashierClaimListProps extends TableModelsGlobal {
  officeNum: number;
  totalAmount: number;
  count: number;
  detail: object;
  sumRemittance: Payload;
}
interface Payload {
  [propName: string]: any;
}

export const cashierClaimListAction = (type: string): any => (payload: Payload) => ({ type: `cashierClaimList/${type}`, payload });

const cashierClaimList: Model<CashierClaimListProps> = {
  namespace: 'cashierClaimList',
  state: {
    ...publicState,
    list: [],
    officeNum: 0,
    totalAmount: 0,
    count: 0,
    detail: {},
    sumRemittance: {},
  },
  effects: {
    *fetchList({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const res = yield call(getApplyList, payload);
      yield put({
        type: 'changeError',
        payload: res,
      });
      if (res.code == 200) {
        yield put({
          type: 'changeStateValues',
          payload: {
            list: _.get(res, 'data.pageList.list', []),
            officeNum: _.get(res, 'data.officeNum', 0),
            totalAmount: _.get(res, 'data.totalAmount', 0),
            count: _.get(res, 'data.applyNum', 0),
          },
        });
        yield put({
          type: 'changePagination',
          payload: { total: _.get(res, 'data.pageList.allRows', 0) },
        });
      }
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *updateRemittance({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const res = yield call(updateRemittance, payload);
      yield put({
        type: 'changeError',
        payload: res,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *fetchProcessDetail({ payload }, { call, put }) {
      const res = yield call(getReApplyDetail, payload);
      yield put({
        type: 'changeError',
        payload: res,
      });
      yield put({
        type: 'changeStateValues',
        payload: {
          detail: res.data || {},
        },
      });
    },
    *fetchBeforeUpdateRemittance({ payload }, { call, put }) {
      const res = yield call(beforeUpdateRemittance, payload);
      yield put({
        type: 'changeError',
        payload: res,
      });
      yield put({
        type: 'changeStateValues',
        payload: {
          sumRemittance: res.data || {},
        },
      });
    },
  },
  reducers: {
    ...publicReducers,
  },
};

export default cashierClaimList;

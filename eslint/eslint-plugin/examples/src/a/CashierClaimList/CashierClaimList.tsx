import * as React from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button, Card, message, Row, Col, Modal } from 'antd';
import { connect } from 'umi';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { FormItemGeneral, formItemFun } from '@/components/FormItemGeneral/FormItemGeneral';
import CommonListPage, { Agencys, AgencyComponent, AgencyKeys } from '@/components/CommonListPage/CommonListPage';
import CreateDomDelegationer from '@/utils/delegationer/createDomDelegationer';
import { parseMoney2D } from '@/utils/utils';
import { FormComponentProps } from '@ant-design/compatible/lib/form/Form';
import { DefaultProps } from '@/interface/global';
import TableList from './CashierClaimListTable';
import DetailModal from '../DetailModal';
import { cashierClaimListAction, CashierClaimListProps } from './model';
import map from './map';
import styles from '../ExpeseClaimList.less';
import JumpByModal from '@/components/Jump/JumpByModal'
const { FORM } = Agencys;

interface Props extends DefaultProps, FormComponentProps {
  collapsed: number;
  delegationer: CreateDomDelegationer<AgencyComponent, AgencyKeys>;
  officeTree: any[];
  authorityMap: any;
  cashierClaimList: CashierClaimListProps;
}

interface State {
  selectedRowKeys: any[];
  detailVisible: boolean;
  serialNo: string;
  applyNo: string;
}

class CashierClaimList extends React.PureComponent<Props, State> {
  static URL = '/download/download/branchmgr/reimbursement/cashier/applyList/export';
  static EXPORT_URL = '/api/download/branchmgr/reimbursement/cashier/applyList/export';
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      detailVisible: false,
      serialNo: '',
      applyNo: '',
    };

    formItemFun(this.props.form, map);
  }
  componentDidMount() {
    this.getList();
  }
  // 请求列表
  public getList(data?: object) {
    this.props.dispatch(cashierClaimListAction('fetchList')(data)).then(() => {
      const {
        cashierClaimList: { errorHtml },
      } = this.props;
      if (errorHtml.flag) {
        message.error(errorHtml.msg || '请求失败');
      }
    });
  }
  // 处理数据
  public handelFormData(payload) {
    const {
      dispatch,
      cashierClaimList: { pagination, formValues },
    } = this.props;
    const startTime = payload.time && payload.time[0] && new Date(payload.time[0]).setHours(0, 0, 0, 0).valueOf();
    const endTime = payload.time && payload.time[1] && new Date(payload.time[1]).setHours(23, 59, 59).valueOf();
    const values = {
      currentPage: pagination.current,
      pageRows: pagination.pageSize,
      ...payload,
      startTime,
      endTime,
    };
    dispatch(cashierClaimListAction('changeFormValues')({ ...formValues, ...values }));
    return { ...formValues, ...values };
  }

  // 重置
  public handleFormReset = (): void => {
    const {
      form,
      cashierClaimList: { pagination },
      delegationer,
    } = this.props;
    const newPages = {
      currentPage: 1,
      pageRows: pagination.pageSize,
    };
    form.resetFields();
    this.changeState({ selectedRowKeys: [] });
    delegationer.getProp(FORM, 'handleSearch')({ ...form.getFieldsValue(), ...newPages });
  };
  public onSubmit = payload => {
    const {
      cashierClaimList: { formValues },
    } = this.props;
    const formatFormData = this.handelFormData({ ...formValues, ...payload });
    delete formatFormData.time;
    this.getList(formatFormData);
  };
  // 修改state
  public changeState = (val: any) => {
    this.setState(() => {
      return {
        ...val,
      };
    });
  };

  //导出
  public getExportRequest = () => {
    const {
      cashierClaimList: { formValues },
    } = this.props;
    const values = { ...formValues };
    delete values.currentPage;
    delete values.pageRows;
    delete values.times;
    return {
      url: CashierClaimList.EXPORT_URL,
      params: values,
    }
  };

  private getExportOneRequest = (id: string) => {
    return function () {
      return {
        url: CashierClaimList.EXPORT_URL,
        params: { id }
      }
    }
  };

  //标记为已打款
  private updateRemittance = (ids: string[]) => {
    const that = this;
    const { dispatch, delegationer } = this.props;
    dispatch(cashierClaimListAction('fetchBeforeUpdateRemittance')({ ids })).then(() => {
      const {
        cashierClaimList: { sumRemittance },
      } = that.props;
      Modal.confirm({
        title: `本次标记付款的总笔数为${sumRemittance.rentalApplyNum || 0}笔，金额为${sumRemittance.rentalApplyAmount || 0}元。是否继续？`,
        onOk() {
          dispatch(cashierClaimListAction('updateRemittance')({ ids })).then(() => {
            const {
              cashierClaimList: { errorHtml },
            } = that.props;

            errorHtml.flag ? message.error(errorHtml.msg) : message.success('标记为已付款成功');
            that.changeState({ selectedRowKeys: [] });
            delegationer.getProp(FORM, 'handleSearch')();
          });
        },
      });
    });
  };

  //批量标记为已打款
  private updateBatchRemittance = () => {
    if (this.state.selectedRowKeys.length === 0) {
      message.warning('请先至少选择一项');
    } else {
      this.updateRemittance(this.state.selectedRowKeys);
    }
  };

  public render() {
    const {
      delegationer,
      authorityMap,
      cashierClaimList: { list = [], pagination, count, officeNum, totalAmount, formValues, tableLoading },
    } = this.props;

    const { selectedRowKeys, detailVisible, serialNo, applyNo } = this.state;
    const DeleGationerForm = delegationer.getPropElement('delegationerForm');
    const { ReimbursementType, SearchTimeType, Time, SearchKey,Remittance } = FormItemGeneral;
    const totalList = [
      {
        label: '申请数量',
        value: `${count}个申请`,
      },
      {
        label: '部门数量',
        value: `${officeNum}个`,
      },
      {
        label: '报销金额（元）',
        value: `${parseMoney2D(totalAmount)}`,
      },
    ];
    // 权限
    const remittanceAuth = authorityMap['branchmgr:cashier:updateRemittance'];
    return (
      <PageHeaderWrapper title="报销申请列表（出纳）">
        <Card className={styles.totalWrap}>
          <Row>
            {totalList.map((item, index) => (
              <Col span={8} key={index} className={styles.totalCol}>
                <Col span={24} className={styles.leftBlock} style={totalList.length == index + 1 ? { borderRight: 'none' } : {}}>
                  <div className={styles.grey}>{item.label}</div>
                  <div className={styles.number}>{item.value}</div>
                </Col>
              </Col>
            ))}
          </Row>
        </Card>
        <CommonListPage>
          <DeleGationerForm beforeSubmit={() => true} onSubmit={this.onSubmit} invert={true}>
            <Form className={styles.transaForm}>
              <Card bodyStyle={{ padding: '20px 24px 0px' }}>
                <Row gutter={{ md: 1, lg: 4, xl: 9 }}>
                  <Col md={3} sm={24}>
                    <ReimbursementType />
                  </Col>
                  <Col md={3} sm={24}>
                    <SearchTimeType initValue={0} />
                  </Col>
                  <Col md={4} sm={24}>
                    <Time />
                  </Col>
                  <Col md={4} sm={24}>
                    <SearchKey />
                  </Col>
                  <Col md={4} sm={24}>
                    <Remittance />
                  </Col>
                  <Col md={10} sm={24}>
                    <Button type="primary" htmlType="submit" style={{ marginTop: '6px', marginRight: '5px' }}>
                      查询
                    </Button>
                    {remittanceAuth ? (
                      <Button type="primary" style={{ marginRight: '6px' }} onClick={this.updateBatchRemittance}>
                        标记为已付款
                      </Button>
                    ) : null}
                    <Button onClick={this.handleFormReset}>重置</Button>
                    <JumpByModal getRequest={this.getExportRequest} buttonProps={{ style: { marginLeft: '6px' } }}/>
                  </Col>
                </Row>
              </Card>
            </Form>
          </DeleGationerForm>
          <Card className={styles.tableList}>
            <TableList
              delegationer={delegationer}
              list={list}
              pagination={pagination}
              formValues={formValues}
              selectedRowKeys={selectedRowKeys}
              loading={tableLoading}
              authorityMap={authorityMap}
              changeState={this.changeState}
              updateRemittance={this.updateRemittance}
              getExportOneRequest={this.getExportOneRequest}
              remittanceAuth={remittanceAuth}
            />
          </Card>
        </CommonListPage>

        {/* 查看审核流程 */}
        {detailVisible ? <DetailModal changeState={this.changeState} detailVisible={detailVisible} serialNo={serialNo} applyNo={applyNo} /> : null}
      </PageHeaderWrapper>
    );
  }
}

export default connect(state => ({
  cashierClaimList: state.cashierClaimList,
  collapsed: state.global.collapsed,
  officeTree: state.global.officeTree,
  authorityMap: state.global.authorityMap,
}))(CommonListPage.create()(CashierClaimList));

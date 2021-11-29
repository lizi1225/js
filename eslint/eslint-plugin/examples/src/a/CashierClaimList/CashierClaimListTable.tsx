import * as React from 'react';
import { ColumnProps } from 'antd/lib/table/interface';
import { DefaultProps, TableModelsGlobal } from '@/interface/global';
import { DownOutlined } from '@ant-design/icons';
import { Table, Dropdown, Button, Menu, Badge } from 'antd';
import { formatTime, parseMoney2D } from '@/utils/utils';
import CreateDomDelegationer from '@/utils/delegationer/createDomDelegationer';
import { AgencyComponent, AgencyKeys } from '@/components/CommonListPage/CommonListPage';
import styles from '../ExpeseClaimList.less';
import { baseConstList } from '@/utils/constList/baseConstList';
import JumpByModal from '@/components/Jump/JumpByModal'

interface IProps extends DefaultProps, TableModelsGlobal {
  changeState(arg: object): void;
  updateRemittance(ids: string[]): void;
  getExportOneRequest(id: string): any;
  delegationer: CreateDomDelegationer<AgencyComponent, AgencyKeys>;
  loading: boolean;
  updateList: any;
  authorityMap: any;
  selectedRowKeys: number[];
  remittanceAuth: boolean;
}

const ExpenseClaimListTable: React.SFC<IProps> = ({
  loading,
  pagination,
  delegationer,
  list,
  changeState,
  updateRemittance,
  getExportOneRequest,
  formValues,
  
  selectedRowKeys,
  remittanceAuth,
}) => {
  const paginationProps = {
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: () => `共${pagination.total}条数据`,
    ...pagination,
    ...formValues,
  };
  // checkbox
  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: any[] ) => {
      // 保存已选
      changeState({ selectedRowKeys: keys });
    },
  };

  // 查看
  const openDetailModal = (item): void => {
    changeState({ detailVisible: true, serialNo: item.serialNo, applyNo: item.applyNo });
  };

  const updateOneRemittance = (item): void => {
    updateRemittance([item.id]);
  };
  const menuRender = (value, item) => {
    /* 权限*/

    return (
      <Menu>
        <Menu.Item key="0" className={styles.menuItems}>
          <JumpByModal getRequest={getExportOneRequest(item.id)} buttonProps={{ type: 'text' }}/>
        </Menu.Item>
        <Menu.Item key="2" className={styles.menuItems}>
          <div onClick={() => openDetailModal(item)}>查看审核流程</div>
        </Menu.Item>
        {item.remitStatus != 1 && remittanceAuth ? (
          <Menu.Item key="1" className={styles.menuItems}>
            <div onClick={() => updateOneRemittance(item)}>标记为已付款</div>
          </Menu.Item>
        ) : null}
      </Menu>
    );
  };
  const { expenseTypeArr, remitStatusList } = baseConstList;
  const columns: Array<ColumnProps<any>> = [
    {
      title: <div className={styles.tableTeCenter} />,
      dataIndex: 'applyNo',
      width: 120,
      render: (val ) => (
        <div>
          <span className="grey">报销单号:</span>
          <br />
          <span>{val || '--'}</span>
        </div>
      ),
    },
    {
      title: <div className={styles.tableTeCenter} />,
      dataIndex: 'payee',
      width: 120,
      render: (val ) => (
        <div className="grey">
          <span>收款方:</span>
          <br />
          <span>{val || '--'}</span>
        </div>
      ),
    },
    {
      title: <div className={styles.tableTeCenter} />,
      dataIndex: 'reimbursementType',
      width: 120,
      render: (val ) => (
        <div className="grey">
          <span>报销类型:</span>
          <br />
          <span>{expenseTypeArr[val] || '--'}</span>
        </div>
      ),
    },
    {
      title: <div className={styles.tableTeCenter} />,
      dataIndex: 'officeName',
      width: 120,
      render: (val ) => (
        <div className="grey">
          <span>报销部门:</span>
          <br />
          <span>{val || '--'}</span>
        </div>
      ),
    },
    {
      title: <div className={styles.tableTeCenter} />,
      dataIndex: 'createTime',
      width: 120,
      render: (val ) => (
        <div className="grey">
          <span>提交时间:</span>
          <br />
          <span>{val ? formatTime(val, 'Y-MM-dd hh:mm') : '--'}</span>
        </div>
      ),
    },
    {
      title: <div className={styles.tableTeCenter} />,
      dataIndex: 'lastRemitTime',
      width: 120,
      render: (val ) => (
        <div className="grey">
          <span>最迟付款时间:</span>
          <br />
          <span>{val ? formatTime(val, 'Y-MM-dd hh:mm') : '--'}</span>
        </div>
      ),
    },
    {
      title: <div className={styles.tableTeCenter} />,
      dataIndex: 'amount',
      width: 120,
      render: (val ) => (
        <div>
          <span className="grey">报销金额(元):</span>
          <br />
          <span style={{ color: '#eb4d55' }}>{parseMoney2D(val) || '--'}</span>
        </div>
      ),
    },
    {
      title: <div className={styles.tableTeCenter} />,
      dataIndex: 'remitStatus',
      width: 120,
      render: (val ) => (
        <div>
          {remitStatusList.map(
            (value, index): any => {
              if (index == val) {
                return <Badge color={value.color} text={value.name} key={index} />;
              }
            }
          )}
        </div>
      ),
    },
    {
      title: <div className={styles.tableTeCenter}>操作</div>,
      dataIndex: 'operate',
      render: (val, item) => (
        <div className={styles.tableCenter}>
          <Dropdown overlay={menuRender(val, item)} className={styles.tableCenter}>
            <Button size="small" className={styles.font12}>
              操作
              <DownOutlined />
            </Button>
          </Dropdown>
        </div>
      ),
      width: 100,
      className: styles.tableCell,
    },
  ];
  const DelegationerTable = delegationer.getPropElement('delegationerTable');
  const scrollX = columns.reduce((acc, item) => acc + (item.width && typeof item.width == 'number' ? item.width : 100), 0);
  return (
    <DelegationerTable pageController={paginationProps}>
      <Table
        size="small"
        scroll={{ x: scrollX }}
        className={styles.standardTable}
        rowKey={(record, index) => record.id || index}
        dataSource={list}
        columns={columns}
        loading={loading}
        rowSelection={rowSelection}
      />
    </DelegationerTable>
  );
};

export default ExpenseClaimListTable;

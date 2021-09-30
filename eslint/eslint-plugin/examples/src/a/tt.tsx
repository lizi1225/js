import { Form } from '@ant-design/compatible';
import {   Tabs } from 'antd';
import { FormComponentProps } from 'antd/lib/form/Form';
import * as React from 'react';
import { connect } from 'umi';

import { formItemFun } from '@/components/FormItemGeneral/FormItemGeneral';
// components
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { DefaultProps } from '@/interface/global';

import map from './maps';
import PosterStat from './PosterStat/PosterStat';
import ShortStat from './ShortStat/ShortStat';
import { checkboxButton } from './utils';

const { TabPane } = Tabs;
interface IProps extends DefaultProps, FormComponentProps {}
class ReceiveStatListTab extends React.PureComponent<IProps> {
  constructor(props) {
    super(props);
    formItemFun(this.props.form, map);
  }
  render() {
    const { form } = this.props;
    return (
      <PageHeaderWrapper title={'获客海报统计'}>
        <Tabs defaultActiveKey="1" style={{ background: '#fff' }}>
          <TabPane tab={'海报统计'} key="1">
            <PosterStat form={form} checkboxButton={checkboxButton} />
          </TabPane>
          <TabPane tab={'短视频统计'} key="2">
            <ShortStat form={form} checkboxButton={checkboxButton} />
          </TabPane>
        </Tabs>
      </PageHeaderWrapper>
    );
  }
}
export default connect((state) => ({
  authorityMap: state.global.authorityMap,
}))(Form.create()(ReceiveStatListTab));
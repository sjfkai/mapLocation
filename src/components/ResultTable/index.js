import React, { Component } from 'react'
import { Table } from 'antd'
import PropTypes from 'prop-types'


class ResultTable extends Component {
  static propTypes = {
    results: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired
  }
  render() {
    const dataSource = this.props.results.map((row, index) => ({
      ...row,
      key: index,
      code: row.transformedCode || row.code,
      coords: row.transformedCoords || row.coords,
    }))
    return (
      <Table 
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        loading={this.props.loading}
      />
    )
  }
}
const columns = [{
  title: '地址',
  dataIndex: 'location',
  key: 'location',
}, {
  title: '经度',
  dataIndex: 'code.lng',
}, {
  title: '纬度',
  dataIndex: 'code.lat',
},{
  title: '是否精确',
  dataIndex: 'precise',
},{
  title: '可信度',
  dataIndex: 'confidence',
},{
  title: '地址类型',
  dataIndex: 'level',
},{
  title: '坐标系',
  dataIndex: 'coords',
},{
  title: '错误',
  dataIndex: 'message',
}]

export default ResultTable

import React, { Component } from 'react'
import { Table } from 'antd'
import PropTypes from 'prop-types'


class ResultTable extends Component {
  static propTypes = {
    results: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired,
    handleDelete: PropTypes.func.isRequired,
  }
  getColumns = () => {
    return [{
      title: '序号',
      dataIndex: 'no',
      key: 'no',
    }, {
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
    },{
      title: '操作',
      dataIndex: 'key',
      render: this.renderDelete,
    }]
  }

  handleDelete = (index) => (e) => {
    e.preventDefault()
    this.props.handleDelete(index)
  }

  renderDelete = (key) => {
    return (
      <a onClick={this.handleDelete(key)} className="delete-icon" >删除</a>
    )
  }
  render() {
    const dataSource = this.props.results.map((row, index) => ({
      ...row,
      index,
      no: index + 1,
      code: row.transformedCode || row.code,
      coords: row.transformedCoords || row.coords,
    }))
    return (
      <Table 
        columns={this.getColumns()}
        dataSource={dataSource}
        pagination={false}
        loading={this.props.loading}
      />
    )
  }
}

export default ResultTable

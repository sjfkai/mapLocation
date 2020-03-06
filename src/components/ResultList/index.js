import React, { Component } from 'react'
import { List } from 'antd'
import PropTypes from 'prop-types'


class ResultList extends Component {
  static propTypes = {
    results: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired
  }
  render() {
    const dataSource = this.props.results.map((row, index) => {
      return Object.assign({}, row, {key:index})
    })
    return (
      <List
        size="large"
        header={<div>结果：</div>}
        bordered
        dataSource={dataSource}
        renderItem={item => (
          <List.Item>
            <List.Item.Meta
              description={
                <div>
                  地址: {item.location} <br />
                  经度: {item.code ? item.code.lng : ''} <br />
                  纬度: {item.code ? item.code.lat : ''} <br />
                  是否精确: {item.precise} <br />
                  可信度: {item.confidence} <br />
                  地址类型: {item.level} <br />
                  错误: {item.message} <br />
                </div>
              }
            />
          </List.Item>
        )}
      />
    )
  }
}

export default ResultList

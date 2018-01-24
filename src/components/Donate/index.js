import React, { Component } from 'react'
import {Row, Col, Button, Popover} from 'antd'
import './index.css'


class Donate extends Component {
  render() {
    return (
      <div className="donate">
        <Popover content={content} title="感谢您的支持！ Thanks for your support!" placement="topRight">
          <Button type="danger" icon="red-envelope" ghost>捐赠 Donate</Button>
        </Popover>
      </div>
    )
  }
}

const content = (
  <div className="donate-content">
    <Row>
      <Col span={12}>
        <p> <img src="/image/paypal.png"/> </p>
        <p> <a href="https://www.paypal.me/sjfkai" target="_blank"  rel="noopener noreferrer">Pay for me</a> </p>
      </Col>
      <Col span={12}>
        <img src="/image/code.jpg"/>
      </Col>
    </Row>
  </div>
);

export default Donate

import React, { Component } from 'react'
import {Popover} from 'antd'
import './index.css'


class Donate extends Component {
  componentDidMount() {
    (['/image/code.jpg', '/image/alipay.jpeg']).map(url => {
      const img = new Image()
      img.src = url
      return img
    })
  }
  render() {
    return (
      <div className="donate">
        <Popover content={content} title="参与公益！献一份爱心！" placement="topRight">
        {/* <div className="button"><Icon type="red-envelope" /> 打赏 <Icon type="red-envelope" /> </div> */}
          <div className="button2 button2-animate"></div>
        </Popover>
      </div>
    )
  }
}

const content = (
  <div className="donate-content">
    <div className="qrcodes">
      <div className="item">
        <img className="image" src="/image/gongyi3.png" alt="wechat QRCode" />
        <p className="desc" > 打开微信[扫一扫] </p>
      </div>
      {/* <div className="item">
        <img className="image" src="/image/alipay.jpeg" alt="alipay QRCode" />
        <p className="desc" > 打开支付宝[扫一扫] </p>
      </div> */}
    </div>
    <br />
    <div className="text">本站完全免费，如果本站为你节约了时间</div>
    <div className="text">可否请您
    <a href="https://support.qq.com/products/65049/blog/547026" target="_blank"  rel="noopener noreferrer">献出一份的爱心</a>
    。非常感谢！</div>
  </div>
);

export default Donate

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
        <Popover content={content} title="感谢您的支持！ Thanks for your support!" placement="topRight">
        {/* <div className="button"><Icon type="red-envelope" /> 打赏 <Icon type="red-envelope" /> </div> */}
          <div className="button2 button2-animate">赏</div>
        </Popover>
      </div>
    )
  }
}

const content = (
  <div className="donate-content">
    <div className="qrcodes">
      <div className="item">
        <img className="image" src="/image/code.jpg" alt="wechat QRCode" />
        <p className="desc" > 打开微信[扫一扫] </p>
      </div>
      <div className="item">
        <img className="image" src="/image/alipay.jpeg" alt="alipay QRCode" />
        <p className="desc" > 打开支付宝[扫一扫] </p>
      </div>
    </div>
    <br />
    <div>本站完全免费，如果本站为你节约了时间，可否请我喝杯咖啡<span role="img" aria-label="Coffe">☕️</span>。非常感谢！</div>
  </div>
);

export default Donate

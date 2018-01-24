import React, { Component } from 'react'
import  { Layout, Row, Col, Button, message, Icon } from 'antd'
import LocationInput from './components/LocationInput'
import ResultTable from './components/ResultTable'
import Donate from './components/Donate'
import './App.css'
import {getCode} from './utils/geocoder'
import {downloadExcel} from './utils/download'

const { Header, Content, Footer } = Layout

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      results: [],
      loading: false,
    }
  }

  handleSubmit = (o) => {
    this.setState({
      loading: true,
    })
    getCode(o.platform, o.locations).then((results) => {
      this.setState({
        results: [...this.state.results, ...results],
        loading: false,
      })
    })
  }

  clearResult = () => {
    this.setState({
      results: [],
    })
  }

  download = () => {
    if (this.state.results.length === 0) {
      message.error('没有可导出的内容')
      return
    }
    const data = [['地址', '经度', '纬度',	'是否精确',	'可信度',	'地址类型',	'错误']]
    for (const row of this.state.results) {
      data.push(
        [
          row.location || '',
          row.code.lng || '',
          row.code.lat || '',
          row.precise || '',
          row.confidence || '',
          row.level || '',
          row.message || '',
        ]
      )
    }
    downloadExcel(data)
  }

  render() {
    return (
      <div>
        <Layout>
          <Header className="header">
            <h1>Map Location</h1> <h3>批量转换地址为经纬度</h3>
          </Header>
          <Content className="content">
            <LocationInput onSubmit={this.handleSubmit}/>
            <div className="result">
              <Row>
                <Col className="result-text" span={6}>结果:</Col>
                <Col offset={12} span={6} style= {{ textAlign: 'right' }}>
                  <Button className="table-btn" onClick={this.download} icon="download"> 下载 </Button>
                  <Button className="table-btn" onClick={this.clearResult} icon="delete"> 清空 </Button>
                </Col>
              </Row>
              <div className="table">
                <ResultTable results={this.state.results} loading={this.state.loading}/>
              </div>
            </div>
          </Content>
          <Footer className="footer">
            <p>Developed by sjfkai@163.com</p>
            <p>基于：<a href="https://developers.google.com/maps/documentation/geocoding/start?hl=zh-cn" target="_blank"  rel="noopener noreferrer">Google</a> 和 <a href="http://lbsyun.baidu.com/index.php?title=webapi/guide/webservice-geocoding" target="_blank"  rel="noopener noreferrer">Baidu</a> Geocoder API
            </p>
            <p><a href="https://github.com/sjfkai/mapLocation" target="_blank"  rel="noopener noreferrer"><Icon type="github" /> Source Code </a></p>

            <script type="text/javascript">var cnzz_protocol = (("https:" == document.location.protocol) ? " https://" : " http://");document.write(unescape("%3Cspan id='cnzz_stat_icon_1255259651'%3E%3C/span%3E%3Cscript src='" + cnzz_protocol + "s4.cnzz.com/z_stat.php%3Fid%3D1255259651%26show%3Dpic' type='text/javascript'%3E%3C/script%3E"));</script>
          </Footer>
        </Layout>
        <Donate></Donate>
      </div>
    )
  }
}

export default App

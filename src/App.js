import React, { Component } from 'react'
import  { Layout, Row, Col, Button, message, Icon, notification } from 'antd'
import LocationInput from './components/LocationInput'
import ResultTable from './components/ResultTable'
import ResultList from './components/ResultList'
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
      isDesktop: false,
    }
  }

  componentDidMount() {
    this.updatePredicate();
    window.addEventListener("resize", this.updatePredicate);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updatePredicate);
  }

  updatePredicate = () => {
    this.setState({ isDesktop: window.innerWidth >= 768 });
  }

  handleSubmit = (o) => {
    this.setState({
      loading: true,
    })
    getCode(o.platform, o.locations, (code) => {
      this.setState({
        results: [...this.state.results, code],
      })
    }).then((results) => {
      this.setState({
        loading: false,
      })
    }).catch((error) => {
      if (error.message === 'OVER_QUERY_LIMIT') {
        // 求捐赠
        notification.error({
          duration: 0,
          message: 'Google 服务每日限额已耗尽',
          description: 'Google 服务每日免费额度较少，且资费较贵。作者个人无法无限度支撑，会根据捐赠情况适当开放限额。如果本站帮助了您，期待得到您的支持。不胜感激！'
        })
      } else {
        message.error(error.message)
      }
      this.setState({
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
    for (let i = 0; i < this.state.results.length; i++) {
      const row = this.state.results[i];
      data.push(
        [
          row.location || '',
          (row.code && row.code.lng) || '',
          (row.code && row.code.lat) || '',
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
            <Row  type="flex" align="bottom" >
              <Col><h1>Map Location</h1></Col>
              <Col><h3>批量转换地址为经纬度</h3></Col>
            </Row>
          </Header>
          <Content className="content">
            <LocationInput onSubmit={this.handleSubmit} loading={this.state.loading}/>
            {
              this.state.isDesktop ? (
                <div className="result">
                  <Row type="flex" justify="space-between" >
                    <Col className="result-text">结果:</Col>
                    <Col>
                      <Button className="table-btn" onClick={this.download} icon="download"> 下载 </Button>
                      <Button className="table-btn" onClick={this.clearResult} icon="delete"> 清空 </Button>
                    </Col>
                  </Row>
                  <div className="table">
                    <ResultTable results={this.state.results} loading={this.state.loading}/>
                  </div>
                  <Donate></Donate>
                </div>
              ) : (
                <div>
                  <div className="small-result-btns">
                    <Button className="table-btn" onClick={this.download} icon="download"> 下载 </Button>
                    <Button className="table-btn" onClick={this.clearResult} icon="delete"> 清空 </Button>
                  </div>
                  <ResultList results={this.state.results} loading={this.state.loading}/>
                </div>
              )
            }
          </Content>
          <Footer className="footer">
            <p>Based on <a href="https://developers.google.com/maps/documentation/geocoding/start?hl=zh-cn" target="_blank"  rel="noopener noreferrer" style={{'font-weight':'bold'}}>Google</a> and <a href="https://lbsyun.baidu.com/index.php?title=webapi/guide/webservice-geocoding" target="_blank"  rel="noopener noreferrer" style={{'font-weight':'bold'}} >Baidu</a> Geocoder API</p>
            <p>Developed by <a href="mailto:sjfkai@163.com" target="_top" style={{'font-weight':'bold'}}>sjfkai@163.com</a></p>
            <p>Hosted by <a href="https://pages.coding.me" style={{'font-weight':'bold'}}>Coding Pages</a></p>
            <p><a style={{'font-weight':'bold'}} href="https://github.com/sjfkai/mapLocation" target="_blank"  rel="noopener noreferrer"><Icon type="github"/> Source Code </a></p>
          </Footer>
        </Layout>
      </div>
    )
  }
}

export default App

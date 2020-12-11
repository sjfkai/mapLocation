import React, { Component } from 'react'
import  { Layout, Row, Col, Button, message, Icon, notification, Select, Popover } from 'antd'
import LocationInput from './components/LocationInput'
import ResultTable from './components/ResultTable'
import ResultList from './components/ResultList'
import Donate from './components/Donate'
import TuCao from './components/TuCao'
import './App.css'
import {getCode} from './utils/geocoder'
import {downloadExcel} from './utils/download'
import { transformCoords, uniqueId } from './utils'


const { Header, Content, Footer } = Layout
const { Option } = Select

const coordsTipContent = (
  <div>
    <p>转换算法来自网络，如有问题请反馈</p>
    <ul>
      <li>WGS-84：是国际标准，GPS坐标（Google Earth使用、或者GPS模块）</li>

      <li>GCJ-02：中国坐标偏移标准，Google（国内）、高德、腾讯使用</li>

      <li>BD-09：百度坐标偏移标准，百度地图使用</li>
    </ul>
  </div>
)

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      results: [],
      loading: false,
      coordsValue: 'default',
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
      results: this.state.results.map((row) => ({
        ...row,
        transformedCoords: null,
        transformedCode: null,
      })),
      coordsValue: 'default',
    })
    getCode(o.platform, o.locations, o.apiKey, (code) => {
      code.key = uniqueId()
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
          description: 'Google 服务每日免费额度较少，且资费较贵。作者个人无法无限度支撑，会根据捐赠情况适当开放限额。您可以使用自己的API_KEY。如果本站帮助了您，期待得到您的支持。不胜感激！'
        })
      } else {
        if (error.message === 'Timeout') {
          message.error('请求超时！可能是今日配额已用尽，请明天再次尝试')
        } else {
          message.error(error.message)
        }
        if (window.Sentry) {
          window.Sentry.captureException(error)
        }
      }
      this.setState({
        loading: false,
      })
    })
  }
  onCoordsChange = (coords) => {
    this.setState((state) => {
      const results = state.results.map(row => {
        if (coords === 'default' || !row.code) {
          return {
            ...row,
            transformedCoords: null,
            transformedCode: null,
          }
        }
        // 转换方法
        const transformedCode = transformCoords(row.coords, coords, row.code)
        return {
          ...row,
          transformedCoords: coords,
          transformedCode,
        }
      })
      return {
        coordsValue: coords,
        results,
      }
    });
  }

  clearResult = () => {
    this.setState({
      results: [],
    })
  }

  handleDelete = (key) => {
    this.setState((state) => ({
      results: state.results.filter(code => code.key !== key),
    }))
  }

  download = () => {
    if (this.state.results.length === 0) {
      message.error('没有可导出的内容')
      return
    }
    const data = [['地址', '经度', '纬度',	'是否精确',	'可信度',	'地址类型', '坐标系',	'错误']]
    for (let i = 0; i < this.state.results.length; i++) {
      const row = this.state.results[i];
      const code = row.transformedCode || row.code
      data.push(
        [
          row.location || '',
          (code && code.lng) || '',
          (code && code.lat) || '',
          row.precise || '',
          row.confidence || '',
          row.level || '',
          row.transformedCoords ||  row.coords || '',
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
            <div className="header-logo">
              <h1>Map Location</h1>
              <h3>批量转换地址为经纬度</h3>
            </div>

            <div className="header-link">
              <a href="https://www.piliang.tech?from=sjfkai" target="_blank" rel="noopener noreferrer">
                <Icon type="link" /> 经纬度转地址
              </a>
            </div>
          </Header>
          <Content className="content">
            <LocationInput onSubmit={this.handleSubmit} loading={this.state.loading}/>
            {
              this.state.isDesktop ? (
                <div className="result">
                  <Row type="flex" justify="space-between" >
                    <Col className="result-text">结果:</Col>
                    <Col>
                      <div className="transform">
                        坐标系
                        <Popover title="关于坐标系" content={coordsTipContent}>
                          <Icon type="question-circle" theme="outlined" />
                        </Popover>： 
                        <Select 
                          defaultValue={this.state.coordsValue}
                          value={this.state.coordsValue}
                          className="coords-select"
                          onChange={this.onCoordsChange}
                          disabled={this.state.loading}
                        >
                          <Option value="default">默认</Option>
                          <Option value="gcj02">GCJ-02（腾讯、高德、谷歌cn等）</Option>
                          <Option value="bd09">BD-09（百度）</Option>
                          <Option value="wgs84">WGS-84（Google Earth、GPS等）</Option>
                        </Select> 
                      </div>
                      <Button className="table-btn" onClick={this.download} icon="download"> 下载 </Button>
                      <Button className="table-btn" onClick={this.clearResult} icon="delete"> 清空 </Button>
                    </Col>
                  </Row>
                  <div className="table">
                    <ResultTable 
                      results={this.state.results} 
                      loading={this.state.loading}
                      handleDelete={this.handleDelete}
                    />
                  </div>
                  <TuCao></TuCao>
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
            <div className="footer-link">
              <a href="https://github.com/sjfkai/mapLocation/blob/master/docs/FAQ.md" target="_blank"  rel="noopener noreferrer">常见问题</a>
              <a href="https://github.com/sjfkai/mapLocation/blob/master/docs/CHANGELOG.md" target="_blank"  rel="noopener noreferrer">更新日志</a>
              <a href="https://github.com/sjfkai/mapLocation" target="_blank"  rel="noopener noreferrer">项目源码</a>
            </div>
            <p>Based on <a href="https://developers.google.com/maps/documentation/geocoding/start?hl=zh-cn" target="_blank"  rel="noopener noreferrer" className="bold">Google</a> and <a href="https://lbsyun.baidu.com/index.php?title=webapi/guide/webservice-geocoding" target="_blank"  rel="noopener noreferrer" className="bold" >Baidu</a> Geocoder API</p>
            <p>Developed by <a href="mailto:sjfkai@163.com" target="_top" className="bold">sjfkai@163.com</a></p>
            {/* <p>Hosted by <a href="https://pages.coding.me" className="bold">Coding Pages</a></p> */}
          </Footer>
        </Layout>
      </div>
    )
  }
}

export default App

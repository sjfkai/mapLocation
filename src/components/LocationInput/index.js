import React, { Component } from 'react'
import {Row, Col, Radio, Input, Form, Button, Icon, Popover} from 'antd'
import PropTypes from 'prop-types'
import './index.css'

const FormItem = Form.Item
const { TextArea } = Input
const RadioGroup = Radio.Group

class LocationInput extends Component {
  static propTypes = {
    form: PropTypes.shape({
      getFieldDecorator: PropTypes.func,
      validateFields: PropTypes.func,
    }).isRequired,
    onSubmit: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {
      showCustomApiKey: false,
      showApiKeyInput: false,
    }
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.onSubmit({
          platform: values.platform,
          locations: values.locations.split('\n').filter(v => v.trim() !== ''),
          apiKey: values.platform === 'google' && this.state.showApiKeyInput ? values.apiKey :'',
        })
      }
    })
  }

  onPlatformChange = (e) => {
    if (e.target.value === 'google') {
      this.setState({
        showCustomApiKey: true,
      })
      return 
    }

    this.setState({
      showCustomApiKey: false,
      showApiKeyInput: false,
    })
  }

  showApiKeyInput = (e) => {
    e.preventDefault()
    this.setState((state, props) => ({
      showApiKeyInput: !state.showApiKeyInput,
    }))
  }

  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <Form onSubmit={this.handleSubmit}>
        <Row type="flex" align="bottom" gutter={24}>
          <Col xs={24} md={16}>
            <FormItem label= "在下面输入地址，每个地址占一行">
              {getFieldDecorator('locations', {
                rules: [
                  { required: true, message: '请至少输入一个地址' },
                  { validator: (rule, value, cb) => { (value && value.match(/^[\d|.|\-|,|\n|\s]+$/g)) ? cb(true) : cb() } , message: '不支持经纬度坐标转地址'}
                ],
                validateTrigger: 'onChange'
              })(
                <TextArea autosize={{minRows: 15, maxRows: 20 }} ></TextArea>
              )}
            </FormItem>
          </Col>
          <Col xs={24} md={8} >
            <Row type="flex" justify="center"> 
              <Col span={24}>选择平台：</Col>
              <Col span={24}>
                <FormItem>
                  {getFieldDecorator('platform', {initialValue: 'baidu'})(
                    <RadioGroup onChange={this.onPlatformChange}>
                      <div className="radio" >
                        <Radio value="baidu">Baidu</Radio>
                        <Popover title="Baidu地址要求" content={baiduTip}>
                          <Icon type="question-circle"/>
                        </Popover>
                      </div>
                      <div className="radio" >
                        <Radio value="google">
                          Google
                        </Radio>
                        <Popover title="Google地址要求" content={googleTip}>
                          <Icon type="question-circle"/>
                        </Popover>
                        <a style={{paddingLeft: '10px'}} href="https://github.com/sjfkai/mapLocation/blob/master/docs/FAQ.md#%E4%B8%BA%E4%BD%95-google-%E5%BC%95%E6%93%8E%E6%97%A0%E6%B3%95%E4%BD%BF%E7%94%A8%EF%BC%9F" target="_blank"  rel="noopener noreferrer">无法使用？</a>
                        { this.state.showCustomApiKey &&
                          <a onClick={this.showApiKeyInput} className="custom-api-key">自定义API_KEY</a>
                        }
                      </div>
                    </RadioGroup>
                  )}
                </FormItem>
              </Col>
              {
                this.state.showApiKeyInput && 
                <Col span={24}>
                  <FormItem>
                    {getFieldDecorator('apiKey', {initialValue: ''})(
                        <Input placeholder="请输入您的 Google API_KEY" />
                    )}
                    <a href="https://github.com/sjfkai/mapLocation/blob/master/docs/FAQ.md#%E5%A6%82%E4%BD%95%E7%94%B3%E8%AF%B7google-api_key" target="_blank"  rel="noopener noreferrer">如何申请？</a>
                  </FormItem>
                </Col>
              }
              <Col span={24}>
                <FormItem>
                  <Button type="primary" htmlType="submit" loading={this.props.loading}> 转换 </Button>
                </FormItem>
              </Col>
            </Row>
          </Col>
        </Row>
      </Form>
    )
  }
}

const baiduTip = (
  <div>
    <ul>
      <li>标准的结构化地址信息，如北京市海淀区上地十街十号 【推荐，地址结构越完整，解析精度越高】</li>
      <li>支持“*路与*路交叉口”描述方式，如北一环路和阜阳路的交叉路口</li>
      <li>第二种方式并不总是有返回结果，只有当地址库中存在该地址描述时才有返回。</li>
      <li><a href="http://lbsyun.baidu.com/index.php?title=webapi/guide/webservice-geocoding" target="_blank"  rel="noopener noreferrer">Read more...</a></li>
    </ul>
  </div>
)

const googleTip = (
  <div>
    <ul>
      <li>Google 平台可能在大陆不能使用，建议仅在 Baidu 查询不到的情况下使用</li>
      <li>按照相关国家全国邮政服务使用的格式指定地址</li>
      <li>请勿额外指定在相关国家邮政服务定义的地址中并不包括的地址元素，如公司名称、单元号、楼层号或套房号</li>
      <li>在场所的街道号和建筑名称之间，尽可能优先使用前者</li>
      <li>在使用街道号地址与指定十字路口之间，尽可能优先使用前者</li>
      <li>请勿提供附近标志性建筑等“提示”</li>
      <li><a href="https://developers.google.com/maps/faq?#geocoder_queryformat" target="_blank"  rel="noopener noreferrer">Read more...</a></li>
    </ul>
  </div>
)

export default Form.create()(LocationInput)

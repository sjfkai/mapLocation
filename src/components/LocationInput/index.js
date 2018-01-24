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
    onSubmit: PropTypes.func.isRequired
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.onSubmit({
          platform: values.platform,
          locations: values.locations.split('\n').filter(v => v.trim() !== '')
        })
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <Form onSubmit={this.handleSubmit}>
        <Row type="flex" align="bottom">
          <Col span={16}>
            <FormItem label= "在下面输入地址，每个地址占一行">
              {getFieldDecorator('locations', {
                rules: [{ required: true, message: '请至少输入一个地址' }],
                validateTrigger: 'onChange'
              })(
                <TextArea autosize={{minRows: 10, maxRows: 20 }} ></TextArea>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <Row type="flex" justify="center"> 
              <Col span={12}>选择平台：</Col>
            </Row>
            <Row type="flex" justify="center"> 
              <Col span={12}>
                <FormItem>
                  {getFieldDecorator('platform', {initialValue: 'baidu'})(
                    <RadioGroup>
                      <div className="radio" >
                        <Radio value="baidu">Baidu</Radio>
                        <Popover title="Baidu地址要求" content={baiduTip}>
                          <Icon type="question-circle"/>
                        </Popover>
                      </div>
                      <div className="radio" >
                        <Radio value="google">Google</Radio>
                        <Popover title="Google地址要求" content={googleTip}>
                          <Icon type="question-circle"/>
                        </Popover>
                      </div>
                    </RadioGroup>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row type="flex" justify="center"> 
              <Col span={12}>
                <FormItem>
                  <Button type="primary" htmlType="submit" > 转换 </Button>
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

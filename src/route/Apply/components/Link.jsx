import React from 'react';
import ReactDOM from 'react-dom';
import {
  Row,
  Col,
  Icon,
  Input,
  Form,
  Button,
  Modal,
  message
} from 'antd';
import reqwest from 'reqwest';
const createForm = Form.create;
const FormItem = Form.Item;

const uid = sessionStorage.uid;
const org_id = sessionStorage.org_id;
const token =  sessionStorage.token;

let reqMethod = sessionStorage.reqMethod;
let Method = sessionStorage.Method;
let publicUrl = sessionStorage.publicUrl;

console.log(uid,token)

function getQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  var r = window.location.search.substr(1).match(reg);
  if (r != null)
    return unescape(r[2]);
  return null;
}

function checkeURL(str) {
  //在JavaScript中，正则表达式只能使用"/"开头和结束，不能使用双引号
  var Expression = /http(s)?:/ ///([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
  var objExp = new RegExp(Expression);
  if (str.indexOf("localhost")) {
    str = str.replace("localhost", "127.0.0.1");
  }
  if (objExp.test(str) == true) {
    return true;
  } else {
    return false;
  }
}

class Link extends React.Component {
  constructor() {
    super();
    this.state = {
      org: {},
      visible:false,
      title:''
    }
    this.fetch = this.fetch.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleApply = this.handleApply.bind(this);
  }

  fetch(params, type) {
    reqwest({
      url: publicUrl,
      method: Method,
      data: params,
      type: reqMethod,
      contentType: 'application/jsonp',
      withCredentials: true,
      success: (result) => {
        // console.log(result)
        if(result.data.code == 0) {
          if (type == 'orgInfo') {
            console.log(result.data.org);
            this.setState({org: result.data.org});
          }
          if(type == 'title') {
            this.setState({
              title:result.data.title
            })
            console.log(this.state.title);
          }
          if(type == 'submit') {
            console.log(result);
            message.success('提交成功');
            window.location.href = '#/applyed'
          }
        }
        if(result.data.code == 2) {
          if(type == 'submit') {
            message.info('您已经推荐过该内容');
          }
        }
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  handleSubmit(e) {
    e.preventDefault();
    console.log(ReactDOM.findDOMNode(this.refs.link).childNodes[0].value);
    let formValue = ReactDOM.findDOMNode(this.refs.link).childNodes[0];
    if(checkeURL(formValue.value)) {
      this.fetch({service:'Article.FetchTitle',article_url:formValue.value,uid:uid,token:token},'title')
    }else {
      this.setState({
        visible:true,
      })

    }
  }

  handleApply() {
    let formValue = ReactDOM.findDOMNode(this.refs.link).childNodes[0];
    this.fetch({
      service:'Article.SubmitReprintReq',
      uid:uid,
      token:token,
      org_id:org_id,
      article_url:formValue.value
    },'submit')
  }

  componentWillMount() {
    this.fetch({
      service: 'Organization.GetOrgInfo',
      org_id: getQueryString('id')
    }, 'orgInfo');
  }

  render() {
    const { org } = this.state;
    const {getFieldProps} = this.props.form;

    return (
      <div>
        <Modal
            style={{width:'80%'}}
            title='输入网址'
            wrapClassName="vertical-center-modal"
            visible={this.state.visible}
            onOk={() => this.setState({visible:false})}
            onCancel={() => this.setState({visible:false})}>
            <p>请输入正确的网址</p>
          </Modal>
        <div className='linkTitle'>
          <Row style={{
            padding: '2rem 0 1rem 0'
          }}>
            <Col span='6' className='textCenter'>
              <img className='borderRadius' src={org.logo} width='60px'/>
            </Col>
            <Col span='12'>
              <Row>
                <Col span='22'>
                  <h2>{org.name || '机构信息'}</h2>
                </Col>
                <Col span='2'>
                  <h2 style={{
                    paddingLeft: '5rem'
                  }}>{org.rank}</h2>
                </Col>
              </Row>
              <Row>
                <Col span='24'>
                  <div>&nbsp;</div>
                </Col>
              </Row>
              <Row>
                <Col span='24'><Icon type="check-circle"/>{org.approved_num}</Col>
              </Row>
            </Col>
          </Row>
        </div>
        <Form form={this.props.form} onSubmit={this.handleSubmit}>
          <FormItem className='col-22 col-offset-1'>
            <Input style={{
              height: '3rem',
              margin: '2rem 0 0 0'
            }} {... getFieldProps('search')} placeholder='粘贴内容链接地址' ref='link'></Input>
          </FormItem>
          <FormItem className='col-22 col-offset-1'>
            <div className='col-18'>
              <Input style={{
                height: '3rem',
                marginBottom: '2rem'
              }} {... getFieldProps('name')} placeholder='文章标题（粘贴后可读取）' value={ this.state.title }></Input>
            </div>
            <div className='col-6'>
              <Button style={{
                height: '3rem',
                width: '100%'
              }} type='primary' htmlType='submit'>读取标题</Button>
            </div>
          </FormItem>
        </Form>
        <div style={{
          position: 'fixed',
          bottom: '2rem',
          width: '80%',
          marginLeft: '10%'
        }}>
          <Button style={{
            width: '100%',
            height: '3rem'
          }} type='primary' disabled={ !this.state.title ? true : false } onClick={this.handleApply}>提交申请</Button>
        </div>
      </div>
    )
  }
};

Link = createForm()(Link);
export default Link;

import React from 'react';
import { Link } from 'react-router';
import reqwest from 'reqwest';
import {Input, Form, Button, Card, Row} from 'antd';
const createForm = Form.create;
const FormItem = Form.Item;

let reqMethod = sessionStorage.reqMethod;
let Method = sessionStorage.Method;
let publicUrl = sessionStorage.publicUrl;

class Apply extends React.Component {
  constructor() {
    super();
    this.state = {
      orgs:[]
    }
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit(e) {
    e.preventDefault();
    var formValue = this.props.form.getFieldsValue();
    this.fetch({query:formValue.search,service:'Organization.SearchByName'});
    console.log(this.props.form.getFieldsValue());
  }

  fetch(params = {}) {
    reqwest({
      url: publicUrl,
      method: Method,
      data: params,
      type: reqMethod,
      contentType: 'application/jsonp',
      withCredentials: true,
      success: (result) => {
        console.log(result.data.orgs);
        this.setState({
          orgs:result.data.orgs
        })
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  renderContent() {
    const { orgs } = this.state;
    var orgLists = '';
    window.self = this;
    //searchContent:0 初始界面，1 搜索到结果，2 没有搜索到结果
    for(let i=0;i<orgs.length;i++) {
      orgLists +=
      `
      <div class='row'>
        <div class='col-20' style='color:#666;font-size:1.5rem;margin:5px auto 1rem'>${orgs[i].name}</div>
        <div class='col-4 textCenter' style='color:#666,font-size:1.5rem,margin-bottom:1rem'>
          <a href='?id=${orgs[i].id}#/link'><button type='button' class='ant-btn ant-btn-ghost' >申请</button></a>
        </div>
        <hr class='col-24' style='opacity:0.5;margin:0 auto 1rem' />
      </div>
      `
    }
    return (
        <div dangerouslySetInnerHTML={{__html:orgLists}}></div>
    )
  }

  render() {
    const { getFieldProps } = this.props.form;
    const formItemLayout = {
     wrapperCol: { span: 18,offset:1 },
   };

    return (
      <div className='container'>
        <div>&nbsp;</div>
        <Form onSubmit={this.handleSubmit}>
          <FormItem className='col-17 col-offset-1'>
            <Input style={{height:'3rem',marginBottom:'2rem'}} {... getFieldProps('search')} placeholder='搜索并选择机构'></Input>
          </FormItem>
          <FormItem className='col-5'>
            <Button  style={{height:'3rem',width:'100%'}} type="primary" htmlType="submit">搜索</Button>
          </FormItem>
        </Form>
        <Card title="●  搜索结果" className='col-22 col-offset-1' style={{marginTop:'-20px',color:'#333',minHeight:'30rem'}}>
          {this.renderContent()}
        </Card>
        <Link to='/applyed'>
          <Button type='primary' size='large' className='col-22 col-offset-1' style={{marginTop:'2rem'}}>已申请的</Button>
        </Link>
      </div>
    )
  }
};

Apply = createForm()(Apply);
export default Apply;

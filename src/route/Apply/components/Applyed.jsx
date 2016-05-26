import React from 'react';
import {Card, Badge, Row, Button, Icon, Tabs  } from 'antd';
import reqwest from 'reqwest';
const moment = require('moment');
moment.locale('zh-cn');
const TabPane = Tabs.TabPane;

const content = {
  title:'关于昨天对fabuhui，我感同身受到付款哈是封建时代',
  num:'13',
  time:'2015-12-12 14:20'
}

const uid = sessionStorage.uid;
const org_id = sessionStorage.org_id;
const token =  sessionStorage.token;

let reqMethod = sessionStorage.reqMethod;
let Method = sessionStorage.Method;
let publicUrl = sessionStorage.publicUrl;

class Applyed extends React.Component {
  constructor() {
    super();
    this.state = {
      value:0,
      articles:[]
    }
    this.fetch = this.fetch.bind(this);
    this.renderApplyedList = this.renderApplyedList.bind(this);
    this.clickRadio = this.clickRadio.bind(this);
    this.renderClickContent = this.renderClickContent.bind(this);
  }

  fetch(params,type) {
    reqwest({
      url: publicUrl,
      method: Method,
      data: params,
      type: reqMethod,
      contentType: 'application/jsonp',
      withCredentials: true,
      success: (result) => {
        console.log(result.data.articles);
        if(result.data.code == 0) {
          this.setState({
            articles:result.data.articles
          })
        }
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  componentWillMount() {
    this.fetch({
      service:'Article.GetArticlesByAuthStatus',
      uid:uid,
      token:token,
      auth:0
    },0)
  }

  clickRadio(num) {
    this.setState({
      value:num
    })
    if(num == 0) {
      this.fetch({
        service:'Article.GetArticlesByAuthStatus',
        uid:uid,
        token:token,
        auth:0
      },0)
    }
    if(num == 1) {
      this.fetch({
        service:'Article.GetArticlesByAuthStatus',
        uid:uid,
        token:token,
        auth:1
      },1)
    }
    if(num == 2) {
      this.fetch({
        service:'Article.GetArticlesByAuthStatus',
        uid:uid,
        token:token,
        auth:2
      },2)
    }
  }

  renderApplyedList() {
    const { articles } = this.state;
    let contentList = '';
    window.self = this;
    if(articles.length > 0) {
      for(let i=0;i<articles.length;i++) {
          contentList += `
          <div >
            <a href='?id=${articles[i].id}#/article'>
              <p class='col-20 homeContentTitle'>${articles[i].title}</p>
              <div class='col-4 textRight zIndex'><i class="anticon anticon-link"></i></div>
            </a>
            <div><div>&nbsp;</div></div>
            <div class='col-24' style='line-height:25px'>
              <div class='col-3'><img src=${articles[i].org_logo} width='25px' /></div>
              <div class='col-9' >${articles[i].org_name}</div>
              <div class='col-12 textRight'>
                ${moment.unix(articles[i].create_time).format('YYYY-MM-DD')}
              </div>
              <div >&nbsp;</div>
            </div>
          </div>
        `
      }
    }else {
      contentList='<div style="font-size:1.5rem">没有申请记录</div>'
    }

    return {__html: contentList};
  }

  renderClickContent() {
    return <div dangerouslySetInnerHTML={this.renderApplyedList()} />
  }

  render() {
    const { value } = this.state;
    return (
      <Row style={{marginBottom:'2rem',color:'#999'}}>
          <div>
            <Row >
              <div className='col-8 textCenter rankTitle' onClick={this.clickRadio.bind(null,0)} style={value == 0 ? {color:'#fff',borderBottom:'2px solid #339EC5'} : {}}>
                <Badge count={0}>未确认</Badge>
              </div>
              <div className='col-8 textCenter rankTitle' onClick={this.clickRadio.bind(null,1)} style={value == 1 ? {color:'#fff',borderBottom:'2px solid #339EC5'} : {}}>
                <Badge count={0}>已通过</Badge>
              </div>
              <div className='col-8 textCenter rankTitle' onClick={this.clickRadio.bind(null,2)} style={value == 2 ? {color:'#fff',borderBottom:'2px solid #339EC5'} : {}}>
                <Badge count={0}>未通过</Badge>
              </div>
            </Row>
            <div className='col-22 col-offset-1 '>
              <Card  style={{marginTop:'2rem'}}>
                {this.renderClickContent()}
              </Card>
            </div>
          </div>
      </Row>
    )
  }
};


export default Applyed;

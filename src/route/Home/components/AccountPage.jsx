import React from 'react';
import { Link } from 'react-router';
import reqwest from 'reqwest';
const moment = require('moment');
moment.locale('zh-cn');
import {Card, Col, Row, Icon, Button } from 'antd';


const uid = sessionStorage.uid;
const org_id = sessionStorage.org_id;
const token =  sessionStorage.token;

let reqMethod = sessionStorage.reqMethod;
let Method = sessionStorage.Method;
let publicUrl = sessionStorage.publicUrl;

function getQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  var r = window.location.search.substr(1).match(reg);
  if (r != null)
    return unescape(r[2]);
  return null;
}

console.log(getQueryString('id'))

class AccountPage extends React.Component {
  constructor() {
    super();
    this.state = {
      org:{},
      articles:[]
    }
    this.renderContentList = this.renderContentList.bind(this);
    this.fetch = this.fetch.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  componentWillMount() {
    this.fetch({service:'Organization.GetOrgInfo',org_id:getQueryString('id'),day:0},'orgInfo');
    this.fetch({service:'Organization.GetArticles',org_id:getQueryString('id')},'articles')
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
        if(type == 'orgInfo') {
          this.setState({
            org:result.data.org
          })
          console.log(this.state.org)
        }
        if(type == 'articles') {
          console.log(result.data.articles)
          this.setState({
            articles:result.data.articles
          })
        }
        if(type == 'signup') {
          window.location.href = result.data.oauth_url;
        }
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  renderContentList() {
    const { articles } = this.state;
    let contentList = '';
    window.self = this;
    for(let i=0;i<articles.length;i++) {
        contentList += `
        <div >
          <a href='?id=${articles[i].id}#/article'>
              <p class='col-20 homeContentTitle'>${articles[i].title}</p>
              <div class='col-4 textRight zIndex'><i class="anticon anticon-right"></i></div>
          </a>
          <div><div>&nbsp;</div></div>
          <div>
            <div class='col-12'>
              <i class="anticon anticon-check-circle"></i> ${articles[i].approved_num}
            </div>
            <div class='col-12 textRight' >${moment.unix(articles[i].create_time).format('YYYY-MM-DD')}</div>
          </div>
          <div><div>&nbsp;</div></div>
        </div>
      `
    }


    return {__html: contentList};

  }
  handleClick() {
    if(uid == '') {
      this.fetch({service:'Wechat.GetOAuthUrlUserinfo'},'signup')
    }else {

    }
  }

  render() {
    const { org } = this.state;
    var h=window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    return (
      <div className='homeContainer'>
          <div className='linkTitle'>
            <Row style={{padding:'2rem 0 1rem 0'}}>
              <Col span='6' className='textCenter'>
                <img className='borderRadius' src={org.logo} width='60px' />
              </Col>
              <Col span='12'>
                <Row>
                  <Col span='22'>
                    <h2 style={{color:'#fff'}}>{org.name}</h2>
                  </Col>
                  <Col span='2'><h2 style={{paddingLeft:'5rem'}}>{org.rank}</h2></Col>
                </Row>
                <Row><Col span='24'><div>&nbsp;</div></Col></Row>
                <Row>
                  <Col span='24'>
                    <Icon type="check-circle" />{org.approved_num}
                      &nbsp;&nbsp;
                    <Icon type="cross-circle" />{org.rejected_num}
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>
          <Card  style={{ width:'90%',marginLeft:'5%',top:'2rem'}}>
            <div dangerouslySetInnerHTML={this.renderContentList()} />
          </Card>
          <Button type='primary' size='large' onClick={this.handleClick} className='col-22 col-offset-1' style={{marginTop:'4rem'}}>
            { uid == '' ? '加入授权联盟' : '申请转载内容' }
          </Button>

      </div>
    )
  }
};


export default AccountPage;

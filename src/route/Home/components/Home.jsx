import React from 'react';
import { Link } from 'react-router';
import reqwest from 'reqwest';
import {Card, Col, Row, Icon, Button } from 'antd';

const uid = getQueryString('uid');
const org_id = getQueryString('org_id');
const token =  getQueryString('token');

sessionStorage.uid = uid;
sessionStorage.org_id = org_id;
sessionStorage.token =  token;

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


class Home extends React.Component {
  constructor() {
    super();
    this.state = {
      org:{},
      articles:[]
    }
    this.renderContentList = this.renderContentList.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.fetch = this.fetch.bind(this);
  }

  componentWillMount() {
    this.fetch({org_id:org_id,service:'Organization.GetArticles'},'articles');
    this.fetch({org_id:org_id,service:'Organization.GetOrgInfo'},'info');
  }

  fetch(params = {},type) {
    reqwest({
      url: publicUrl,
      method: Method,
      data: params,
      type: reqMethod,
      contentType: 'application/jsonp',
      withCredentials: true,
      success: (result) => {
        console.log(result);
        if(result.data.code == 0) {
          if(type == 'info') {
            //获取机构信息
            this.setState({ org:result.data.org })
          }
          if(type == 'articles') {
            //获取机构文章
            this.setState({ articles:result.data.articles })
          }
        }
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  handleClick() {
    const { org } = this.state;
    let params = {
      service:'User.GetOrgInfo',
      uid:uid,
      token:token
    }
    sessionStorage.org_info = JSON.stringify(params);
    window.location.href = '#/media'
  }


  renderContentList() {
    const { articles } = this.state;
    console.log(articles);
    let contentList = '';
    window.self = this;
    for(var i=0;i<articles.length;i++) {
        contentList += `
        <div>
          <a href='?id=${articles[i].id}#/confirm'>
              <p class='col-20 homeContentTitle'>${articles[i].title}</p>
              <div class='col-4 textRight zIndex'><i class="anticon anticon-right"></i></div>
          </a>
          <div><div>&nbsp;</div></div>
          <div class='col-24'>
            <i class="anticon anticon-question-circle"></i> ${articles[i].pending_num}
              &nbsp;&nbsp;&nbsp;
            <i class="anticon anticon-check-circle"></i> ${articles[i].approved_num}
              &nbsp;&nbsp;&nbsp;
            <i class="anticon anticon-cross-circle"></i> ${articles[i].rejected_num}
          </div>
          <div><div>&nbsp;</div></div>
        </div>
      `
    }
    return {__html: contentList};
  }

  render() {
    const { org } = this.state;
    return (
      <div className='homeContainer'>
        <div className='linkTitle'>
          <Row style={{padding:'2rem 0 1rem 0'}}>
            <Col span='6' className='textCenter'>
              <img onClick={this.handleClick} className='borderRadius' src={org.logo} width='60px' />
            </Col>
            <Col span='12'>
              <Row>
                <Col span='24'>
                  <h2 onClick={this.handleClick} style={{color:'#fff'}}>{org.name || '机构名称..'}</h2>
                </Col>
              </Row>
              <Row><Col span='24'><div>&nbsp;</div></Col></Row>
              <Row>
                <Col span='24'>
                  <Icon type="check-circle" />{org.approved_num || 0}
                    &nbsp;&nbsp;
                  <Icon type="cross-circle" />{org.rejected_num || 0}
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
        <div className='col-24' style={{fontSize:'1.5rem',padding:'1rem'}}>
          <Link to='/rank'>
            <div className='col-12' >
              <Icon type="bar-chart" />排行榜
            </div>
            <div className='col-12 textRight'>
              上周第五名
            </div>
          </Link>
        </div>
        <hr className='opacity'/>
          <Card  style={{ width:'90%',marginLeft:'5%',top:'1rem'}}>
            <div dangerouslySetInnerHTML={this.renderContentList()} />
          </Card>
          <Link to='/apply'>
            <Button type='primary' size='large' className='col-22 col-offset-1' style={{marginTop:'4rem'}}>转载内容</Button>
          </Link>

      </div>
    )
  }
};


export default Home;

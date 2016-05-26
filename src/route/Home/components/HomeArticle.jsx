import React from 'react';
import reqwest from 'reqwest';
import {
  Card,
  Col,
  Row,
  Icon,
  Button,
  Affix,
  Tag,
  message
} from 'antd';
const moment = require('moment');
moment.locale('zh-cn');

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


class HomeArticle extends React.Component {
  constructor() {
    super();
    this.state = {
      article:{}
    }
    this.fetch = this.fetch.bind(this);
    this.handleClick = this.handleClick.bind(this);
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
        if(type == 'article') {
          console.log(result.data.article);
          this.setState({
            article:result.data.article
          })
        }
        if(type == 'reprint') {
          console.log(result.data);

          if(result.data.code == 2) {
            message.error('您已申请过该文章！~');
            return;
          }
          var reprint = document.getElementById('reprint').childNodes[0];
          reprint.innerHTML = '已申请';
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

  componentWillMount() {
    this.fetch({service:'Article.GetArticleReprintInfo',article_id:getQueryString('id')},'article')
  }

  handleClick() {
    const { article } = this.state;

    if(uid == '') {
      this.fetch({service:'Wechat.GetOAuthUrlUserinfo'},'signup')
    }else {
      this.fetch({
        service:'Article.SubmitReprintReq',
        uid:uid,
        token:token,
        article_url:article.url,
        org_id:article.org_id
      },'reprint')
    }
  }

  render() {
    const { article } = this.state;
    var h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    return (
      <div className='homeContainer'>
        <iframe width='100%' height={h} frameborder={0} src={article.url}></iframe>
        <Affix offsetBottom={0}>
          <div className='articlefixed'>
            <div className='col-20' style={{
              padding: '10px'
            }}>
              <Row style={{
                marginBottom: '5px'
              }}>
                <p style={{
                  fontSize: '1.5rem'
                }}>
                {article.approved_num}人转载本文</p>
              </Row>
              <Row>
                <p >{moment.unix(article.create_time).format('YYYY-MM-DD')}首次转载自  <span style={{color:'#3DAEEC'}}>[{article.org_name}]</span></p>
              </Row>
            </div>
            <div className='col-4'>
              <Button
                onClick={this.handleClick}
                id='reprint'
                type='primary'
                style={{margin: '15px 10px 0 -35px'}}>
                { uid == '' ? '加入联盟' : '我要转载' }
              </Button>
            </div>
          </div>
        </Affix>
      </div>
    )
  }
};

export default HomeArticle;

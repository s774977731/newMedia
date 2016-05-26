import React from 'react';
import reqwest from 'reqwest';
import {Card, Col, Row, Icon, Button, Modal } from 'antd';
const confirm = Modal.confirm;
const moment = require('moment');
moment.locale('zh-cn');

function getQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  var r = window.location.search.substr(1).match(reg);
  if (r != null)
    return unescape(r[2]);
  return null;
}

const uid = sessionStorage.uid;
const org_id = sessionStorage.org_id;
const token =  sessionStorage.token;
let reqMethod = sessionStorage.reqMethod;
let Method = sessionStorage.Method;
let publicUrl = sessionStorage.publicUrl;

class HomeArticle extends React.Component {
  constructor() {
    super();
    this.state = {
      confirm:0,
      article:{},
      orgs:[]
    }
    this.fetch = this.fetch.bind(this);
    this.renderConfirmList = this.renderConfirmList.bind(this);
    this.showModalCancel = this.showModalCancel.bind(this);
    this.showModalPass = this.showModalPass.bind(this);
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
        console.log(result,params);
        if(type == 'orgs') {
          this.setState({
            orgs:result.data.orgs,
          })
        }
        if(type == 'article') {
          this.setState({
            article:result.data.article
          })
        }
        if( type == 'reject') {
          this.setState({confirm:2});
        }
        if( type == 'approve') {
          this.setState({confirm:1});
        }
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  componentWillMount() {
    this.fetch({service:'Article.GetOrgsByArticleId',article_id:getQueryString('id')},'orgs');
    this.fetch({service:'Article.GetArticleReprintInfo',article_id:getQueryString('id')},'article');
  }

  renderTitle() {
    const { article } = this.state;
    var contentList = `
    <div >
      <a href='?id=${article.id}#/article'>
        <p class='col-20 confirmContentTitle' ><b>${article.title || '文章标题...'} </b></p>
        <div class='col-4 textRight zIndex confirmContentTitle' style='color:#999'>
          <i class="anticon anticon-caret-right"></i>文章
        </div>
      </a>
      <div><div>&nbsp;</div></div>
      <div class='col-24'>
        <i class="anticon anticon-question-circle"></i> ${article.pending_num || 0}
          &nbsp;&nbsp;&nbsp;
        <i class="anticon anticon-check-circle"></i> ${article.approved_num || 0}
          &nbsp;&nbsp;&nbsp;
        <i class="anticon anticon-cross-circle"></i> ${article.rejected_num || 0}
      </div>
      <div><div>&nbsp;</div></div>
    </div>
  `

  return {__html : contentList }
  }

  renderConfirmList() {
    const { confirm, orgs } = this.state;
    var rankList  = '';
    window.self = this;


    for(let i=0;i<orgs.length;i++){
      rankList += `
      <div class='ant-card ant-card-bordered col-22 col-offset-1'>
        <div class='ant-card-body'>
          <div class='row custom-card'>
            <a href='?id=${orgs[i].id}#/account'>
              <div class='col-24'>
                <div class='col-2'>
                  <img src=${orgs[i].logo} width='20px' />
                </div>
                <div class='col-22'>
                    <div style='display:inline-block;margin-top:-20px'>&nbsp;&nbsp;${orgs[i].name}&nbsp;&nbsp;</div>
                    <i class="anticon anticon-check-circle"></i> ${orgs[i].approved_num}
                </div>
              </a>
            </div>
            <div><div>&nbsp;</div></div>
            <div class='col-24'>
              <div class='col-12' style='line-height:30px'>${moment.unix(orgs[i].create_time).format('YYYY-MM-DD')}</div>
              <div class='col-12 textRight' >
                ${window.self.returnStatus(i)}
              </div>
            </div>
          </div>
        </div>
      </div>
      `
    }
    return {__html: rankList};
  }

  returnStatus(i) {
    const { confirm, orgs } = this.state;
    if(orgs[i].auth == 0) {
      var isconfirm = '';
      switch (confirm) {
        case 1:
          isconfirm = `<div>已通过</div>`
          break;
        case 2:
          isconfirm = `<div>未通过</div>`
          break;
        default:
          isconfirm =
           `
            <button type='button' onclick='window.self.showModalCancel(${i})' class='ant-btn ant-btn-ghost'>
              <i class="anticon anticon-cross"></i>
            </button>
            <button type='button' onclick='window.self.showModalPass(${i})' class='ant-btn ant-btn-primary'>
              允许
            </button>
          `
          break;
      }

      return isconfirm
    }
    if(orgs[i].auth == 1) {
      return ( `<div>已通过</div>` )
    }
    if(orgs[i].auth == 2) {
      return ( `<div>未通过</div>` )

    }

  }


  showModalCancel(i) {
    const { orgs } = this.state;
    confirm({
        title: '不允许',
        width:'80%',
        onOk: () => {
          this.fetch({
            service:'Article.RejectReprint',
            uid:uid,
            token:token,
            article_id:getQueryString('id'),
            org_id:orgs[i].id
          },'reject')
        },
        onCancel() {},
      });
  }

  showModalPass(i) {
    const { orgs } = this.state;
    confirm({
        title: '允许',
        width:'80%',
        onOk: () => {
          this.fetch({
            service:'Article.ApproveReprint',
            uid:uid,
            token:token,
            article_id:getQueryString('id'),
            org_id:orgs[i].id
          },'approve')
        },
        onCancel() {},
      });
  }



  render() {
    return (
      <div className='homeContainer'>
        <Row>
          <div className='col-22 col-offset-1' style={{top:'2rem',marginBottom:'2rem'}} dangerouslySetInnerHTML={this.renderTitle()} />
        </Row>
        <Row>
          <div  dangerouslySetInnerHTML={this.renderConfirmList()} />
        </Row>
      </div>
    )
  }
};


export default HomeArticle;

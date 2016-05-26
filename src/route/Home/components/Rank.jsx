import React from 'react';
import {Link} from 'react-router';
import reqwest from 'reqwest';
import {
  Card,
  Col,
  Row,
  Radio,
  Button,
  Icon
} from 'antd';
const moment = require('moment');
moment.locale('zh-cn');
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;


let reqMethod = sessionStorage.reqMethod;
let Method = sessionStorage.Method;
let publicUrl = sessionStorage.publicUrl;

class Rank extends React.Component {
  constructor() {
    super();
    this.state = {
      value: 1,
      day: 7,
      orgs: [],
      articles: []
    }
    this.renderRankList = this.renderRankList.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.clickRadio = this.clickRadio.bind(this);
    this.fetch = this.fetch.bind(this);
    this.renderArticleList = this.renderArticleList.bind(this);
  }

  componentWillMount() {
    this.fetch({
      service: 'Organization.GetTopChart',
      day: this.state.day
    }, 'media');
  }

  fetch(params = {}, type) {
    reqwest({
      url: publicUrl,
      method: Method,
      data: params,
      type: reqMethod,
      contentType: 'application/jsonp',
      withCredentials: true,
      success: (result) => {
        if (type == 'media') {
          this.setState({orgs: result.data.orgs})
          console.log(this.state.orgs);
        }
        if (type == 'article') {
          this.setState({articles: result.data.articles})
          console.log(this.state.articles);
        }
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  clickRadio(num) {
    console.log(num);
    this.setState({value: num});
    if (num == 2) {
      this.fetch({
        service: 'Article.GetTopChart',
        day: this.state.day
      }, 'article')
    }
  }

  handleChange(e) {
    const { value, day } = this.state;
    // this.setState({
    //   day:e.target.value
    // })
    console.log(e.target.value,value);
    if(value == 1) {
      this.fetch({
        service: 'Organization.GetTopChart',
        day: e.target.value
      }, 'media')
    }else if(value == 2){
      this.fetch({
        service: 'Article.GetTopChart',
        day: e.target.value
      }, 'article')
    }
  }

  renderRankList() {
    const {orgs} = this.state;
    var rankList = '';
    for (let i = 0; i < orgs.length; i++) {
      rankList += `
      <div class='ant-card ant-card-bordered col-22 col-offset-1' >
        <div class='ant-card-body'>
          <div class='row custom-card'>
            <div class='col-6'>
              <img src=${orgs[i].logo} width='50'/>
            </div>
            <div class='col-18' >
              <a href='?id=${orgs[i].id}#/account'>
                <h3 class='col-22' style="color: #000">${orgs[i].name}</h3>
                <h3 class='col-2' style="color: #000">${orgs[i].rank}</h3>
              </a>
              &nbsp;
              <div class='col-24'>
                <div class='col-6'><i class="anticon anticon-check"></i>${orgs[i].approved_num}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      `
    }
    return {__html: rankList};
  }

  renderArticleList() {
    const {articles} = this.state;
    var rankList = '';
    for (let i = 0; i < articles.length; i++) {
      rankList += `
      <div class='ant-card ant-card-bordered col-22 col-offset-1'>
        <div class='ant-card-body'>
          <div class='row custom-card'>
            <div class='col-24'>
              <a href='?id=${articles[i].id}#/article'>
                <p class='col-20 homeContentTitle'>${articles[i].title}</p>
                <div class='col-4 textRight zIndex'><h3 style="color: #000">${articles[i].rank}</h3></div>
              </a>
            </div>
            <div><div>&nbsp;</div></div>
            <div class='col-24'>
              <div class='col-12'>
                <i class="anticon anticon-check-circle"></i> ${articles[i].approved_num}
              </div>
              <div class='col-12 textRight' >${moment.unix(articles[i].create_time).format('YYYY-MM-DD')}</div>
            </div>
          </div>
        </div>
      </div>
      `
    }
    return {__html: rankList};
  }

  render() {
    const {valueLeft, value} = this.state;
    return (
      <div className='homeContainer'>
        <Row >
          <div className='col-12 textCenter rankTitle' onClick={this.clickRadio.bind(null, '1')} style={value == 1
            ? {
              color: '#fff',
              borderBottom: '2px solid #339EC5'
            }
            : {}}>媒体</div>
          <div className='col-12 textCenter rankTitle' onClick={this.clickRadio.bind(null, '2')} style={value == 2
            ? {
              color: '#fff',
              borderBottom: '2px solid #339EC5'
            }
            : {}}>文章</div>
        </Row>
        <Row style={{
          top: '1rem',
          marginBottom: '2rem',
          textAlign: 'center'
        }}>
          <RadioGroup defaultValue="7" onChange={this.handleChange}>
            <RadioButton value="7">周</RadioButton>
            <RadioButton value="0">总</RadioButton>
          </RadioGroup>
        </Row>
        {value == '1'
          ? <div dangerouslySetInnerHTML={this.renderRankList()}/>
          : <div dangerouslySetInnerHTML={this.renderArticleList()}/>
}
      </div>
    )
  }
};

export default Rank;

import React from 'react';
import reqwest from 'reqwest';
import {Card, Col, Row, Icon, Button } from 'antd';

let reqMethod = sessionStorage.reqMethod;
let Method = sessionStorage.Method;
let publicUrl = sessionStorage.publicUrl;


class MediaInfo extends React.Component {
  constructor() {
    super();
    this.state = {
      org:{}
    }
    this.fetch = this.fetch.bind(this);
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
        console.log(result);
        this.setState({
          org:result.data.org
        })
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  componentWillMount() {
    var org_info = JSON.parse(sessionStorage.org_info);
    this.fetch(org_info);
    // console.log(org_info);
  }

  render() {
    const { org } = this.state;
    var h=window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    var heightTest = {
      height:h
    }
    return (
      <div className='homeContainer verticalCenter' style={heightTest}>
        <Card className='textCenter absoluteCenter col-18 col-offset-3'>
          <div className='col-24'>
            <span style={{color:'#444444',fontSize:'1.8rem'}}>-------机构信息-------</span>
          </div>
          &nbsp;
          <div className='col-24'>
            <span style={{fontSize:'1.5rem'}}>机构名--{org.name}</span>
          </div>
          <Row>
            <div>&nbsp;</div>
          </Row>
          <div className='col-24'>
            <span style={{fontSize:'1.5rem'}}>负责人--{org.rp}</span>
          </div>
          &nbsp;
          <div className='col-24'>
            <span style={{fontSize:'1.5rem'}}>手机号--{org.phone}</span>
          </div>
          &nbsp;
          <div className='col-24'>
            <img style={{marginTop:'2rem',width:'80%',marginLeft:'10%',border:'1px dashed #999'}} src={org.credential}/>
          </div>
        </Card>

      </div>
    )
  }
};

export default MediaInfo;

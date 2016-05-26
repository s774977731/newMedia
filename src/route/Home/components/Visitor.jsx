import React from 'react';
import { Button } from 'antd';
import reqwest from 'reqwest';
import Rank from './Rank';

let reqMethod = sessionStorage.reqMethod;
let Method = sessionStorage.Method;
let publicUrl = sessionStorage.publicUrl;
sessionStorage.uid = '';
sessionStorage.org_id = '';
sessionStorage.token =  '';

class Visitor extends React.Component {
  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
  }

  fetch(params) {
    reqwest({
      url: publicUrl,
      method: Method,
      data: params,
      type: reqMethod,
      contentType: 'application/jsonp',
      withCredentials: true,
      success: (result) => {
        console.log(result.data);
        window.location.href = result.data.oauth_url;
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  handleClick() {
    this.fetch({service:'Wechat.GetOAuthUrlUserinfo'});
  }

  render() {
    return (
      <div>
        <Rank />
        <div className='visitorFixed'>
          <div className='col-22 col-offset-1 textCenter'>
            <Button size='large' style={{width:'100%'}} type='primary' onClick={this.handleClick}>加入授权联盟</Button>
          </div>
        </div>
      </div>
    )
  }
};


export default Visitor;

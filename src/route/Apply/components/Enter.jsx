import React from 'react';
import reqwest from 'reqwest';
import {DatePicker} from 'antd';

let reqMethod = sessionStorage.reqMethod;
let Method = sessionStorage.Method;
let publicUrl = sessionStorage.publicUrl;

class Enter extends React.Component {
  constructor() {
    super();
    this.fetch = this.fetch.bind(this);
  }

  fetch(params) {
    reqwest({
      url: publicUrl,
      method: 'get',
      data: params,
      type: 'jsonp',
      contentType: 'application/jsonp',
      withCredentials: true,
      success: (result) => {
        console.log(result.data.oauth_url);
        window.location.href = result.data.oauth_url;
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  componentWillMount() {
    this.fetch({service:'Wechat.GetOAuthUrlBase'});
  }
  render() {
    return (
      <div className='container'>

      </div>
    )
  }
};


export default Enter;

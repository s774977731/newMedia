import React from 'react';
import {Icon} from 'antd';

class SignFinish extends React.Component {
  constructor() {
    super();
  }
  render() {
    return (
      <div className='signBody'>
        <img style={{margin:'4rem auto 2rem'}} src='./source/image/check.png'></img>
        <h2 style={{marginBottom:'2rem'}}>已提交认证</h2>
        <div className='opacity'>
          <h6>长按二维码&nbsp;&nbsp;关注公共号</h6>
          <h6>掌握认证进度</h6>
        </div>
        <div>
          <img src='./source/image/er.png' width='65%'/>
        </div>
      </div>
    )
  }
};



export default SignFinish;

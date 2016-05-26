import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import reqwest from 'reqwest';
import {Row, Col, Input, Form, Button, Tag, Upload, Icon, message  } from 'antd';
const createForm = Form.create;
const FormItem = Form.Item;
const Dragger = Upload.Dragger;
const publicUrl = 'http://reprint.webei.cn/reprint/';

function GetQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if (r != null)
    return unescape(r[2]);
  return null;
}
var is_phone = function (phone_number) { return /^1[34578]\d{9}$/.test(phone_number); };
var wait = 2;
var Url = 'http://reprint.webei.cn/reprint/';

class Signup extends React.Component {
  constructor() {
    super();
    //searchContent:0 初始界面，1 搜索到结果，2 没有搜索到结果
    this.state = {
      search:false,
      searchContent:0,
      fileList:[],
      credential:'',
      disable:false,
      show:false,
      showCode:false,
      orgValue:'',
      orgs:[],
      orgId:0,
      upimgss:false
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleFacus = this.handleFacus.bind(this);
    this.renderSearch = this.renderSearch.bind(this);
    this.handleImgChange = this.handleImgChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.getSmsCode = this.getSmsCode.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.hideSearchPage = this.hideSearchPage.bind(this);
    this.renderSearchContent = this.renderSearchContent.bind(this);
  }

  componentWillMount() {
    this.wxparams = {
      openid:GetQueryString("openid"),
      timestamp:GetQueryString("timestamp"),
      nonce:GetQueryString("nonce"),
      signature:GetQueryString("signature"),
      nickname:GetQueryString("nickname"),
      avatar:GetQueryString("avatar"),
    }
    console.log(this.wxparams.openid, this.wxparams.nickname);
  }

  fetch(params,type) {
    reqwest({
      url: Url,
      method: 'get',
      data: params,
      type: 'jsonp',
      contentType: 'application/jsonp',
      withCredentials: true,
      success: (result) => {
        console.log(result);
        switch (type) {
          case 'search':
          const orgs = result.data.orgs;
            if(orgs.length > 0) {
              this.setState({
                searchContent:1,
                orgs:orgs
              })
            }else {
              this.setState({searchContent:2})
            }
            console.log(this.state.orgs);
            break;

          case 'submit':
              if(result.data.code == 2) {
                message.error('该机构已被注册');
                return;
              }
              if(result.data.code == 3) {
                message.error('验证码错误');
                return;
              }
              if(result.data.code == 4) {
                message.error('电话号码已存在');
                return;
              }
              window.location.href = '#/finish';
              break;
          }
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  handleFacus() {
    this.setState({
      search:true,
    })
  }

  getSmsCode() {
    let smsContent = document.getElementById('sms').childNodes[0];
    if(wait == 0) {
      smsContent.innerHTML = '获取验证码';
      this.setState({
        disable:false
      })
      wait = 2;
    }else {
      smsContent.innerHTML = wait + '秒重新获取';
      this.setState({
        disable:true
      })
      wait--;
      setTimeout(this.getSmsCode,1000)
    }
  }

  handleClick() {
    let phone = document.getElementById('phone').value;
    console.log(is_phone(phone));
    if(is_phone(phone)) {
      console.log(this.state.show);
      this.setState({show:false});
      this.getSmsCode();
      this.fetch({phone:phone,service:'User.SendSmsCode'},'phone');
    }else {
      this.setState({show:true});
    }
  }

  handleSearch() {
    var searchOrg = document.getElementById('searchOrg').value;
    var type0 = document.getElementById('type0');

    if(searchOrg == '') {
      return;
    }
    this.fetch({query:searchOrg,service:'Organization.SearchByName'},'search')
  }

  renderSearch() {
    return (
      <div>
        <header style={{height:'5.5rem',padding:'1.5rem',backgroundColor:'#F8F8F8'}}>
          <div className='col-20'>
            <Input className='col-20' size='large' id='searchOrg' ref='searchOrg' placeholder='搜索机构'></Input>
          </div>
          <div className='col-4'>
            <Button size='large' type='primary' onClick={this.handleSearch}>搜索</Button>
          </div>
        </header>
        <content style={{padding:'0.5rem'}}>
          {this.renderSearchContent()}
        </content>
      </div>
    )
  }

  renderSearchContent() {
    const { searchContent, orgs } = this.state;
    var orgLists = '';
    window.self = this;
    //searchContent:0 初始界面，1 搜索到结果，2 没有搜索到结果
    for(let i=0;i<orgs.length;i++) {
      orgLists +=
      `
      <div class='row'>
        <hr style='opacity:0.5;margin:0 auto 1rem' />
        <div class='col-20' style='color:#666;font-size:1.5rem;margin:5px auto 1rem'>${orgs[i].name}</div>
        <div class='col-4' style='color:#666,font-size:1.5rem,margin-bottom:1rem'>
          <button type='button' class='ant-btn ant-btn-primary' onclick='window.self.hideSearchPage(String(${orgs[i].id}),${orgs[i].id})'>添加</button>
        </div>
      </div>
      `
    }

    switch (searchContent) {
      case 1:
        return (
          <Row className='col-22 col-offset-1'>
            <div className='col-24' style={{color:'#666',fontSize:'1.5rem',marginBottom:'1rem',marginTop:'5px'}}>搜索结果</div>
            <div dangerouslySetInnerHTML={{__html:orgLists}}></div>
          </Row>
        )
      case 2:
        var searchOrg = document.getElementById('searchOrg');
        return (
          <Row className='col-22 col-offset-1'>
            <div className='col-20' style={{color:'#666',fontSize:'1.5rem',marginTop:'5px'}}>未找到机构,<b>直接添加输入的机构</b></div>
            <div className='col-4'>
              <Button type='primary' onClick={this.hideSearchPage.bind(null,searchOrg,0)}>添加</Button>
            </div>
          </Row>
        )
      default:
        return (
          <Row className='col-22 col-offset-1'>
            <div className='col-24' id='type0' style={{color:'#666',fontSize:'1.5rem'}}>请在输入框内搜索机构</div>
          </Row>
        )
    }
  }

  hideSearchPage(searchOrg,orgId) {
    const { orgs } = this.state;
    let input = ReactDOM.findDOMNode(this.refs.searchOrg).childNodes[0];
    // console.log(ReactDOM.findDOMNode(this.refs.searchOrg).childNodes[0])
    // console.log(searchOrg)
    if(orgId == 0) {
      this.setState({
        search:false,
        orgValue:input.value,
        orgId:0
      })
    }else {
      for(let i=0;i<orgs.length;i++) {
        if(orgs[i].id == orgId) {
          this.setState({
            search:false,
            orgValue:orgs[i].name,
            orgId:orgId
          })
        }
      }
    }
  }

  handleSubmit(e) {
    const { credential, orgValue, orgId } = this.state;
    e.preventDefault();
    var formValue = this.props.form.getFieldsValue();
    console.log(this.props.form.getFieldsValue());
    var params = {
      service:'User.Register',
      openid:this.wxparams.openid,
      timestamp:this.wxparams.timestamp,
      nonce:this.wxparams.nonce,
      signature:this.wxparams.signature,
      nickname:this.wxparams.nickname,
      avatar:this.wxparams.avatar,
      org_name:orgValue,
      rp:formValue.rp,
      phone:formValue.phone,
      sms_code:formValue.sms_code,
      org_id:orgId,
      credential:credential
    }
    this.fetch(params,'submit');

  }

  handleImgChange(info) {
    let fileList = info.fileList;
    fileList = fileList.slice(-1);
    this.setState({ fileList });

    if (info.file.status !== 'uploading') {
      // console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      // console.log(info.file.response.data.img_url);
      message.success(`${info.file.name} 上传成功。`);
      this.setState({
        credential:info.file.response.data.img_url,
        upimgss:true
      });
      console.log('跟换后的图片地址'+this.state.credential,info.file);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} 上传失败。`);
    }
  }

  renderSignup() {
    const { fileList, disable, show, showCode, upimgss, credential } = this.state;
    const { getFieldProps } = this.props.form;
    const formItemLayout = {
     wrapperCol: { span: 20, offset:2 },
   };
   const props = {
      name: 'file',
      action: publicUrl+'/?service=File.UploadImage',
      showUploadList: false,
      accept: 'image/*',
      beforeUpload(file) {
        const isPic = file.type === 'image/jpeg' || file.type === 'image/png';
        const limitedSize = file.size < 2097152;
        if (!isPic) {
          message.error('非法的图片格式，请重新选择');
        }
        if (!limitedSize) {
          message.error('图片体积过大，请重新选择');
        }
        return isPic && limitedSize;
      },
      onChange:this.handleImgChange
    };
    return(
      <div className='signBody'>
        <div className='signTitle'>机构认证</div>
        <Form onSubmit={this.handleSubmit}>
          <FormItem >
            <div className='col-20 col-offset-2'>
              <Input style={{height:'3.5rem',marginBottom:'2rem'}}  onFocus={this.handleFacus} {... getFieldProps('org_name')} placeholder='搜索并选择机构' value={this.state.orgValue}></Input>
            </div>
          </FormItem>
          <FormItem {...formItemLayout}>
            <Input style={{height:'3.5rem',marginBottom:'2rem'}}  {... getFieldProps('rp')} placeholder='负责人姓名'></Input>
          </FormItem>
          <FormItem {...formItemLayout}>
            <Input style={{height:'3.5rem'}} id='phone' {... getFieldProps('phone')} placeholder='手机号' maxLength='11'></Input>
            <span className='spanClass' style={show ? {opacity:1} : {opacity:0}}>请输入正确的手机号</span>
          </FormItem>
          <FormItem {...formItemLayout}>
            <div className='col-16'>
              <Input className='col-16' style={{height:'3.5rem'}} {... getFieldProps('sms_code')} placeholder='请输入验证码' ></Input>
            </div>
            <Button className='col-8' style={{height:'3.5rem'}} type="primary" id='sms' disabled={disable}  onClick={this.handleClick}>获取验证码</Button>
            <span className='spanClass' style={showCode ? {opacity:1} : {opacity:0}}>请输入正确的验证码</span>
          </FormItem>
          <FormItem {...formItemLayout}>
            <div className='meitiDiv' style={{textAlign:'center'}}>
              <div style={{textAlign:'left',marginLeft:'.6rem'}}>媒体证明（机构认证图片）</div>
              { upimgss
                ?
                <div className='col-16 col-offset-4' style={{marginTop:'2rem',marginBottom:'2rem'}}>
                  <img style={{width:'200',height:'200'}} src={credential}></img>
                </div>
                :
                <div style={{ height: 140,width:'90%',margin:'2rem 5% 2rem 5%'}} >
                  <Dragger {...props} fileList={fileList}>
                    <Icon type="plus" />
                  </Dragger>
                </div>
              }
              <div style={{height:'1rem',marginBottom:'1rem'}}>&nbsp;</div>
            </div>
          </FormItem>
          <FormItem {...formItemLayout}>
              <Button className='col-24' style={{height:'3.5rem'}} type="primary" htmlType="submit">提交认证</Button>
          </FormItem>
        </Form>
      </div>
    )
  }

  render() {
    const { search } = this.state;
    return (
      <div>
        { search
          ?
          this.renderSearch()
          :
          this.renderSignup()
          // this.renderSearch()
        }
      </div>
    )
  }
};

Signup = createForm()(Signup);
export default Signup;

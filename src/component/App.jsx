import React from 'react';

import './App.less';

sessionStorage.reqMethod = 'jsonp';
sessionStorage.method = 'get';
sessionStorage.publicUrl = 'http://reprint.webei.cn/reprint/';

class App extends React.Component {
  constructor() {
    super();

  }

  render() {
    return (
      <div className='container'>
        <div>{this.props.children}</div>
      </div>
    )
  }
};

App.propTypes = {
  children: React.PropTypes.element
};

App.contextTypes = {
  title: React.PropTypes.string
};

export default App;

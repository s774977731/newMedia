module.exports = {
  path: 'enter',
  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./components/Enter'));
    });
  }
};

module.exports = {
  path: 'apply',
  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./components/Apply'));
    });
  }
};

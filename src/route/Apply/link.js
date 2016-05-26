module.exports = {
  path: 'link',
  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./components/Link'));
    });
  }
};

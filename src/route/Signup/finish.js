module.exports = {
  path: 'finish',
  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./components/SignFinish'));
    });
  }
};

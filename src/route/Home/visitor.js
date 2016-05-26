module.exports = {
  path: 'visitor',
  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./components/Visitor'));
    });
  }
};

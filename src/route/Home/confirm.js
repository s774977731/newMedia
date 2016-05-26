module.exports = {
  path: 'confirm',
  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./components/Confirm'));
    });
  }
};

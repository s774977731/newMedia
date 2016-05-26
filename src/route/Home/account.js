module.exports = {
  path: 'account',
  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./components/AccountPage'));
    });
  }
};

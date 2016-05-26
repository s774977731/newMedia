module.exports = {
  path: 'applyed',
  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./components/Applyed'));
    });
  }
};

module.exports = {
  path: 'rank',
  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./components/Rank'));
    });
  }
};

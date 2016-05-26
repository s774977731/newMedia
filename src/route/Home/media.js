module.exports = {
  path: 'media',
  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./components/MediaInfo'));
    });
  }
};

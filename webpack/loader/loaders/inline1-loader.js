function loader(source) {
  console.log('inline1-loader')
  return source + '//inline1-loader'
}
loader.pitch = function () {
  console.log('inline1-pitch')
}

module.exports = loader
function loader(source) {
  console.log('normal1-loader')
  return source + '//normal1-loader'
}
loader.pitch = function () {
  console.log('normal1-pitch')
}

module.exports = loader
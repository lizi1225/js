const envPlugin = {
  name: 'envPlugin',
  setup(build) {
    console.log(build)
    build.onResolve({ filter: /^env$/ }, args => {
      return {
        path: args.path,
        namespace: 'env-ns'
      }
    })
    
  build.onLoad({ filter: /.*/, namespace: 'env-ns' }, () => {
    return {
      contents: JSON.stringify(process.env),
      loader: 'json'
    }
  })
  }
}

require('esbuild').build({
  entryPoints: ['src/index.jsx'],
  bundle: true,
  outfile: 'bundle.js',
  plugins: [envPlugin]
})
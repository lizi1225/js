console.log(require('./rules/dead-vars').default)
module.exports = {
    rules: {
      'dead-vars': require('./rules/dead-vars').default
    },
    configs: {
      recommended: {
        plugins: ['deadvars'],
        rules: {
          'deadVars/dead-vars': 2
        }
      }
    },
};
/**
 * @fileoverview find all ununsed vars，including exports vars
 * @author dead-vars
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/dead-vars").default,
    RuleTester = require("eslint").RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();
ruleTester.run("dead-vars", rule, {
  valid: [
    // give me some code that won't trigger a warning
    {
      code: "var a = 1;console.log(a)",
    }
  ],

  invalid: [
    {
      code: "var a = 1;",
      errors: [{ message: "Fill me in.", type: "Me too" }],
    },
  ],
});

'use strict';

const { RuleTester } = require('eslint');
const rule = require('../prefer-to-be-null');

const ruleTester = new RuleTester();

ruleTester.run('prefer-to-be-null', rule, {
  valid: [
    'expect(null).toBeNull();',
    'expect(null).toEqual();',
    'expect(null).not.toBeNull();',
    'expect(null).not.toEqual();',
    'expect(null).toBe(undefined);',
    'expect(null).not.toBe(undefined);',
    'expect(null).toBe();',
    'expect(null).toMatchSnapshot();',
    'expect("a string").toMatchSnapshot(null);',
    'expect("a string").not.toMatchSnapshot();',
    "expect(something).toEqual('a string');",
    'expect(null).toBe',
  ],

  invalid: [
    {
      code: 'expect(null).toBe(null);',
      errors: [{ messageId: 'useToBeNull', column: 14, line: 1 }],
      output: 'expect(null).toBeNull();',
    },
    {
      code: 'expect(null).toEqual(null);',
      errors: [{ messageId: 'useToBeNull', column: 14, line: 1 }],
      output: 'expect(null).toBeNull();',
    },
    {
      code: 'expect("a string").not.toBe(null);',
      errors: [{ messageId: 'useToBeNull', column: 24, line: 1 }],
      output: 'expect("a string").not.toBeNull();',
    },
    {
      code: 'expect("a string").not.toEqual(null);',
      errors: [{ messageId: 'useToBeNull', column: 24, line: 1 }],
      output: 'expect("a string").not.toBeNull();',
    },
  ],
});

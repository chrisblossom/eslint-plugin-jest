'use strict';

const { RuleTester } = require('eslint');
const rule = require('../no-disabled-tests');

const ruleTester = new RuleTester({
  parserOptions: {
    sourceType: 'module',
  },
});

ruleTester.run('no-disabled-tests', rule, {
  valid: [
    'describe("foo", function () {})',
    'it("foo", function () {})',
    'describe.only("foo", function () {})',
    'it.only("foo", function () {})',
    'test("foo", function () {})',
    'test.only("foo", function () {})',
    'var appliedSkip = describe.skip; appliedSkip.apply(describe)',
    'var calledSkip = it.skip; calledSkip.call(it)',
    '({ f: function () {} }).f()',
    '(a || b).f()',
    'itHappensToStartWithIt()',
    'testSomething()',
    [
      'import { pending } from "actions"',
      '',
      'test("foo", () => {',
      '  expect(pending()).toEqual({})',
      '})',
    ].join('\n'),
    [
      'const { pending } = require("actions")',
      '',
      'test("foo", () => {',
      '  expect(pending()).toEqual({})',
      '})',
    ].join('\n'),
    [
      'test("foo", () => {',
      '  const pending = getPending()',
      '  expect(pending()).toEqual({})',
      '})',
    ].join('\n'),
    [
      'test("foo", () => {',
      '  expect(pending()).toEqual({})',
      '})',
      '',
      'function pending() {',
      '  return {}',
      '}',
    ].join('\n'),
  ],

  invalid: [
    {
      code: 'describe.skip("foo", function () {})',
      errors: [{ messageId: 'skippedTestSuite', column: 1, line: 1 }],
    },
    {
      code: 'describe["skip"]("foo", function () {})',
      errors: [{ messageId: 'skippedTestSuite', column: 1, line: 1 }],
    },
    {
      code: 'it.skip("foo", function () {})',
      errors: [{ messageId: 'skippedTest', column: 1, line: 1 }],
    },
    {
      code: 'it["skip"]("foo", function () {})',
      errors: [{ messageId: 'skippedTest', column: 1, line: 1 }],
    },
    {
      code: 'test.skip("foo", function () {})',
      errors: [{ messageId: 'skippedTest', column: 1, line: 1 }],
    },
    {
      code: 'test["skip"]("foo", function () {})',
      errors: [{ messageId: 'skippedTest', column: 1, line: 1 }],
    },
    {
      code: 'xdescribe("foo", function () {})',
      errors: [{ messageId: 'disabledSuite', column: 1, line: 1 }],
    },
    {
      code: 'xit("foo", function () {})',
      errors: [{ messageId: 'disabledTest', column: 1, line: 1 }],
    },
    {
      code: 'xtest("foo", function () {})',
      errors: [{ messageId: 'disabledTest', column: 1, line: 1 }],
    },
    {
      code: 'it("has title but no callback")',
      errors: [{ messageId: 'missingFunction', column: 1, line: 1 }],
    },
    {
      code: 'test("has title but no callback")',
      errors: [{ messageId: 'missingFunction', column: 1, line: 1 }],
    },
    {
      code: 'it("contains a call to pending", function () { pending() })',
      errors: [{ messageId: 'pendingTest', column: 48, line: 1 }],
    },
    {
      code: 'pending();',
      errors: [{ messageId: 'pending', column: 1, line: 1 }],
    },
    {
      code: 'describe("contains a call to pending", function () { pending() })',
      errors: [{ messageId: 'pendingSuite', column: 54, line: 1 }],
    },
  ],
});

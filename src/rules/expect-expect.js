'use strict';

/*
 * This implementation is adapted from eslint-plugin-jasmine.
 * MIT license, Remco Haszing.
 */

const { getDocsUrl, getNodeName } = require('./util');

module.exports = {
  meta: {
    docs: {
      url: getDocsUrl(__filename),
    },
    messages: {
      noAssertions: 'Test has no assertions',
    },
    schema: [
      {
        type: 'object',
        properties: {
          assertFunctionNames: {
            type: 'array',
            items: [{ type: 'string' }],
          },
        },
        additionalProperties: false,
      },
    ],
  },
  create(context) {
    const unchecked = [];
    const assertFunctionNames = new Set(
      context.options[0] && context.options[0].assertFunctionNames
        ? context.options[0].assertFunctionNames
        : ['expect'],
    );

    return {
      CallExpression(node) {
        const name = getNodeName(node.callee);
        if (name === 'it' || name === 'test') {
          unchecked.push(node);
        } else if (assertFunctionNames.has(name)) {
          // Return early in case of nested `it` statements.
          for (const ancestor of context.getAncestors()) {
            const index = unchecked.indexOf(ancestor);
            if (index !== -1) {
              unchecked.splice(index, 1);
              break;
            }
          }
        }
      },
      'Program:exit'() {
        unchecked.forEach(node =>
          context.report({ messageId: 'noAssertions', node }),
        );
      },
    };
  },
};

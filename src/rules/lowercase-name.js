'use strict';

const { getDocsUrl } = require('./util');

const isItTestOrDescribeFunction = node => {
  return (
    node.type === 'CallExpression' &&
    node.callee &&
    (node.callee.name === 'it' ||
      node.callee.name === 'test' ||
      node.callee.name === 'describe')
  );
};

const isItDescription = node => {
  return (
    node.arguments &&
    node.arguments[0] &&
    (node.arguments[0].type === 'Literal' ||
      node.arguments[0].type === 'TemplateLiteral')
  );
};

const testDescription = node => {
  const [firstArgument] = node.arguments;
  const { type } = firstArgument;

  if (type === 'Literal') {
    return firstArgument.value;
  }

  // `isItDescription` guarantees this is `type === 'TemplateLiteral'`
  return firstArgument.quasis[0].value.raw;
};

const descriptionBeginsWithLowerCase = node => {
  if (isItTestOrDescribeFunction(node) && isItDescription(node)) {
    const description = testDescription(node);
    if (!description[0]) {
      return false;
    }

    if (description[0] !== description[0].toLowerCase()) {
      return node.callee.name;
    }
  }
  return false;
};

module.exports = {
  meta: {
    docs: {
      url: getDocsUrl(__filename),
    },
    messages: {
      unexpectedLowercase: '`{{ method }}`s should begin with lowercase',
    },
    schema: [
      {
        type: 'object',
        properties: {
          ignore: {
            type: 'array',
            items: {
              enum: ['describe', 'test', 'it'],
            },
            additionalItems: false,
          },
        },
        additionalProperties: false,
      },
    ],
    fixable: 'code',
  },
  create(context) {
    const ignore = (context.options[0] && context.options[0].ignore) || [];
    const ignoredFunctionNames = ignore.reduce((accumulator, value) => {
      accumulator[value] = true;
      return accumulator;
    }, Object.create(null));

    const isIgnoredFunctionName = node =>
      ignoredFunctionNames[node.callee.name];

    return {
      CallExpression(node) {
        const erroneousMethod = descriptionBeginsWithLowerCase(node);

        if (erroneousMethod && !isIgnoredFunctionName(node)) {
          context.report({
            messageId: 'unexpectedLowercase',
            data: { method: erroneousMethod },
            node,
            fix(fixer) {
              const [firstArg] = node.arguments;
              const description = testDescription(node);

              const rangeIgnoringQuotes = [
                firstArg.range[0] + 1,
                firstArg.range[1] - 1,
              ];
              const newDescription =
                description.substring(0, 1).toLowerCase() +
                description.substring(1);

              return [
                fixer.replaceTextRange(rangeIgnoringQuotes, newDescription),
              ];
            },
          });
        }
      },
    };
  },
};

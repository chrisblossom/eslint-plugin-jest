import { readdirSync } from 'fs';
import { basename, join } from 'path';
import * as snapshotProcessor from './processors/snapshot-processor';

// copied from https://github.com/babel/babel/blob/56044c7851d583d498f919e9546caddf8f80a72f/packages/babel-helpers/src/helpers.js#L558-L562
/* istanbul ignore next */
function interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function importDefault(moduleName) {
  return interopRequireDefault(require(moduleName)).default;
}

const rules = readdirSync(join(__dirname, 'rules'))
  .filter(rule => rule !== '__tests__' && rule !== 'util.js')
  .map(rule => basename(rule, '.js'))
  .reduce(
    (acc, curr) =>
      Object.assign(acc, { [curr]: importDefault(`./rules/${curr}`) }),
    {},
  );
let allRules = {};
Object.keys(rules).forEach(function(key) {
  allRules[`jest/${key}`] = 'error';
});

module.exports = {
  configs: {
    all: {
      plugins: ['jest'],
      env: {
        'jest/globals': true,
      },
      rules: allRules,
    },
    recommended: {
      plugins: ['jest'],
      env: {
        'jest/globals': true,
      },
      rules: {
        'jest/no-alias-methods': 'warn',
        'jest/no-disabled-tests': 'warn',
        'jest/no-focused-tests': 'error',
        'jest/no-identical-title': 'error',
        'jest/no-jest-import': 'error',
        // 'jest/no-mocks-import': 'error',
        'jest/no-jasmine-globals': 'warn',
        'jest/no-test-prefixes': 'error',
        'jest/valid-describe': 'error',
        'jest/valid-expect': 'error',
        'jest/valid-expect-in-promise': 'error',
      },
    },
    style: {
      plugins: ['jest'],
      rules: {
        'jest/prefer-to-be-null': 'error',
        'jest/prefer-to-be-undefined': 'error',
        'jest/prefer-to-contain': 'error',
        'jest/prefer-to-have-length': 'error',
      },
    },
  },
  environments: {
    globals: {
      globals: {
        afterAll: false,
        afterEach: false,
        beforeAll: false,
        beforeEach: false,
        describe: false,
        expect: false,
        fit: false,
        it: false,
        jasmine: false,
        jest: false,
        pending: false,
        pit: false,
        require: false,
        test: false,
        xdescribe: false,
        xit: false,
        xtest: false,
      },
    },
  },
  processors: {
    '.snap': snapshotProcessor,
  },
  rules,
};

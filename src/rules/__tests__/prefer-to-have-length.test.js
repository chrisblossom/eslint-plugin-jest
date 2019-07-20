import { RuleTester } from 'eslint';
import rule from '../prefer-to-have-length';

const ruleTester = new RuleTester();

ruleTester.run('prefer-to-have-length', rule, {
  valid: [
    'expect(files).toHaveLength(1);',
    "expect(files.name).toBe('file');",
    'expect(result).toBe(true);',
    `expect(user.getUserName(5)).resolves.toEqual('Paul')`,
    `expect(user.getUserName(5)).rejects.toEqual('Paul')`,
    'expect(a);',
  ],

  invalid: [
    {
      code: 'expect(files.length).toBe(1);',
      errors: [{ messageId: 'useToHaveLength', column: 22, line: 1 }],
      output: 'expect(files).toHaveLength(1);',
    },
    {
      code: 'expect(files.length).toEqual(1);',
      errors: [{ messageId: 'useToHaveLength', column: 22, line: 1 }],
      output: 'expect(files).toHaveLength(1);',
    },
  ],
});

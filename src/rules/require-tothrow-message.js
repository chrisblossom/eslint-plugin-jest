import requireToThrowMessage from './require-to-throw-message';

const requireTothrowMessage = {
  ...requireToThrowMessage,
  meta: {
    ...requireToThrowMessage.meta,
    deprecated: true,
    replacedBy: ['require-to-throw-message'],
  },
};

export default requireTothrowMessage;

import requireToThrowMessage from './require-to-throw-message';

const replacedBy = ['require-to-throw-message'];

const requireTothrowMessage = {
  ...requireToThrowMessage,
  meta: {
    ...requireToThrowMessage.meta,
    docs: {
      ...requireToThrowMessage.meta.docs,
      replacedBy,
    },
    deprecated: true,
    replacedBy,
  },
};

export default requireTothrowMessage;

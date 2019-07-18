import requireToThrowMessage from './require-to-throw-message';

const replacedBy = ['require-to-throw-message'];

const requireTothrowMessage = Object.assign({}, requireToThrowMessage, {
  meta: Object.assign({}, requireToThrowMessage.meta, {
    deprecated: true,
    replacedBy,
    docs: Object.assign({}, requireToThrowMessage.meta.docs, { replacedBy }),
  }),
});

export default requireTothrowMessage;

import requireToThrowMessage from './require-to-throw-message';

const requireTothrowMessage = Object.assign({}, requireToThrowMessage);

requireTothrowMessage.meta.deprecated = true;
requireTothrowMessage.meta.replacedBy = ['require-to-throw-message'];
requireTothrowMessage.meta.docs.replacedBy = ['require-to-throw-message'];

export default requireTothrowMessage;

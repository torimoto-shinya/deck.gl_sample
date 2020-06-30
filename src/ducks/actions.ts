import actionCreatorFactory from 'typescript-fsa';

const actionCreator = actionCreatorFactory('@@App');

const actions = {
	init: actionCreator('INIT'),
};

export default actions;

import { AppState } from './types';
import { Action } from 'redux';
import { isType } from 'typescript-fsa';
import actions from './actions';

const initialState: AppState = {
	hoge: 'fuga',
}

export function reducer(state = initialState, action: Action): AppState {
	if (isType(action, actions.init)) {
		return {
			...state,
			hoge: 'fugafuga',
		};
	}
	return state;
}

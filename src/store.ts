import { createStore } from 'redux';
import { reducer } from './ducks/reducer';

export const store = createStore(reducer);

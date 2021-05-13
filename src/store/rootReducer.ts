import { combineReducers } from 'redux';
import { ActionType } from 'typesafe-actions';
import marketReducer from './market/market.reducer';

export interface StoreState {
  market: any;
}

const reducer = combineReducers<
  StoreState,
  ActionType<typeof import('./rootActions').default>
>({
  market: marketReducer,
});

export default reducer;

import { ActionType } from 'typesafe-actions';

export type RootAction = ActionType<
  typeof import('../store/rootActions').default
>;

declare module 'typesafe-actions' {
  interface Types {
    RootAction: RootAction;
  }
}

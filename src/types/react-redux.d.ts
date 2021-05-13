import { StoreState } from '../models/stores/store.model';

declare module 'react-redux' {
  export interface DefaultRootState extends StoreState {}
}

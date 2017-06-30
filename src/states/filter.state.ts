import { createReducer } from '@ailurus/ts-redux';
import { Filter } from 'app/models';

export interface FilterActions {
    'FILTER_SET': Filter
}

export const filter = createReducer<Filter, FilterActions>(Filter.All, {
    'FILTER_SET': (state, payload) => payload
});

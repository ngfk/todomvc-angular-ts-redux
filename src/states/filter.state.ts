import { ReducerBuilder } from '@ailurus/ts-redux';
import { Filter } from 'app/models';

export interface FilterActions {
    'FILTER_SET': Filter
}

export const filter = new ReducerBuilder<Filter, FilterActions>()
    .init(Filter.All)
    .case('FILTER_SET', (state, payload) => payload)
    .build();

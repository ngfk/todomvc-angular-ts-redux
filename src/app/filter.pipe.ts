import { Pipe, PipeTransform } from '@angular/core';
import { Todo, Filter } from 'app/models';

@Pipe({
    name: 'filter'
})
export class FilterPipe implements PipeTransform {

    public transform (todos: Todo[], filter: Filter): Todo[] {
        switch (filter) {
            case Filter.Active:
                return todos.filter(todo => !todo.completed);
            case Filter.Completed:
                return todos.filter(todo => todo.completed);
            case Filter.All:
            default:
                return todos;
        }
    }
}

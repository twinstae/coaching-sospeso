import {format} from 'date-fns/format';

export function formatDate(date: Date, formatStr: string){
    return format(date, formatStr)
}
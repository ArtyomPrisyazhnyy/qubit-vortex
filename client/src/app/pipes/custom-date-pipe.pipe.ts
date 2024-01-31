import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
    name: 'customDate',
    standalone: true
})
export class CustomDatePipe implements PipeTransform {
    transform(value: string | null): string {
        if (value === null) {
            return ''; // Вернуть пустую строку, если значение null
        }

        const currentDate = new Date();
        const questionDate = new Date(value);
        const dateDifference = currentDate.getTime() - questionDate.getTime();
        const datePipe: DatePipe = new DatePipe('en-US');

        // Проверяем разницу во времени относительно текущего времени
        if(dateDifference < 60000){
            const secondsAgo = Math.floor(dateDifference / 1000);
            return `${secondsAgo} secs ago`;

        } else if (dateDifference < 3600000) { // Менее часа назад
            const minutesAgo = Math.floor(dateDifference / 60000);
            return `${minutesAgo} ${minutesAgo === 1 ? 'min' : 'mins'} ago`;

        } else if (dateDifference < 86400000) { // Менее суток назад
            const hoursAgo = Math.floor(dateDifference / 3600000);
            return `${hoursAgo} ${hoursAgo === 1 ? 'hour' : 'hours'} ago`;

        } else if (dateDifference < 259200000) { // Менее трех дней назад
            const daysAgo = Math.floor(dateDifference / 86400000);
            return `${daysAgo} ${daysAgo === 1 ? 'day' : 'days'} ago`;

        } else { // Более трех дней назад
            const formattedDate = datePipe.transform(value, 'dd MMM');
            const formattedTime = datePipe.transform(value, 'HH:mm');
            const formattedYear = datePipe.transform(value, 'yyyy');
            let result = '';

            if (formattedYear !== currentDate.getFullYear().toString()) {
                result = formattedDate ? `${formattedDate} ${formattedYear}` : '';
            } else {
                result = formattedDate ? formattedDate : '';
            }

            if (formattedTime) {
                result += ` at ${formattedTime}`; 
            }

            return result;
        }
    }
}
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'customAdvancedDate',
    standalone: true
})
export class CustomAdvancedDatePipe implements PipeTransform {
    transform(value: string | null): string {
        if (value === null) {
            return ''; // Вернуть пустую строку, если значение null
        }

        const currentDate = new Date();
        const questionDate = new Date(value);

        // Установка времени в начало текущего дня для сравнения с датой вопроса
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        // Установка времени в начало вчерашнего дня для сравнения с датой вопроса
        const startOfYesterday = new Date(startOfToday);
        startOfYesterday.setDate(startOfYesterday.getDate() - 1);

        const daysInMonth = 30;
        const daysInYear = 365;

        // Сравнение сегодняшней даты с датой вопроса
        if (questionDate.toDateString() === currentDate.toDateString()) {
            return 'today';
        }

        // Сравнение вчерашней даты с датой вопроса
        if (questionDate.toDateString() === startOfYesterday.toDateString()) {
            return 'yesterday';
        }

        // Сравнение даты вопроса с началом сегодняшнего дня
        const differenceInDays = Math.floor((currentDate.getTime() - questionDate.getTime()) / (1000 * 3600 * 24));

        // Если вопрос задан ранее, но до месяца, возвращаем количество дней назад
        if (differenceInDays < daysInMonth) {
            return `${differenceInDays} days ago`;
        }

        // Если вопрос задан до года назад, возвращаем количество месяцев назад
        if (differenceInDays < daysInYear) {
            const monthsAgo = Math.floor(differenceInDays / daysInMonth);
            return `${monthsAgo} ${monthsAgo === 1 ? 'month' : 'months'} ago`;
        }

        // Если больше года и одного месяца, возвращаем количество лет и месяцев назад
        const yearsAgo = Math.floor(differenceInDays / daysInYear);
        const remainingMonths = Math.floor((differenceInDays % daysInYear) / daysInMonth);
        return `${yearsAgo} years and ${remainingMonths} ${remainingMonths === 1 ? 'month' : 'months'} ago`;
    }
}

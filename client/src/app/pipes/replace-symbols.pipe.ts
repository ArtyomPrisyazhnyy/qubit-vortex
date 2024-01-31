import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'replaceSymbols',
    standalone: true
})
export class ReplaceSymbolsPipe implements PipeTransform {
    transform(value: string | null): string {
        if (!value) {
            return ''; // Если значение null или undefined, вернуть пустую строку
        }

        // Заменяем все знаки "<" на "&lt;" и все знаки ">" на "&gt;"
        return value.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
}

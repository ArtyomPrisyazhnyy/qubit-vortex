import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
    name: 'blockCode',
    standalone: true
})
export class BlockCodePipe implements PipeTransform {

    constructor(private sanitizer: DomSanitizer) {}

    transform(text: string): SafeHtml {
        const replacedText = text.replace(/```([^`]+)```/g, '<span class="inlineCode">$1</span>');
        return this.sanitizer.bypassSecurityTrustHtml(replacedText);
    }

}

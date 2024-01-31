import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagsService } from '../../services/tags.service';

@Component({
    selector: 'app-tags-page',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './tags-page.component.html',
    styleUrl: './tags-page.component.scss'
})
export class TagsPageComponent implements OnInit {
    constructor(
        public tagService: TagsService
    ){}

    ngOnInit(): void {
        this.tagService.getAllTags().subscribe()
    }
}

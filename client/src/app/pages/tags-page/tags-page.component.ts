import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagsService } from '../../services/tags.service';
import { TagsCriteria } from '../../types/TagsCriteria.enum';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
    selector: 'app-tags-page',
    standalone: true,
    imports: [
        CommonModule, 
        ReactiveFormsModule,
        NgxPaginationModule
    ],
    templateUrl: './tags-page.component.html',
    styleUrl: './tags-page.component.scss'
})
export class TagsPageComponent implements OnInit, OnDestroy {
    searchData: FormGroup;

    constructor(
        public tagService: TagsService
    ){
        this.searchData = new FormGroup({
            searchTag: new FormControl<string>('' , [
                Validators.maxLength(255)
            ])
        })
    }

    tagsCriteriaValues = Object.values(TagsCriteria);

    ngOnInit(): void {
        this.tagService.getAllTags().subscribe()
    }
    ngOnDestroy(): void {
        this.tagService.updateCriteria(TagsCriteria.Popular);
        this.tagService.setSearch('')
    }

    onSubmit(): void{
        if(this.searchData.valid){
            this.tagService.setSearch(this.searchData.value.searchTag);
            this.tagService.updateCurrentPage(1);
            this.tagService.getAllTags().subscribe();
        } else {
            console.error('not valid')
        }
    }

    changeCriteria(criteria: TagsCriteria): void{
        this.tagService.updateCriteria(criteria);
        this.tagService.updateCurrentPage(1);
        this.tagService.getAllTags().subscribe()
    }

    onPageChange(page: number): void {
        this.tagService.updateCurrentPage(page);
        this.tagService.getAllTags().subscribe();
    }
}

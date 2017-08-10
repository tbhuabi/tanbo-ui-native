import { Component, Input, Output, EventEmitter } from '@angular/core';

export interface PaginationItem {
    pageIndex: number | string;
    label: number | string;
}

@Component({
    selector: 'ui-pagination',
    templateUrl: './pagination.component.html'
})
export class PaginationComponent {
    @Input()
    btnLength: number = 4;
    @Output()
    change = new EventEmitter<number>();

    @Input()
    set currentPage(currentPage: number) {
        if (!currentPage || currentPage < 1) {
            currentPage = 1;
        }
        this._currentPage = currentPage;
        this.setPaginationItems();
    }

    get currentPage() {
        return this._currentPage;
    }

    @Input()
    set pages(pages: number) {
        if (!pages || pages < 1) {
            pages = 1;
        }
        this._pages = pages;
        this.setPaginationItems();
    }

    get pages() {
        return this._pages;
    }

    pageList: Array<PaginationItem> = [];
    private _currentPage: number = 1;
    private _pages: number = 1;

    onChange(currentPage: number) {
        if (typeof currentPage === 'number') {
            this.change.emit(currentPage);
            this.currentPage = currentPage;
        }
    }

    private setPaginationItems() {
        this.pageList = [];
        if (this.pages <= 1) {
            return;
        }
        if (this.currentPage > this.pages) {
            this.currentPage = this.pages;
        }
        if (this.currentPage !== 1) {
            this.pageList.push({
                pageIndex: 1,
                label: '首页'
            });
            this.pageList.push({
                pageIndex: this.currentPage - 1,
                label: '上一页'
            });
        }

        let smallIndex = this.currentPage - this.btnLength;
        let maxIndex = this.currentPage + this.btnLength;

        if (this.currentPage < this.btnLength + 1) {
            maxIndex = maxIndex - this.currentPage + this.btnLength;
        }

        if (this.pages - this.btnLength < this.currentPage) {
            smallIndex = this.pages - this.btnLength * 2;
        }
        smallIndex = smallIndex < 1 ? 1 : smallIndex;
        maxIndex = maxIndex > this.pages ? this.pages : maxIndex;

        for (let i = smallIndex; i < maxIndex + 1; i++) {
            this.pageList.push({
                pageIndex: i,
                label: i
            });
        }
        if (this.currentPage !== this.pages) {
            this.pageList.push({
                pageIndex: this.currentPage + 1,
                label: '下一页'
            });
            this.pageList.push({
                pageIndex: this.pages,
                label: '尾页'
            });
        }
    }
}

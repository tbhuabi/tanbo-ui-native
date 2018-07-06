import { Component, OnInit } from '@angular/core';

@Component({
    templateUrl: './child1.component.html'
})
export class Child1Component implements OnInit {
    ngOnInit() {
        console.log('child1');
    }
}
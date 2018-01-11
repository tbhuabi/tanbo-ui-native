import { Component, OnInit } from '@angular/core';

@Component({
    templateUrl: './child2.component.html'
})
export class Child2Component implements OnInit {
    ngOnInit() {
        console.log('child2');
    }
}
import { Component, OnInit } from '@angular/core';

@Component({
    templateUrl: './child3.component.html'
})
export class Child3Component implements OnInit {
    ngOnInit() {
        console.log('child3');
    }
}
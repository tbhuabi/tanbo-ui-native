import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    templateUrl: './child1.component.html'
})
export class Child1Component {
    constructor(private activatedRoute: ActivatedRoute) {
        console.log(2);
        console.log(this.activatedRoute);
    }
}
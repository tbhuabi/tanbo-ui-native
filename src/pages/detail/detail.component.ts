import { Component } from '@angular/core';

@Component({
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent {
  list: any[] = [{
    text: 1,
    children: [{
      text: 11
    }, {
      text: 12
    }, {
      text: 13,
      children: [{
        text: 131
      }, {
        text: 132
      }, {
        text: 133
      }]
    }]
  }, {
    text: 2,
    children: [{
      text: 21
    }]
  }];
}
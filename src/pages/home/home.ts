import { Component } from '@angular/core';

@Component({
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class HomeComponent {
  viewIndex: number = 0;

  setIndex(n: number) {
    this.viewIndex = n;
  }
}

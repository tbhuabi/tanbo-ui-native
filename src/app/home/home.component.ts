import { Component } from '@angular/core';

const image = require('../../assets/eg.png');
const defaultImage = require('../../assets/default.jpg');

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  image = image;
  defaultImage = defaultImage;
}

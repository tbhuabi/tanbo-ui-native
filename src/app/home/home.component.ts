import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  image = '../../assets/eg.png';
  defaultImage = '../../assets/default.jpg';
  errorImage = '../../assets/error.jpg';
}

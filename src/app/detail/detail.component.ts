import { Component, OnInit } from '@angular/core';
import { ToastController } from '@tanbo/ui-native/src/lib/modal';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

  constructor(private toast: ToastController) {
  }

  ngOnInit() {
    this.toast.push({
      content: 'test'
    });
  }

}

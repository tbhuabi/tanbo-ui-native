import { Component, OnInit } from '@angular/core';
import { PickerCell } from '@tanbo/ui-native/src/lib/forms';
import { address } from './address';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  addressList: PickerCell[] = address;
  address = '';
  address1 = '';
  point = '';
  point1 = '';
  viewIndex: number = 0;
  auditList: any[] = [{
    checked: false
  }, {
    checked: false
  }, {
    checked: false
  }, {
    checked: false
  }, {
    checked: false
  }, {
    checked: false
  }];
  auditedList: any[] = [{
    checked: false
  }, {
    checked: false
  }, {
    checked: false
  }];

  setIndex(n: number) {
    this.viewIndex = n;
  }

  selectAll(dataList: any[]) {
    const b = dataList.map(item => item.checked).includes(false);
    dataList.forEach(item => item.checked = b);
  }

  selectAddress(cells: Array<PickerCell>) {
    this.address = '';
    cells.forEach(item => {
      this.address += ' ' + item.text;
    });
  }

  selectAddress1(cells: Array<PickerCell>) {
    this.address1 = '';
    cells.forEach(item => {
      this.address1 += ' ' + item.text;
    });
  }

  selectPoint(cells: Array<PickerCell>) {
    this.point = '';
    cells.forEach(item => {
      this.point += ' ' + item.text;
    });
  }

  selectPoint1(cells: Array<PickerCell>) {
    this.point1 = '';
    cells.forEach(item => {
      this.point1 += ' ' + item.text;
    });
  }

}

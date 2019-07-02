import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  subbalue: Array<any> = [];
  deptList: Array<any> = [{
    text: '技术部',
    value: 1
  },{
    text: '业务部',
    value: 2
  }];
  subdeptList: Array<any> = [{
    parentId: 1,
    children: [
      {
        text: '前端组',
        value: 10
      },
      {
        text: '中台组',
        value: 11
      }
    ]
  },
    {
      parentId: 2,
      children: [
        {
          text: '销售部',
          value: 20
        },
        {
          text: '分析部',
          value: 21
        }
      ]
    }];
  currentSubdeptList: Array<any> = [];

  deptResult: string|number = '';
  subdeptResult: string|number = '';

  deptChange(cells: Array<any>) {
    const deptId = cells[0]['value'];
    this.deptResult = cells[0]['text'];

    const currentSubdept = this.subdeptList.filter((item: any) => {
      return item.parentId === deptId;
    });
    this.currentSubdeptList = currentSubdept.length ? currentSubdept[0]['children'] : [];
    this.subdeptResult = '';
    this.subbalue = [];
  }

  subDeptChange(cells: Array<any>) {
    const id = parseInt(cells[0]['value'] + '');
    this.subdeptResult = cells.length ? cells[0]['text'] : '';
    // this.applyParams['deptId'] = id;
  }

}

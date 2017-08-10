import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppComponent } from './components/app/app.component';
import { ContentComponent } from './components/content/content.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { BackComponent } from './components/header/back/back.component';
import { ButtonComponent } from './components/header/button/button.component';
import { NavBarComponent } from './components/header/navbar/navbar.component';
import { TitleComponent } from './components/header/title/title.component';
import { PageComponent } from './components/page/page.component';
import { TabComponent } from './components/tab/tab.component';
import { TabViewComponent } from './components/tab/tab-view/tab-view.component';
import { TabViewItemComponent } from './components/tab/tab-view/tab-view-item/tab-view-item.component';
import { TabBarComponent } from './components/tab/tab-bar/tab-bar.component';
import { TabBarItemComponent } from './components/tab/tab-bar/tab-bar-item/tab-bar-item.component';
import { ViewsComponent } from './components/views/views.component';
import { ViewGroupComponent } from './components/views/view-group/view-group.component';
import { RowComponent } from './components/grid/row.component';
import { ColumnComponent } from './components/grid/column/column.component';
import { ScrollComponent } from './components/scroll/scroll.component';

import { ComponentHostDirective } from './directives/component-host.directive';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        ComponentHostDirective,

        AppComponent,
        ContentComponent,
        FooterComponent,
        HeaderComponent,
        BackComponent,
        ButtonComponent,
        NavBarComponent,
        TitleComponent,
        PageComponent,
        TabComponent,
        TabViewComponent,
        TabViewItemComponent,
        TabBarComponent,
        TabBarItemComponent,
        ViewsComponent,
        ViewGroupComponent,
        RowComponent,
        ColumnComponent,
        ScrollComponent
    ],
    exports: [
        AppComponent,
        ContentComponent,
        FooterComponent,
        HeaderComponent,
        BackComponent,
        ButtonComponent,
        NavBarComponent,
        TitleComponent,
        PageComponent,
        TabComponent,
        TabViewComponent,
        TabViewItemComponent,
        TabBarComponent,
        TabBarItemComponent,
        RowComponent,
        ColumnComponent,
        ScrollComponent
    ]
})
export class UiNativeModule {
}
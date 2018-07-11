import { NgModule } from '@angular/core';

import { ButtonsComponent } from './buttons/buttons.component';
import { ContentComponent } from './content/content.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { NavBarComponent } from './navbar/navbar.component';
import { PageComponent } from './page/page.component';
import { TitleComponent } from './title/title.component';

@NgModule({
  declarations: [
    ButtonsComponent,
    ContentComponent,
    FooterComponent,
    HeaderComponent,
    NavBarComponent,
    PageComponent,
    TitleComponent
  ],
  exports: [
    ButtonsComponent,
    ContentComponent,
    FooterComponent,
    HeaderComponent,
    NavBarComponent,
    PageComponent,
    TitleComponent
  ]
})
export class UILayoutModule {
}
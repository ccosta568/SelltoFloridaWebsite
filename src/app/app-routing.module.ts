import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TipsComponent } from './tips/tips.component';
import { AboutComponent } from './about/about.component';
import { ServicesComponent } from './services/services.component';
import { ContactComponent } from './contact/contact.component';
import { CompareComponent } from './compare/compare.component';

const routes: Routes = [
  { path: '', component: CompareComponent },
  { path: 'compare', component: CompareComponent },
  { path: 'tips', component: TipsComponent },
  { path: 'about', component: AboutComponent },
  { path: 'services', component: ServicesComponent },
  { path: 'contact', component: ContactComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }


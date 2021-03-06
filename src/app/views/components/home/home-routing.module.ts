import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoggedUserGuard } from 'src/app/shared/guards/logged-user.guard';
import { LayoutComponent } from '../layout/layout.component';
import { HomeComponent } from './home.component';

const routes: Routes = [
  {
    path: 'home',
    component: LayoutComponent,
    children: [{ path: '', component: HomeComponent }],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}

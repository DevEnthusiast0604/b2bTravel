import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './views/admin/admin.component';
import { SessionComponent } from './views/session/session.component';
import { AuthGuardService } from './views/session/auth/auth-guard.service';
import { PublicComponent } from './views/public/public.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/',
    pathMatch: 'full'
  },
  {
    path: '',
    component: PublicComponent,
    loadChildren: () => import('./views/public/public.module').then(m => m.PublicModule)
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuardService],
    loadChildren: () => import('./views/admin/admin.module').then(m => m.AdminModule)
  },
  {
    path: 'admin',
    component: SessionComponent,
    loadChildren: () => import('./views/session/session.module').then(m => m.SessionModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

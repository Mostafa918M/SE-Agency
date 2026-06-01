import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Work } from './pages/work/work';
import { Project } from './pages/project/project';
import { Studio } from './pages/studio/studio';
import { Contact } from './pages/contact/contact';
import { authGuard } from './guards/auth.guard';
import { AdminLogin } from './pages/admin/login';
import { AdminDashboard } from './pages/admin/dashboard';
import { ProjectForm } from './pages/admin/project-form';
import { NotFound } from './pages/not-found/not-found';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'work', component: Work },
  { path: 'work/:id', component: Project },
  { path: 'studio', component: Studio },
  { path: 'contact', component: Contact },
  
  // Admin Routes
  { path: 'admin/login', component: AdminLogin },
  { 
    path: 'admin/dashboard', 
    component: AdminDashboard, 
    canActivate: [authGuard] 
  },
  { 
    path: 'admin/projects/new', 
    component: ProjectForm, 
    canActivate: [authGuard] 
  },

  // 404 Route
  { path: '**', component: NotFound }
];

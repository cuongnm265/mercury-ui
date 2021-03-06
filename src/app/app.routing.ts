import { DashboardComponent } from './dashboard/dashboard.component';
import { ArticlesListComponent } from './articles-list/articles-list.component';
import { UsersListComponent } from './users-list/users-list.component';
import { UserComponent } from './user/user.component';
import { AdminComponent } from './admin/admin.component';
import { Routes } from '@angular/router';
import { ArticleComponent } from './article/article.component';
// import { AppComponent } from './app.component';
import { ArticleDetailComponent } from './article-detail/article-detail.component';
import { AuthGuard } from './auth-guard.service';
import { ArticleEditorComponent } from './articles-list/article-editor/article-editor.component';
import { LandingComponent } from './landing/landing.component';
import { TagsListComponent } from './tags-list/tags-list.component';

export const AppRoutes: Routes = [
  {
    path: '',
    redirectTo: 'news',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: LandingComponent
  },
  {
    path: 'news',
    component: UserComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: LandingComponent, },
      { path: ':categoryName', component: ArticleComponent, },
      { path: ':categoryName/:articleId', component: ArticleDetailComponent },
    ]
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'tags-list', component: TagsListComponent },
      { path: 'users-list', component: UsersListComponent },
      { path: 'articles-list', component: ArticlesListComponent },
      { path: 'articles-list/new', component: ArticleEditorComponent },
      { path: 'articles-list/:id/edit', component: ArticleEditorComponent },
    ]
  }
];

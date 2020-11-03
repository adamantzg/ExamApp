import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { MsalGuard } from '@azure/msal-angular';
import { AdminUserComponent } from './components/admin-user/admin-user.component';
import { ExamListComponent } from './components/exam/exam-list/exam-list.component';
import { ExamEditComponent } from './components/exam/exam-edit/exam-edit.component';
import { ExamSubmitComponent } from './components/exam/exam-submit/exam-submit.component';
import { ExamReviewComponent } from './components/exam/exam-review/exam-review.component';
import { ExamListUserComponent } from './components/exam/exam-list-user/exam-list-user.component';
import { ExamSubmissionsComponent } from './components/exam/exam-submissions/exam-submissions.component';
import { ExamSubmissionDetailComponent } from './components/exam/exam-submission-detail/exam-submission-detail.component';

export const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'users', component: AdminUserComponent , canActivate : [MsalGuard] },
    { path: 'exams', component: ExamListComponent, canActivate : [MsalGuard] },
    { path: 'myexams', component: ExamListUserComponent, canActivate : [MsalGuard] },
    { path: 'examsubmit', component: ExamSubmitComponent, canActivate: [MsalGuard]},
    { path: 'examsubmissions', component: ExamSubmissionsComponent, canActivate: [MsalGuard]},
    { path: 'examsubmission', component: ExamSubmissionDetailComponent, canActivate: [MsalGuard]},
    { path: 'examreview', component: ExamReviewComponent, canActivate: [MsalGuard]},
    { path: 'exam', component: ExamEditComponent, canActivate : [MsalGuard],pathMatch: 'full' },
    { path: '', redirectTo: 'home', pathMatch: 'full'}
];

export const AppRoutes = RouterModule.forRoot(routes);

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { AppRoutes } from './app.routes';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { ErrorMessageComponent } from './components/errorMessage';
import { MsalModule, MsalInterceptor } from '@azure/msal-angular';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AdminUserComponent } from './components/admin-user/admin-user.component';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { CommonAppModule } from './common.module/common.module';
import { ExamEditComponent } from './components/exam/exam-edit/exam-edit.component';
import { ExamListComponent } from './components/exam/exam-list/exam-list.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CourseService } from './services/course.service';
import { ExamTypeService, DatabaseService, ExamService, UserService, HttpService, CommonService, BlockUIService } from './services';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { QuestionEditComponent } from './components/exam/question-edit/question-edit.component';
import { QuestionEditHeaderComponent } from './components/exam/question-edit/question-edit-header/question-edit-header.component';
import { OrderModule } from 'ngx-order-pipe';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { hrLocale } from 'ngx-bootstrap/locale';
defineLocale('hr', hrLocale);

import { registerLocaleData } from '@angular/common';
import localeHr from '@angular/common/locales/hr';
import { ExamListUserComponent } from './components/exam/exam-list-user/exam-list-user.component';
import { ExamSubmitComponent } from './components/exam/exam-submit/exam-submit.component';
import { SubmitAnswerSqlComponent } from './components/exam/submit-answer-sql/submit-answer-sql.component';
import { SubmitAnswerCommandbarComponent } from './components/exam/submit-answer-commandbar/submit-answer-commandbar.component';
import { SubmitAnswerSqlResultsComponent } from './components/exam/submit-answer-sql-results/submit-answer-sql-results.component';
import { BlockUiComponent } from './components/block-ui/block-ui.component';
import { ExamReviewComponent } from './components/exam/exam-review/exam-review.component';
import { environment } from '../environments/environment';
import { ExamSubmissionsComponent } from './components/exam/exam-submissions/exam-submissions.component';
import { ExamSubmissionDetailComponent } from './components/exam/exam-submission-detail/exam-submission-detail.component';
import { AnswerLogVisualizerComponent } from './components/exam/answer-log-visualizer/answer-log-visualizer.component';
import { AnswerLogListComponent } from './components/exam/answer-log-list/answer-log-list.component';
import { QuestionService } from './services/question.service';
import { QuestionLabelComponent } from './components/exam/exam-submit/question-label/question-label.component';


// the second parameter 'fr-FR' is optional
registerLocaleData(localeHr, 'hr');

@NgModule({
    imports: [
        BrowserModule,
        AppRoutes,
        FormsModule,
        MsalModule.forRoot({
            auth : {
                clientId : '0d0c2560-ee8c-41a5-bacf-36d2434faecd',
                redirectUri: environment.redirectUri,
                authority: "https://login.microsoftonline.com/common/",
                validateAuthority: true,                
                postLogoutRedirectUri: environment.redirectUri,
                navigateToLoginRequestUrl: true
            },
            cache: {
                cacheLocation: "localStorage"                
            }            
        },
        {
          popUp: true,
          consentScopes: [
            "user.read",
            "openid",
            "profile",
            "api://0d0c2560-ee8c-41a5-bacf-36d2434faecd/access_as_user"
          ],
          unprotectedResources: ["https://www.microsoft.com/en-us/"],          
          extraQueryParameters: {}
        }),
        HttpClientModule,
        TabsModule.forRoot(),
        CommonAppModule,
        FontAwesomeModule,
        BsDatepickerModule.forRoot(),
        OrderModule,
        TimepickerModule.forRoot()
    ],

    declarations: [
        AppComponent,
        LoginComponent,
        HomeComponent,
        ErrorMessageComponent,
        AdminUserComponent,
        ExamEditComponent,
        ExamListComponent,
        QuestionEditComponent,
        QuestionEditHeaderComponent,
        ExamListUserComponent,
        ExamSubmitComponent,
        SubmitAnswerSqlComponent,
        SubmitAnswerCommandbarComponent,
        SubmitAnswerSqlResultsComponent,
        BlockUiComponent,
        ExamReviewComponent,
        ExamSubmissionsComponent,
        ExamSubmissionDetailComponent,
        AnswerLogVisualizerComponent,
        AnswerLogListComponent,
        QuestionLabelComponent
    ],
    providers: [ 
        CommonService, 
        HttpService, 
        BlockUIService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: MsalInterceptor,
            multi: true
        },
        UserService, ExamService, CourseService, ExamTypeService, DatabaseService, QuestionService
    ],
    bootstrap: [AppComponent]
})

export class AppModule { }

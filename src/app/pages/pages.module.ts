
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from "shared/shared.module";
import { AuthGuardResolve } from 'services/authguard/authguard.service';
import { ServicesModule } from 'services/services.module';
import { LayoutModule } from 'layout/layout.module';
import { DashboardLayoutComponent } from 'layout/dashboardlayout/dashboardlayout.component';
import { LoginPage } from './login/login.page';
import { RegisterPage } from './register/register.page';

import { ProjectModule } from './project/project.module';
import { ProjectResolver } from './project/project.resolver';
import { ProjectPage } from './project/list/project.page';

import { ProjectDetailService } from './projectDetail/projectDetail.service';
import { ProjectDetailPage } from './projectDetail/projectDetail.page';

import { TranslationService } from './translation/translation.service';
import { TranslationResolver } from './translation/translation.resolver';
import { TranslationPage } from './translation/translation.page';

export const routes = [
    {
        path: 'login',
        component: LoginPage,
        canActivate: [AuthGuardResolve],
    },
    {
        path: 'dashboard',
        component: DashboardLayoutComponent,
        resolve: {
            user: AuthGuardResolve
        },
        children: [
            { path: '', component: ProjectPage, pathMatch: 'full' },

            {
                path: ':projectId',
                component: ProjectDetailPage,
                pathMatch: 'full',
                resolve: {
                    project: ProjectResolver
                },
            },
            {
                path: ':projectId/:language/:namespace',
                component: TranslationPage,
                resolve: {
                    translation: TranslationResolver
                },
            },
        ]
    },
    { path: '**', redirectTo: 'login' }
    // Not found
];


@NgModule({
    imports: [
        SharedModule,
        LayoutModule,
        ProjectModule,
        RouterModule.forRoot(routes)
    ],
    declarations: [
        LoginPage,
        RegisterPage,

        ProjectDetailPage,
        TranslationPage,
    ],
    providers: [
        ProjectDetailService,
        TranslationService,
        TranslationResolver,
    ],
    exports: [
        RouterModule,
    ]
})
export class PagesModule {

}

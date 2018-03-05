import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from "shared/shared.module";

import { ProjectService } from "./project.service";
import { ProjectResolver } from "./project.resolver";

import { ProjectForm } from "./projectForm/projectForm";
import { ProjectPage } from "./list/project.page";

@NgModule({
    imports: [
        SharedModule,
    ],
    declarations: [
        ProjectForm,
        ProjectPage,
    ],
    providers: [
        ProjectService,
        ProjectResolver,
    ],
    exports: [
        ProjectPage
    ]
})
export class ProjectModule { }

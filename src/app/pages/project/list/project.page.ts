import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { Observable, Subject } from "rxjs";
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { SettingsService } from "services/settings/settings.service";
import { ProjectService } from "pages/project/project.service";

@Component({
    selector: 'app-project-page',
    templateUrl: './project.page.html',
    styleUrls: ['./project.page.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class ProjectPage implements OnInit {
    project: any = {};
    projects = [];
    selected = '';

    newModalRef;
    updateModalRef;

    pageConfig = {
        itemsPerPage: 20,
        currentPage: 1,
        totalItems: 1
    };

    constructor(
        private route: ActivatedRoute,
        public router: Router,
        private api: ProjectService,
        private modalService: BsModalService,
        private settings: SettingsService,
    ) {
        this.selected = this.settings.getStorage('projectId');
    }

    ngOnInit() {
        this.api.getProjects(1, 200).subscribe(res => {
            this.projects = res;
        })
    }

    delete(project) {
        if (!confirm('Are you sure to delete')) return;

        this.api.deleteProject(project.id).subscribe(res => {
            this.projects.splice(this.projects.indexOf(project), 1);

            if (this.selected == this.project.id) {
                this.settings.removeStorage('projectId');
                this.settings.removeStorage('projectTitle');
            }
        }, res => {
            const error = JSON.parse(res._body);
            // this.error = (error.error && error.error.message) || 'Sorry, something is wrong';
        });
    }

    create(values) {
        this.api.createProject(values).subscribe(res => {
            this.projects.push(res);
            this.newModalRef.hide();
        }, err => {
            const error = JSON.parse(err._body);
            // this.error = (error.error && error.error.message) || 'Sorry, something is wrong';
        });
    }

    showNewModal(template) {
        this.newModalRef = this.modalService.show(template);
    }

    update(values) {
        this.api.updateProject(this.project.id, {
            ...this.project,
            ...values,
        }).subscribe(res => {
            this.project.name = res.name;
            this.updateModalRef.hide();
        }, res => {
            const error = JSON.parse(res._body);
            // this.error = (error.error && error.error.message) || 'Sorry, something is wrong';
        });
    }

    showUpdateModal(template, project) {
        this.project = project;
        this.updateModalRef = this.modalService.show(template);
    }

    selectProject($event, project) {
        $event.preventDefault();
        this.settings.setStorage('projectId', project.id);
        this.settings.setStorage('projectTitle', project.title);
        this.router.navigate(['/dashboard/products']);
    }
}

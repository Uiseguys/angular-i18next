import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Observable } from 'rxjs/Observable';
import { ToasterService } from 'angular2-toaster';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { orderBy } from 'lodash';

import { TranslationService } from "./translation.service";

@Component({
    selector: 'app-translation-page',
    templateUrl: './translation.page.html',
    styleUrls: ['./translation.page.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class TranslationPage implements OnInit {
    project: any = {};
    translation: any = {};

    languages = [];
    oldResources = {}; // temp resourcfes for compare
    resources = {}; // working resources
    keys = [];

    modalRef: BsModalRef;
    form: FormGroup;
    keyForm: FormGroup;
    isCollapsed = true;

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        public router: Router,
        private api: TranslationService,
        private toasterService: ToasterService,
        private modalService: BsModalService,
    ) {
        this.form = fb.group({
            'key': ['', Validators.compose([Validators.required])],
            'value': ['', Validators.compose([Validators.required])],
        });

        this.keyForm = fb.group({
            'key': ['', Validators.compose([Validators.required])],
            'oldKey': [''],
        });
    }

    ngOnInit() {
        this.route
            .data
            .subscribe(({ translation }) => {
                this.project = translation.project;
                this.translation = translation;
                // get Languages
                this.api.getLanguages(translation.namespace, translation.projectId).subscribe(res => {
                    this.languages = res.map(item => item.language);
                });

                this.resources = JSON.parse(translation.description || '{}');
                this.oldResources = Object.assign({}, this.resources);
                this.keys = orderBy(Object.keys(this.resources));
                this.isCollapsed = this.keys.length > 0;
            });
    }

    addEntry($event) {
        $event.preventDefault();

        for (let c in this.form.controls) {
            this.form.controls[c].markAsTouched();
        }
        if (!this.form.valid) return;

        this.api.addEntry(this.translation.id, this.form.value).subscribe(res => {
            // apply changes to local variables
            const { key, value } = this.form.value;
            this.keys.unshift(key);
            this.oldResources[key] = value;
            this.resources[key] = value;

            this.toasterService.pop('success', '', 'Entry is added');
            this.form.reset({});
        }, res => {
            const error = JSON.parse(res._body);
            this.toasterService.pop('error', '', (error.error && error.error.message) || 'Sorry, something is wrong');
        });
    }

    updateEntry(key) {
        this.api.updateEntry(this.translation.id, {
            key,
            value: this.resources[key],
        }).subscribe(res => {
            this.oldResources[key] = this.resources[key];
            this.toasterService.pop('success', '', 'Entry is updated');
        }, res => {
            const error = JSON.parse(res._body);
            this.toasterService.pop('error', '', (error.error && error.error.message) || 'Sorry, something is wrong');
        });
    }

    updateKey($event) {
        $event.preventDefault();

        for (let c in this.keyForm.controls) {
            this.keyForm.controls[c].markAsTouched();
        }
        if (!this.keyForm.valid) return;

        const { key, oldKey } = this.keyForm.value;

        if (key === oldKey) {
            this.modalRef.hide();
            return;
        }

        this.api.updateKey(this.translation.id, this.keyForm.value).subscribe(res => {
            // apply changes to local variables

            this.resources[key] = this.resources[oldKey];
            this.resources[oldKey] = undefined;

            this.oldResources[key] = this.oldResources[oldKey];
            this.oldResources[oldKey] = undefined;

            // update key list
            this.keys[this.keys.indexOf(oldKey)] = key;

            this.toasterService.pop('success', '', 'Key is updated');
            this.modalRef.hide();
        }, res => {
            const error = JSON.parse(res._body);
            this.toasterService.pop('error', '', (error.error && error.error.message) || 'Sorry, something is wrong');
        });
    }

    deleteEntry(key) {
        this.api.deleteEntry(this.translation.id, key).subscribe(res => {
            // remove key from local variables
            this.oldResources[key] = undefined;
            this.resources[key] = undefined;
            this.keys.splice(this.keys.indexOf(key), 1);

            this.toasterService.pop('success', '', 'Entry is deleted');
        }, res => {
            const error = JSON.parse(res._body);
            this.toasterService.pop('error', '', (error.error && error.error.message) || 'Sorry, something is wrong');
        });
    }

    openKeyModal(key, template) {
        this.keyForm.reset({
            key,
            oldKey: key,
        });
        this.modalRef = this.modalService.show(template);
    }
}

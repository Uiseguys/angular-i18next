import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'projectForm',
    templateUrl: './projectForm.html',
})
export class ProjectForm implements OnInit, OnChanges {
    form: FormGroup;
    error = '';

    @Input('isCreate') isCreate: boolean = true;
    @Input('initialValue') initialValue: any = {};

    @Output()
    onSubmit: EventEmitter<any> = new EventEmitter();

    constructor(
        private fb: FormBuilder,
    ) {
        this.form = fb.group({
            'name': ['', Validators.compose([Validators.required])],
        });
    }

    ngOnInit() {

    }

    ngOnChanges(changes: SimpleChanges): void {
        if (!changes.initialValue || !changes.initialValue.previousValue || !this.initialValue
            || changes.initialValue.previousValue.id !== this.initialValue.id) {
            this.form.controls['name'].setValue(this.initialValue.name);
        }
    }

    handleSubmit($event) {
        $event.preventDefault();

        for (let c in this.form.controls) {
            this.form.controls[c].markAsTouched();
        }

        if (!this.form.valid) return;

        this.onSubmit.emit(this.form.value);
    }
}

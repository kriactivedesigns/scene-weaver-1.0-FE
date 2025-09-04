import { Component, input, output } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { ProjectMetadata } from "../../models/project-metadata.model";

@Component({
    selector: 'new-project-popup',
    templateUrl: './new-project-popup.html',
    styleUrl: './new-project-popup.scss',
    imports: [
        ReactiveFormsModule
    ]
})
export class NewProjectPopup {
    open = input.required<boolean>();
    openChange = output<boolean>();
    onProjectCreate = output<ProjectMetadata>();

    public form = new FormGroup({
        projectName: new FormControl('', [
            Validators.required,
            Validators.minLength(5)
        ]),
        width: new FormControl<number | null>(1920, [
            Validators.required,
            Validators.maxLength(5)
        ]),
        height: new FormControl<number | null>(1080, [
            Validators.required,
            Validators.maxLength(5)
        ]),
        unit: new FormControl('px', [
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(2),
        ]),
        description: new FormControl('', [
            Validators.required,
            Validators.minLength(8)
        ])
    })

    get projectName() { return this.form.get('projectName'); }
    get width() { return this.form.get('width'); }
    get height() { return this.form.get('height'); }
    get unit() { return this.form.get('unit'); }
    get description() { return this.form.get('description'); }

    onSubmit() {
        if (!this.form.valid) {
            this.form.markAllAsTouched();
            return;
        }
        const project: ProjectMetadata = {
            projectName: this.projectName?.value || '',
            width: this.width?.value || 0,
            height: this.height?.value || 0,
            unit: this.unit?.value || '',
            description: this.description?.value || '',
        }
        this.form.reset();
        this.onProjectCreate.emit(project);
    }
    
    close() {
        this.form.reset();
        this.openChange.emit(false);
    }
    
}
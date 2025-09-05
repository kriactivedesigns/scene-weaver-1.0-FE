import { Component, inject, input, OnInit, output } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { ProjectMetadata } from "../../models/project-metadata.model";

@Component({
    selector: 'new-project-popup',
    templateUrl: './new-project-popup.html',
    styleUrl: './new-project-popup.scss',
    imports: [
        ReactiveFormsModule
    ]
})
export class NewProjectPopup implements OnInit {
    open = input.required<boolean>();
    openChange = output<boolean>();
    onProjectCreate = output<ProjectMetadata>();

    public form! : FormGroup;
    private fb = inject(FormBuilder);

    ngOnInit(): void {
        this.form = this.fb.group({
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
    }

    onSubmit() {
        if (!this.form.valid) {
            this.form.markAllAsTouched();
            return;
        }
        const project: ProjectMetadata = {
            id: '',
            projectName: this.form.value.projectName || '',
            width: this.form.value.width || 0,
            height: this.form.value.height || 0,
            unit: this.form.value.unit || '',
            description: this.form.value.description || '',
        }
        this.form.reset();
        this.onProjectCreate.emit(project);
    }
    
    close() {
        this.form.reset();
        this.openChange.emit(false);
    }
    
}
import { Component, inject, input, OnInit, output } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { ProjectMetadataModel } from "../../models/project-metadata.model";

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
    onProjectCreate = output<Partial<ProjectMetadataModel>>();

    public form! : FormGroup;
    private fb = inject(FormBuilder);

    ngOnInit(): void {
        this.form = this.fb.group({
            projectName: new FormControl('', [
                Validators.required,
                Validators.minLength(5)
            ]),
            aspectRatio: new FormControl<number | null>(1080, [
                Validators.required,
                Validators.maxLength(5)
            ]),
            visualStyle: new FormControl<number | null>(1080, [
                Validators.required,
                Validators.maxLength(5)
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
        const project: Partial<ProjectMetadataModel> = {
            id: '',
            projectName: this.form.value.projectName,
            aspectRatio: this.form.value.aspectRatio,
            visualStyle: this.form.value.aspectRatio,
            description: this.form.value.description,
        }
        this.form.reset();
        this.onProjectCreate.emit(project);
    }
    
    close() {
        this.form.reset();
        this.openChange.emit(false);
    }
    
}
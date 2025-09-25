import { Component, computed, effect, inject, input, output, signal } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { WorldModel } from "../../models/world.model";
import { CommonService } from "../../services/common.service";
import { RealmState } from "../../state/realm.state";
import { IconButton } from "../icon-button/icon-button";

@Component({
    selector: 'new-world-popup',
    templateUrl: './new-world-popup.html',
    styleUrl: './new-world-popup.scss',
    imports: [
        ReactiveFormsModule,
        IconButton
    ]
})
export class NewWorldPopup {

    private readonly realmState = inject(RealmState);
    private readonly commonService = inject(CommonService);
    private fb = inject(FormBuilder);
    form : FormGroup = this.fb.group({
        name: new FormControl('', [
            Validators.required,
            Validators.minLength(5)
        ]),
        description: new FormControl('', [
            Validators.required,
            Validators.minLength(8)
        ]),
        prompt: new FormControl('', [
            Validators.minLength(8)
        ])
    });
    open = input.required<boolean>();
    onclose = output<void>();
    oncreate = output<WorldModel>();
    world = input<WorldModel | null>();
    imageUrl = computed<string>(() => {
        const path = `http://127.0.0.1:8000${this.world()?.imagePath}?timestamp=${new Date().getTime()}`
        return path
    })
    
    height: number = 300;
    width = computed(() => {
        return this.commonService.updateWidth(this.height, "16:9");
    });


    constructor() {
        effect(() => {
            this.form.patchValue({ 
                name: this.world()?.name, 
                description: this.world()?.description,
                prompt: ''
            })
        })
    }

    onSubmit() {
        const id = this.world()?.id;
        if (id) {
            this.realmState.updateWorld({
                id: id,
                name: this.form.value.name,
                description: this.form.value.description
            })
        } else {
            this.realmState.addWorld({
                name: this.form.value.name,
                description: this.form.value.description
            }).then(wrld => this.oncreate.emit(wrld))
        }
    }
    
    onGenerateImage() {
        if (!this.world())
            return

        const worldId = this.world()?.id;
        const prompt = this.form.value.prompt;

        if (!worldId || !prompt)
            return

        this.realmState.generateWorldImage(worldId, prompt)
    }
    
    close() {
        this.form.reset();
        this.onclose.emit();
    }
    
}
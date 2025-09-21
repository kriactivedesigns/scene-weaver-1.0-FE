import { Component, computed, effect, inject, input, output } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { WorldModel } from "../../models/world.model";
import { CommonService } from "../../services/common.service";
import { RealmState } from "../../state/realm.state";

@Component({
    selector: 'new-world-popup',
    templateUrl: './new-world-popup.html',
    styleUrl: './new-world-popup.scss',
    imports: [
        ReactiveFormsModule
    ]
})
export class NewWorldPopup {

    private readonly realmState = inject(RealmState);
    private readonly commonService = inject(CommonService);
    open = input.required<boolean>();
    onclose = output<void>();
    onimagegenerate = output<WorldModel>();
    
    worldId = input<string | null>();
    world = computed<WorldModel | undefined>(() => {
        const data = this.worldId();
        if (!data)
            return
        const world = this.realmState.getWorldById(data);
        if (!world)
            return

        this.form.setValue({ 
            name: world.name, 
            description: world.description
        })
        return world
    })
    imageUrl = computed<string>(() => {
        const path = `http://127.0.0.1:8000${this.world()?.imagePath}?timestamp=${new Date().getTime()}`
        return path
    })
    
    height: number = 150;
    width = computed(() => {
        this.height = 150;
        return this.commonService.updateWidth(this.height, "16:9");
    });

    private fb = inject(FormBuilder);
    public form : FormGroup = this.fb.group({
        name: new FormControl('', [
            Validators.required,
            Validators.minLength(5)
        ]),
        description: new FormControl('', [
            Validators.required,
            Validators.minLength(8)
        ])
    });

    onSubmit() {
        if (this.world()) {
            this.realmState.updateWorld({
                name: this.form.value.name,
                description: this.form.value.description
            })
        } else {
            this.realmState.addWorld({
                name: this.form.value.name,
                description: this.form.value.description
            }).then(value => {
                this.onimagegenerate.emit(value);
            })
        }
        const currentId = this.worldId();
        const prompt = this.form.value.description;
        if (currentId && prompt) {
            this.onGenerateImage(currentId, prompt)
        }
    }
    
    onGenerateImage(worldId: string | null = null, prompt: string) {
        if (worldId) {
            this.realmState.generateWorldImage(worldId, prompt)
        }
    }
    
    close() {
        this.onclose.emit();
    }
    
}
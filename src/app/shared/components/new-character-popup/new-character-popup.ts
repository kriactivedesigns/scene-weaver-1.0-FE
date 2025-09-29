import { Component, computed, effect, inject, input, output, signal } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { CharacterModel } from "../../models/character.model";
import { CommonService } from "../../services/common.service";
import { RealmState } from "../../state/realm.state";
import { IconButton } from "../icon-button/icon-button";

@Component({
    selector: 'new-character-popup',
    templateUrl: './new-character-popup.html',
    styleUrl: './new-character-popup.scss',
    imports: [
        ReactiveFormsModule,
        IconButton
    ]
})
export class NewCharacterPopup {

    private readonly realmState = inject(RealmState);
    private readonly commonService = inject(CommonService);
    private fb = inject(FormBuilder);
    form : FormGroup = this.fb.group({
        name: new FormControl('', [
            Validators.required,
            Validators.minLength(3)
        ]),
        description: new FormControl('', [
            Validators.required,
            Validators.minLength(8)
        ]),
        prompt: new FormControl('', [
            Validators.minLength(8)
        ])
    });;
    open = input.required<boolean>();
    onclose = output<void>();
    oncreate = output<CharacterModel>();
    character = input<CharacterModel | null>();
    imageUrl = computed<string>(() => {
        const path = `${this.character()?.imagePath}?timestamp=${new Date().getTime()}`
        return path
    })

    height: number = 400;
    width = computed(() => {
        return this.commonService.updateWidth(this.height, "3:4");
    });

    constructor() {
        effect(() => {
            this.form.patchValue({
                name: this.character()?.name,
                description: this.character()?.description,
                prompt: ''
            })
        })
    }

    onSubmit() {
        const id = this.character()?.id;
        if (id) {
            this.realmState.updateCharacter({
                id: id,
                name: this.form.value.name,
                description: this.form.value.description
            })
        } else {
            this.realmState.addCharacter({
                name: this.form.value.name,
                description: this.form.value.description
            }).then(char => this.oncreate.emit(char))
        }
    }

    onGenerateImage() {
        if (!this.character())
            return

        const characterId = this.character()?.id;
        const prompt = this.form.value.prompt;

        if (!characterId || !prompt)
            return

        this.realmState.generateCharacterImage(characterId, prompt)
    }

    close() {
        this.form.reset();
        this.onclose.emit();
    }
    
}
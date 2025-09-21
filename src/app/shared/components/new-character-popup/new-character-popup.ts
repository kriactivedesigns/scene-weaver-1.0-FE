import { Component, computed, effect, inject, input, output } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { CharacterModel } from "../../models/character.model";
import { CommonService } from "../../services/common.service";
import { RealmState } from "../../state/realm.state";

@Component({
    selector: 'new-character-popup',
    templateUrl: './new-character-popup.html',
    styleUrl: './new-character-popup.scss',
    imports: [
        ReactiveFormsModule
    ]
})
export class NewCharacterPopup {

    private readonly realmState = inject(RealmState);
    private readonly commonService = inject(CommonService);
    open = input.required<boolean>();
    onclose = output<void>();
    onimagegenerate = output<CharacterModel>();

    characterId = input<string | null>();
    character = computed<CharacterModel | undefined>(() => {
        const data = this.characterId();
        if (!data)
            return
        const character = this.realmState.getCharacterById(data);
        if (!character)
            return

        this.form.setValue({ 
            name: character.name, 
            description: character.description
        })
        return character;
    })
    imageUrl = computed<string>(() => {
        const path = `http://127.0.0.1:8000${this.character()?.imagePath}?timestamp=${new Date().getTime()}`
        return path
    })

    height: number = 150;
    width = computed(() => {
        this.height = 150;
        return this.commonService.updateWidth(this.height, "4:5");
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
        if (this.character()) {
            this.realmState.updateCharacter({
                name: this.form.value.name,
                description: this.form.value.description
            })
        } else {
            this.realmState.addCharacter({
                name: this.form.value.name,
                description: this.form.value.description
            }).then(value => {
                this.onimagegenerate.emit(value);
            })
        }
        const currentId = this.characterId();
        const prompt = this.form.value.description;
        if (currentId && prompt) {
            this.onGenerateImage(currentId, prompt)
        }
    }

    onGenerateImage(characterId: string | null = null, prompt: string) {
        if (characterId) {
            this.realmState.generateCharacterImage(characterId, prompt)
        }
    }

    close() {
        this.onclose.emit();
    }
    
}
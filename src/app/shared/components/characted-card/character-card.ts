import { Component, inject, input, OnInit, output } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Character } from "../../models/character.model";

@Component({
    selector: 'character-card',
    templateUrl: 'character-card.html',
    styleUrl: 'character-card.scss',
    imports: [
        ReactiveFormsModule
    ]
})
export class CharacterCard implements OnInit {

    character = input<Character>();
    ondelete = output<string>();
    onsubmit = output<Partial<Character>>();

    private fb = inject(FormBuilder);

    public form!: FormGroup;

    ngOnInit(): void {
        this.form = this.fb.group({
            characterName: new FormControl(this.character()?.characterName, [
                Validators.required,
                Validators.minLength(3)
            ]),
            characterAge: new FormControl(this.character()?.age, [
                Validators.required,
                Validators.minLength(2)
            ]),
            characterHeight: new FormControl(this.character()?.height, [
                Validators.required,
                Validators.minLength(1)
            ]),
            characterAppearance: new FormControl(this.character()?.appearanceDescription, [
                Validators.required,
                Validators.minLength(5)
            ]),
            characterDescription: new FormControl(this.character()?.description, [
                Validators.required,
                Validators.minLength(5)
            ]),
        })
    }

    onSubmit() {
        const _character: Partial<Character> = {
            ...this.character(),
            characterName: this.form.value.characterName,
            age: this.form.value.age,
            height: this.form.value.height,
            appearanceDescription: this.form.value.appearanceDescription,
            description: this.form.value.description
        }
        this.onsubmit.emit(_character);
    }
    
    delete() {
        const id = this.character()?.id;
        if(id)
            this.ondelete.emit(id);
    }
    
}
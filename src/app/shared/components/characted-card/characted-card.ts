import { Component, computed, effect, inject, input, OnInit, output } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { CharacterModel } from "../../models/character.model";
import { IconButton } from "../icon-button/icon-button";
import { CommonService } from "../../services/common.service";

@Component({
    selector: 'character-card',
    templateUrl: 'characted-card.html',
    styleUrl: 'characted-card.scss',
    imports: [
    ReactiveFormsModule,
    IconButton
]
})
export class CharacterCard implements OnInit {

    commonService = inject(CommonService);
    
    character = input<CharacterModel>();
    imageUrl = computed(() => `${this.character()?.imagePath}?timestamp=${new Date().getTime()}`);
    ondelete = output<string>();
    onedit = output<string>();
    calculatedWidth: number = 0;
    height: number = 200;
    aspectRatio = input<string>('3:4');

    private fb = inject(FormBuilder);

    public form!: FormGroup;

    constructor() {
        effect(() => {
            this.calculatedWidth = this.commonService.updateWidth(this.height, this.aspectRatio())
        })
    }

    ngOnInit(): void {
        this.form = this.fb.group({
            characterName: new FormControl(this.character()?.name, [
                Validators.required,
                Validators.minLength(3)
            ]),
            characterDescription: new FormControl(this.character()?.description, [
                Validators.required,
                Validators.minLength(5)
            ]),
        })
    }
    
    deleteCharacter() {
        const id = this.character()?.id;
        if(id)
            this.ondelete.emit(id);
    }

    editItem() {
        const id = this.character()?.id;
        if(id)
            this.onedit.emit(id);
    }
    
}
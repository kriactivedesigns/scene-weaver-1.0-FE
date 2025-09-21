import { Component, computed, effect, inject, input, OnInit, output } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { CharacterModel } from "../../models/character.model";
import { IconButton } from "../icon-button/icon-button";
import { CommonService } from "../../services/common.service";
import { WorldModel } from "../../models/world.model";

@Component({
    selector: 'world-card',
    templateUrl: 'world-card.html',
    styleUrl: 'world-card.scss',
    imports: [
    ReactiveFormsModule,
    IconButton
]
})
export class WorldCard implements OnInit {

    commonService = inject(CommonService);
    
    world = input<WorldModel>();
    imageUrl = computed(() => `http://127.0.0.1:8000${this.world()?.imagePath}?timestamp=${new Date().getTime()}`);
    ondelete = output<string>();
    onedit = output<string>();
    calculatedWidth: number = 0;
    height: number = 200;
    aspectRatio = input<string>('4:5');

    private fb = inject(FormBuilder);

    public form!: FormGroup;

    constructor() {
        effect(() => {
            this.calculatedWidth = this.commonService.updateWidth(this.height, this.aspectRatio())
        })
    }

    ngOnInit(): void {
        this.form = this.fb.group({
            worldName: new FormControl(this.world()?.name, [
                Validators.required,
                Validators.minLength(3)
            ]),
            worldDescription: new FormControl(this.world()?.description, [
                Validators.required,
                Validators.minLength(5)
            ]),
        })
    }
    
    deleteWorld() {
        const id = this.world()?.id;
        if(id)
            this.ondelete.emit(id);
    }

    editItem() {
        const id = this.world()?.id;
        if(id)
            this.onedit.emit(id);
    }
    
}
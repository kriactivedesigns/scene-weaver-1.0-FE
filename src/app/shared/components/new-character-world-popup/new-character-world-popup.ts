import { Component, computed, effect, inject, input, OnInit, output } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Character } from "../../models/character.model";
import { World } from "../../models/world.model";
import { CommonService } from "../../services/common.service";

export type PopupTypes = 'character' | 'world';
export type PopupMethods = 'add' | 'update';

@Component({
    selector: 'new-character-world-popup',
    templateUrl: './new-character-world-popup.html',
    styleUrl: './new-character-world-popup.scss',
    imports: [
        ReactiveFormsModule
    ]
})
export class NewCharacterWorld implements OnInit {

    commonService = inject(CommonService);
    
    type = input.required<PopupTypes>();
    method = input.required<PopupMethods>();
    open = input.required<boolean>();
    openChange = output<boolean>();
    oncreate = output<Partial<Character> | Partial<World>>();
    ongenerate = output<Partial<Character> | Partial<World>>();
    data = input<any>();

    height: number = 0;
    width = computed(() => {
        if(this.type() === 'character') {
            this.height = 200;
            return this.commonService.updateWidth(this.height, "4:5");
        } else {
            this.height = 150;
            return this.commonService.updateWidth(this.height, "16:9");
        }
    });

    public form! : FormGroup;
    private fb = inject(FormBuilder);

    constructor() {
        effect(() => {
            if (this.data()) {{
                this.form.setValue({ 
                    name: this.data().name, 
                    description: this.data().description
                })
            }}
        })
    }

    ngOnInit(): void {
        this.form = this.fb.group({
            name: new FormControl(this.data()?.name ? this.data.name : '', [
                Validators.required,
                Validators.minLength(5)
            ]),
            description: new FormControl(this.data()?.description ? this.data()?.description : '', [
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

        this.oncreate.emit(this.getData());
    }

    onGenerate() {
        if (!this.form.valid) {
            this.form.markAllAsTouched();
            return;
        }

        this.ongenerate.emit(this.getData());
    }

    private getData(): Partial<Character | World> {
        const newData: Partial<Character | World> = {};
        if (this.data()) {
            Object.assign(newData, {...this.data()})
        }
        Object.assign(newData, {
            name: this.form.value.name,
            description: this.form.value.description
        })
        return newData;
    }
    
    close() {
        this.form.reset();
        this.openChange.emit(false);
    }
    
}
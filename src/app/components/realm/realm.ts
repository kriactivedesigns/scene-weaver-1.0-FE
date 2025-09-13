import { Component, computed, signal } from "@angular/core";
import { BaseComponent } from "../../shared/components/base-component/base-component";
import { Pages } from "../../shared/enums/pages.enum";
import { CharacterWorldCard } from "../../shared/components/characted-world-card/characted-world-card";
import { Character } from "../../shared/models/character.model";
import { IconButton } from "../../shared/components/icon-button/icon-button";
import { NewCharacterWorld, PopupMethods, PopupTypes } from "../../shared/components/new-character-world-popup/new-character-world-popup";
import { World } from "../../shared/models/world.model";

type Types = 'character' | 'world'
@Component({
    selector: 'app-realm',
    templateUrl: './realm.html',
    styleUrls: ['./realm.scss'],
    standalone: true,
    imports: [
        CharacterWorldCard,
        IconButton,
        NewCharacterWorld
    ]
})
export class Realm extends BaseComponent {

    popupType = signal<PopupTypes>('character');
    popupMethod = signal<PopupMethods>('add');
    isPopupOpen = signal<boolean>(false);
    popupData = signal<Partial<Character | World | null>>(null)
    
    navigateToNextPage() {
        this.goTo(Pages.Canvas);
    }
   
    onCreate(data: Partial<Character | World>) {
        if (this.popupMethod() === 'add') {
            console.log('add create', data)
        } else if (this.popupMethod() === 'update') {
            console.log('update create', data)
            if (data.projectId && data.id) {
                this.realmState.updateCharacter(data.id, data)
            this.isPopupOpen.set(false);
        } 
        }
    }

    onGenerate(data: Partial<Character | World>) {
        this.generateCharacterImage(data);
    }

    deleteCharacter(id: string) {
        this.realmState.deleteCharacter(id)
    }
    
    openPopup(type: PopupTypes, method: PopupMethods, data: Character | World | null = null) {
        this.popupType.set(type);
        this.popupMethod.set(method);
        this.popupData.set(data);
        this.isPopupOpen.set(true);
    }
    
    handlePopupOpenChange(value: boolean) {
        this.popupData.set(null);
        this.isPopupOpen.set(value);
    }
    
    private generateCharacterImage(character: Partial<Character>) {
        Object.assign(character, { imagePath: 'https://picsum.photos/200/400' })
        this.popupData.update(() => {
            return character;
        })
    }
    
    private generateWorldImage(character: Partial<World>) {
        console.log(character)
    }
}
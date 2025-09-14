import { Component, computed, signal } from "@angular/core";
import { BaseComponent } from "../../shared/components/base-component/base-component";
import { Pages } from "../../shared/enums/pages.enum";
import { CharacterWorldCard } from "../../shared/components/characted-world-card/characted-world-card";
import { CharacterModel } from "../../shared/models/character.model";
import { IconButton } from "../../shared/components/icon-button/icon-button";
import { NewCharacterWorld, PopupMethods, PopupTypes } from "../../shared/components/new-character-world-popup/new-character-world-popup";
import { WorldModel } from "../../shared/models/world.model";

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
    popupData = signal<Partial<CharacterModel | WorldModel | null>>(null)
    
    navigateTo(page: Pages) {
        this.goTo(page);
    }

    onCreate(data: any) {
        switch(this.popupType()) {
            case 'character': 
                if (this.popupMethod() === 'add')
                    this.createCharacter(data);
                else 
                    this.updateCharacter(data);
                break;
            case 'world': 
                if (this.popupMethod() === 'add')
                    this.createworld(data);
                else 
                    this.updateworld(data);
                break;
        }
    }
   
    deleteCharacter(id: string) {
        this.realmState.deleteCharacter(id)
    }
    
    deleteWorld(id: string) {
        this.realmState.deleteWorld(id)
    }
    
    openPopup(type: PopupTypes, method: PopupMethods, data: CharacterModel | WorldModel | null = null) {
        this.popupType.set(type);
        this.popupMethod.set(method);
        this.popupData.set(data);
        this.isPopupOpen.set(true);
    }
    
    handlePopupOpenChange(value: boolean) {
        this.popupData.set(null);
        this.isPopupOpen.set(value);
    }

    onGenerate(data: Partial<CharacterModel | WorldModel>) {
        if (this.popupType() == 'character') {
            this.generateCharacterImage(data);
        } else if (this.popupType() == 'world') {
            this.generateWorldImage(data);
        }
    }

    private createCharacter(data: Omit<CharacterModel, 'id'>) {
        this.realmState.addCharacter(data);
        this.isPopupOpen.set(false);
    }
    
    private updateCharacter(data: Partial<CharacterModel>) {
        if (!data.projectId || !data.id)
            return
        this.realmState.updateCharacter(data.id, data);
        this.isPopupOpen.set(false);
    }
    
    private createworld(data: Omit<WorldModel, 'id'>) {
        this.realmState.addWorld(data);
        this.isPopupOpen.set(false);
    }
    
    private updateworld(data: Partial<WorldModel>) {
        if (!data.projectId || !data.id)
            return
        this.realmState.updateWorld(data.id, data);
        this.isPopupOpen.set(false);
    }

    private generateCharacterImage(character: Partial<CharacterModel>) {
        Object.assign(character, { imagePath: 'https://picsum.photos/200/400' })
        this.popupData.update(() => {
            return character;
        })
    }
    
    private generateWorldImage(world: Partial<WorldModel>) {
        Object.assign(world, { imagePath: 'https://picsum.photos/200/500' })
        this.popupData.update(() => {
            return world;
        })
    }

}
import { Component, computed, OnInit, signal } from "@angular/core";
import { BaseComponent } from "../../shared/components/base-component/base-component";
import { Pages } from "../../shared/enums/pages.enum";
import { CharacterCard } from "../../shared/components/characted-card/characted-card";
import { CharacterModel } from "../../shared/models/character.model";
import { IconButton } from "../../shared/components/icon-button/icon-button";
import { WorldModel } from "../../shared/models/world.model";
import { NewWorldPopup } from "../../shared/components/new-world-popup/new-world-popup";
import { NewCharacterPopup } from "../../shared/components/new-character-popup/new-character-popup";
import { WorldCard } from "../../shared/components/world-card/world-card";

@Component({
    selector: 'app-realm',
    templateUrl: './realm.html',
    styleUrls: ['./realm.scss'],
    standalone: true,
    imports: [
    CharacterCard,
    IconButton,
    NewWorldPopup,
    NewCharacterPopup,
    WorldCard
]
})
export class Realm extends BaseComponent implements OnInit {

    isCharacterPopupOpen = signal<boolean>(false);
    isWorldPopupOpen = signal<boolean>(false);
    openedCharacter = signal<CharacterModel | null>(null)
    openedWorld = signal<WorldModel | null>(null)

    ngOnInit(): void {
        this.realmState.getProjectCharacters()
        this.realmState.getProjectWorlds()
    }
    
    navigateTo(page?: Pages) {
        if (!page)
            return
        this.goTo(page);
    }
   
    deleteCharacter(id: string) {
        this.realmState.deleteCharacter(id)
    }
    
    openCharacterPopup(character: CharacterModel | null = null) {
        this.openedCharacter.set(character);
        this.isCharacterPopupOpen.set(true);
    }
    
    onCharacterPopupClose() {
        this.openedCharacter.set(null);
        this.isCharacterPopupOpen.set(false);
    }

    onCharacterCreateOrUpdate(character: CharacterModel) {
        this.openedCharacter.set(character);
    }
    
    deleteWorld(id: string) {
        this.realmState.deleteWorld(id)
    }
    
    openWorldPopup(world: WorldModel | null = null) {
        this.openedWorld.set(world);
        this.isWorldPopupOpen.set(true);
    }

    onWorldPopupClose() {
        this.openedWorld.set(null);
        this.isWorldPopupOpen.set(false);
    }

    onWorldCreate(world: WorldModel) {
        this.openedWorld.set(world);
    }

}
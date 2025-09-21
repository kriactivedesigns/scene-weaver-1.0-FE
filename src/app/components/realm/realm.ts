import { Component, computed, effect, OnInit, signal } from "@angular/core";
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
    characterId = signal<string | null>(null)
    worldId = signal<string | null>(null)

    ngOnInit(): void {
        const pid = this.projectState.openedProjectId();
        if (pid) {
            this.realmState.getCharactersByProjectId(pid)
            this.realmState.getWorldsByProjectId(pid)
        }
    }
    
    navigateTo(page: Pages) {
        this.goTo(page);
    }
   
    deleteCharacter(id: string) {
        this.realmState.deleteCharacter(id)
    }
    
    deleteWorld(id: string) {
        this.realmState.deleteWorld(id)
    }
    
    openCharacterPopup(characterId: string | null = null) {
        this.characterId.set(characterId);
        this.isCharacterPopupOpen.set(true);
    }
    
    openWorldPopup(worldId: string | null = null) {
        this.worldId.set(worldId);
        this.isWorldPopupOpen.set(true);
    }

    onWorldPopupClose() {
        this.worldId.set(null);
        this.isWorldPopupOpen.set(false);
    }

    onCharacterPopupClose() {
        this.characterId.set(null);
        this.isCharacterPopupOpen.set(false);
    }
    
    generateCharacterImage(character: CharacterModel) {
        this.characterId.set(character.id);
    }
    
    generateWorldImage(world: WorldModel) {
        this.worldId.set(world.id);
    }

}
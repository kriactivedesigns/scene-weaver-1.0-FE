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
    character = signal<CharacterModel | null>(null)
    world = signal<WorldModel | null>(null)

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
    
    openCharacterPopup(character: CharacterModel | null = null) {
        this.character.set(character);
        this.isCharacterPopupOpen.set(true);
    }
    
    onCharacterPopupClose() {
        this.character.set(null);
        this.isCharacterPopupOpen.set(false);
    }

    onCharacterCreate(character: CharacterModel) {
        this.character.set(character);
    }
    
    deleteWorld(id: string) {
        this.realmState.deleteWorld(id)
    }
    
    openWorldPopup(world: WorldModel | null = null) {
        this.world.set(world);
        this.isWorldPopupOpen.set(true);
    }

    onWorldPopupClose() {
        this.world.set(null);
        this.isWorldPopupOpen.set(false);
    }

    onWorldCreate(world: WorldModel) {
        this.world.set(world);
    }

}
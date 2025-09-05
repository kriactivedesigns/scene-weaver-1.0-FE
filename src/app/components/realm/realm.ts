import { Component, computed, signal } from "@angular/core";
import { BaseComponent } from "../../shared/components/base-component/base-component";
import { ToggleButtons } from "../../shared/components/toggle-buttons/toggle-buttons";
import { Pages } from "../../shared/enums/pages.enum";
import { CharacterCard } from "../../shared/components/characted-card/character-card";
import { Character } from "../../shared/models/character.model";

type Types = 'character' | 'world'
@Component({
    selector: 'app-realm',
    templateUrl: './realm.html',
    styleUrls: ['./realm.scss'],
    standalone: true,
    imports: [
        ToggleButtons,
        CharacterCard
    ]
})
export class Realm extends BaseComponent {
    selectedTab = signal<Types>('character');
    readonly selectedButton = computed(() => this.selectedTab() === 'character' ? 'left' : 'right');

    onButtonToggle() {
        this.selectedTab.update((current) => current === 'character' ? 'world' : 'character');
    }

    onCreate() {
        if(this.selectedTab() === 'character') {
            console.log('character')
        } else {

        }
    }

    navigateToNextPage() {
        this.goTo(Pages.Canvas);
    }

    generateCharacterImage(character: Partial<Character>) {
        console.log(character)
    }

    deleteCharacter(id: string) {
        this.worldBibleState.deleteCharacter(id)
    }
    
}
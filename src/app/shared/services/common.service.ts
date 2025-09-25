import { ElementRef, Injectable, QueryList } from "@angular/core";

@Injectable({ providedIn: "root" })
export class CommonService {

    updateWidth(height: number, aspectRatio: string): number {
        let calculatedWidth: number;
        try {
            const [ratioX, ratioY] = aspectRatio.split(':').map(Number);
            if(isNaN(ratioX) || isNaN(ratioY) || ratioY === 0 || ratioX === 0) {
                console.error('Invalid aspect ratio format:', aspectRatio);
                calculatedWidth = height; // Default to a 1:1 ratio on error
                return calculatedWidth;
            }
            calculatedWidth = height * (ratioX / ratioY);
            return calculatedWidth;
            
        } catch (error) {
            console.error('Could not parse aspect ratio');
            return height;
        }
    }

    generateId(): string {
        return Date.now().toString(36) + Math.random().toString(36).substring(2);
    }

    scrollToLastItem(sceneItems: QueryList<ElementRef<any>>) {
        const lastItem = sceneItems.last;
        if (lastItem) {
            lastItem.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
    }

}
import { Injectable } from "@angular/core";

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

}
import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'timeFormat',
    standalone: true
})
export class TimeFormatPipe implements PipeTransform {

    transform(value: number | null | undefined): string {
        if (value === null || value === undefined || isNaN(value) || value <0) {
            return '00:00:00:000'
        }

        const totalSecondsInt = Math.floor(value);
        const milliseconds = Math.round((value % 1) * 1000);
        const hours = Math.floor(totalSecondsInt / 3600);
        const minutes = Math.floor((totalSecondsInt % 3600) / 60);
        const seconds = totalSecondsInt % 60;

        const paddedHours = hours.toString().padStart(2, '0');
        const paddedMinutes = minutes.toString().padStart(2, '0');
        const paddedSeconds = seconds.toString().padStart(2, '0');
        const paddedMilliseconds = milliseconds.toString().padStart(3, '0');

        return `${paddedHours}:${paddedMinutes}:${paddedSeconds}:${paddedMilliseconds}`;
    }
    
}
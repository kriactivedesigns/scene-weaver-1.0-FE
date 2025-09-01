import { AfterViewInit, Component, OnDestroy, OnInit } from "@angular/core";
import { Header } from "../../shared/components/header/header";
import { ProjectCard } from "../../shared/components/project-card/project-card";
import { BaseComponent } from "../../shared/classes/base-component";
import { Pages } from "../../constants/pages";

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.html',
    styleUrls: ['./dashboard.scss'],
    standalone: true,
    imports: [
        ProjectCard
    ]
})
export class Dashboard extends BaseComponent { }
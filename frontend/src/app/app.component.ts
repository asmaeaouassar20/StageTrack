import { Component } from '@angular/core';
import {  RouterOutlet } from '@angular/router';
import { ListeStageComponent } from "./etudiant/stage-management/liste-stage/liste-stage.component";

@Component({
  selector: 'app-root',
  standalone:true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'my-app';
}

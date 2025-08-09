import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HexMapComponent } from './feature/hex-map/hex-map.component';

@Component({
  selector: 'app-root',
  imports: [HexMapComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {

}

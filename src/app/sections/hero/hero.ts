import { Component } from '@angular/core';
import { FcThree } from '../../shared/components/fc-three/fc-three';

@Component({
  selector: 'app-hero',
  imports: [FcThree],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
})
export class Hero {}

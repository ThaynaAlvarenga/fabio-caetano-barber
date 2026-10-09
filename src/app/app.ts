import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './sections/header/header';
import { Hero } from './sections/hero/hero';
import { Services } from './sections/services/services';
import { Combos } from './sections/combos/combos';
import { About } from './sections/about/about';
import { Gallery } from './sections/gallery/gallery';
import { Location } from './sections/location/location';
import { BookingCta } from './sections/booking-cta/booking-cta';
import { Footer } from './shared/components/footer/footer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Hero, Services, Combos, About, Gallery, Location, BookingCta, Footer],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('fabio-caetano-barber');
}

import { Component } from '@angular/core';

interface Combo {
  number: string;
  name: string;
  services: string;
  description: string;
}

@Component({
  selector: 'app-combos',
  imports: [],
  templateUrl: './combos.html',
  styleUrl: './combos.scss',
})
export class Combos {
  combos: Combo[] = [
    {
      number: '01',
      name: 'FC Classic',
      services: 'Corte + Barba',
      description:
        'A combinação clássica para renovar o visual com corte e barba.',
    },
    {
      number: '02',
      name: 'FC Fade',
      services: 'Degradê + Barba',
      description:
        'Degradê preciso combinado ao cuidado e acabamento da barba.',
    },
    {
      number: '03',
      name: 'FC Detail',
      services: 'Corte + Sobrancelha',
      description:
        'Um complemento ao corte para deixar o visual ainda mais alinhado.',
    },
    {
      number: '04',
      name: 'FC Complete',
      services: 'Corte + Barba + Sobrancelha',
      description:
        'Uma experiência completa para cuidar de todos os detalhes do visual.',
    },
    {
      number: '05',
      name: 'Degradê + Sobrancelha',
      services: 'Degradê + Sobrancelha',
      description:
        'Um dos combos já oferecidos pela barbearia.',
    },
  ];
}

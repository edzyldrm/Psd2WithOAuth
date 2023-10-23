import { Component, OnInit } from '@angular/core';
import { Tpp } from '../tpp';
import { TppService } from '../tpp.service';

@Component({
  selector: 'app-tpps',
  templateUrl: './tpps.component.html',
  styleUrls: ['./tpps.component.css']
})
export class TppsComponent implements OnInit {

  tpps: Tpp[];

  constructor(private tppService: TppService) { }

  ngOnInit() {
    this.getTpps();
  }

  getTpps(): void {
    this.tppService.getTpps()
    .subscribe(tpps => this.tpps = tpps);
  }

}

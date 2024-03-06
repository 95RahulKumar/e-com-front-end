import { Component, OnInit } from '@angular/core';
import { SingletonService } from 'src/app/services/singleton.service';
import { SubSink } from 'subsink';
@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
})
export class LoaderComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
  OnDesstroy() {}
}

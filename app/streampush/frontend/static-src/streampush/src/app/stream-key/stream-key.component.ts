import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-stream-key',
  templateUrl: './stream-key.component.html',
  styleUrls: ['./stream-key.component.css']
})
export class StreamKeyComponent implements OnInit {
  rtmpPrefix:string
  visible:boolean = false
  @Input('restream') restream: object;

  constructor() { }

  ngOnInit() {
    this.rtmpPrefix = `rtmp://${window.location.host}/`;
  }

  toggleVis() {
    this.visible = !this.visible;
  }
}

import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-restreams',
  templateUrl: './restreams.component.html',
  styleUrls: ['./restreams.component.css']
})
export class RestreamsComponent implements OnInit {
  restreams:any[] = [];

  @ViewChild('closeBtn') closeBtn: ElementRef;

  public creating:boolean = false;
  public newRestreamName:string;
  public newRestreamEndpoints:any = []
  rtmpPrefix:string;

  constructor(private apiService: ApiService) { 
    this.rtmpPrefix = `rtmp://${window.location.host}/`

    // Subscribe to live messages and instantly pollRestreams for data
    this.apiService.on('publish', this.pollRestreams.bind(this));
    this.apiService.on('publish_done', this.pollRestreams.bind(this));
  }

  createRestream() {
    this.creating = true;

    this.apiService.createRestream({
      name: this.newRestreamName,
      endpoints: this.newRestreamEndpoints
    }).subscribe((data) => {
      this.creating = false;
      if (data['err'] != undefined) {
        alert("An error occurred while creating your restream.");
      } else {
        this.pollRestreams();
        this.closeBtn.nativeElement.click();
        this.newRestreamName = "";
        this.newRestreamEndpoints = [];
      }
    });
  }

  cancel() {
    
  }

  updateRestream(restream) {
    var updated = false;
    for (var i = 0; i < this.restreams.length; i++) {
      if (this.restreams[i].id == restream.id) {
        this.restreams[i].live = restream.live;
        this.restreams[i].endpoint = restream.endpoints;
        updated = true;
        break;
      }
    }

    if (!updated) {
      this.restreams.push(restream);
    }
  }

  pollRestreams() {
    this.apiService.getRestreams()
    .subscribe((data:any[]) => {
      if (this.restreams.length == 0) this.restreams = data;

      data.forEach((restream) => {
        this.updateRestream(restream);
      });
  
      this.restreams.sort((a, b) => {
        if (a.live && !b.live) return -1;
        if (b.live && !a.live) return 1;
        if ((a.live && b.live) || (!a.live && !b.live)) {
          var aName = a.name.toUpperCase();
          var bName = b.name.toUpperCase();
          if (aName < bName) return 1;
          if (aName > bName) return -1;
        }
        return 0;
      });
    });
  }

  ngOnInit() {
    setInterval(() => {
      this.pollRestreams();
    }, 10 * 1000);

    this.pollRestreams();
  }
}

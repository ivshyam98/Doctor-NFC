import { Component } from '@angular/core';
import { NavController, NavParams  } from 'ionic-angular';
import { NFC, Ndef } from '@ionic-native/nfc';
import { HttpClient,HttpHeaders} from '@angular/common/http';
import { Response} from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Observable';
import * as moment from 'moment';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
 message:any;
 id:any
 payload:any =[]
 patid:any;
 docAccess:any;
 body:any = {
    
  "$class": "org.med.chain.AllowDoctorWrite",
  "patient": "string",
  "doctorId": "EHR_doc_$1",
  "timestamp": "2018-11-02T13:06:34.842Z"

}
allowTime:any;
  constructor(public http: HttpClient,public navParams: NavParams,public nfc: NFC,public ndef: Ndef,public navCtrl: NavController) {
    this.nfc.addNdefListener(() => {
      console.log('successfully attached ndef listener');
      //alert('successfully attached ndef listener')
    }, (err) => {
      console.log('error attaching ndef listener', err);
      alert('error attaching ndef listener')
    }).subscribe((event) => {
      this.message=event.tag
      console.log('received ndef message. the tag contains: ', event);
      //alert(event.tag.ndefMessage[0].payload)
      this.payload=event.tag.ndefMessage[0].payload
      console.log('decoded tag id', this.nfc.bytesToString(event.tag.ndefMessage[0].payload));
      this.patid=this.nfc.bytesToString(event.tag.ndefMessage[0].payload)
      this.docAccess= this.patid.slice(3)
      this.id=event.tag.id
     //alert(event.tag.id)
     this.body.patient=this.docAccess
     this.body.timestamp=moment()
     this.allowTime=this.body.timestamp
      this.postAllowDoctorWrite()

    
    });
  }
  
  postAllowDoctorWrite(){
    let headers = new HttpHeaders();
    headers.append('Content-Type','application/json');
    this.http.post('http://172.16.8.95:3000/api/AllowDoctorWrite',this.body,{headers:headers}).map(res=>
     //alert(res)
     res
    ).subscribe(res=>{
      console.log(res);
    })
    alert("You have given access to a new doctor")
  }
}

import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { VRList } from '../vr';

@Component({
  selector: 'app-json-node-element',
  standalone: true,
  imports: [CommonModule, NgbModule],
  templateUrl: './json-node-element.component.html',
  styleUrl: './json-node-element.component.scss',

})
export class JsonNodeElementComponent {
  @Input() element: any;
  @Input() identAtBegin: boolean = false;
  @Input() isLastElement: boolean = false;
  //@Input() identIndex: number = 0;

  private _identIndex: number = 0;
  public identArr: number[] = [];

  @Input() set identIndex(value: number) {
    this._identIndex = value;
    this.identArr = Array(this.identIndex).fill(0).map((x,i)=>i);
  }
  get identIndex(): number {
    // other logic
    return this._identIndex;
  }

  public findValueElement() {
    if (!this.element.children) return null;
    if (this.element.children instanceof Object && this.element.children.type == "object") {
      if (this.element.children.children instanceof Array) {
        const found = this.element.children.children.find((cChild: any) => {
          if (!cChild.key) return false;
          return cChild.key.toUpperCase() == "VALUE";
        })
        if (!!found) {
          return found.children;
        }
      }
    }
    return null;
  }

  public getVRName() {
    const found = this.findVRFromElement();
    if (!found) return "Not Found";

    let pts: string[] = found.split('|');
    pts = pts.map(cPt => {
      const vrFound = VRList.find(cVr => cVr.vr.toUpperCase() == cPt.toUpperCase());
      if (!!vrFound) {
        return "(" + cPt + ") " + vrFound.name; 
      } else {
        return cPt;
      }
    });
    return pts.join(" or ");
  }

  public findVRFromElement() {
    if (!this.element.children) return null;
    if (this.element.children instanceof Object && this.element.children.type == "object") {
      if (this.element.children.children instanceof Array) {
        const found = this.element.children.children.find((cChild: any) => {
          if (!cChild.key) return false;
          return cChild.key.toUpperCase() == "VR";
        })
        if (!!found) {
          if (found.children.type == "string") {
            if (!!found.children.value) {
              return found.children.value;
            } else {
              return this.element.dicomTag.vr;
            }
          }
        }
      }
    }
    return null;
  }


}

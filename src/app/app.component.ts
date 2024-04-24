import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { JsonNodeElementComponent } from './json-node-element/json-node-element.component';
import { DicomTags } from './dicomtags';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FormsModule, JsonNodeElementComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'dicomweb-descriptor';

  public jsonContent = "{\n    \"00081190\": {\n        \"vr\": \"UR\"\n    },\n    \"00081198\": {\n        \"vr\": \"SQ\",\n        \"Value\": [\n            {\n                \"00081150\": {\n                    \"vr\": \"UI\",\n                    \"Value\": [\n                        \"1.2.840.10008.5.1.4.1.1.4\"\n                    ]\n                },\n                \"00081155\": {\n                    \"vr\": \"UI\",\n                    \"Value\": [\n                        \"1.3.6.1.4.1.32839.99.2.10896042967700085640820889069373249930\"\n                    ]\n                },\n                \"00081197\": {\n                    \"vr\": \"US\",\n                    \"Value\": [\n                        272\n                    ]\n                }\n            }\n        ]\n    }\n}";
  public rootElement: any = null;

  constructor() {
    setTimeout(() => {
      this.onJsonChange();
    }, 1000);
  }

  public onJsonChange() {
    this.parseJson(this.jsonContent);
  }

  public parseJson(content: string) {
    let responseObj = null;
    try {
      responseObj = JSON.parse(content);
    } catch (ex) {
      this.rootElement = null;
      return null;
    }

    // Build json tree
    const tree = this.parseJSONTree(responseObj);
    this.iterateOnTree(tree);
    //console.log(tree);

    this.rootElement = tree;

    return null;
  }

  public parseJSONTree(obj: any): any {
    if (typeof obj !== 'object' || obj === null) {
      return { type: typeof obj, value: obj };
    }

    if (Array.isArray(obj)) {
      return {
        type: 'array',
        value: null,
        children: obj.map(item => this.parseJSONTree(item))
      };
    }

    return {
      type: 'object',
      value: null,
      children: Object.entries(obj).map(([key, value]) => ({
        type: 'property',
        key: key,
        value: null,
        children: this.parseJSONTree(value)
      }))
    };
  }

  public iterateOnTree(element: any) {
    if (element == null) return;
    if (element.type == "property") {
      if (element.key.length == 8) {
        if (element.key.match(/^[0-9a-z]+$/)) {
          const foundTag = this.findDicomTag(element.key);
          if (!!foundTag) {
            element.isDicomTag = true;
            element.dicomTag = foundTag;
            //element.containsDicomValue = !!this.findValueElement(element);
          }
        }
      }
    }

    if (element.children != null) {
      if (element.children instanceof Array) {
        element.children.forEach((cElement: any) => {
          this.iterateOnTree(cElement);
        });
      } else {
        this.iterateOnTree(element.children);
      }
    }
  }

  public findDicomTag(dicomtag: string) {
    const dicomTagInsensitive = dicomtag.toUpperCase();
    return DicomTags.find(cTag => {
      // Deals with wildcard tags
      if (cTag.tag.indexOf("x") != -1) {
        let isEqual = true;
        for (let i = 0; i < cTag.tag.length; i++) {
          const character = cTag.tag.charAt(i);
          if (character == 'x') continue;
          if (dicomTagInsensitive.charAt(i) != character)
            isEqual = false;
        }
        return isEqual;
      } else {
        return cTag.tag == dicomTagInsensitive;
      }
    });
  }

}

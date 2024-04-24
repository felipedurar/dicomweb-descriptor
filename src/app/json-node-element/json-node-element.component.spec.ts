import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JsonNodeElementComponent } from './json-node-element.component';

describe('JsonNodeElementComponent', () => {
  let component: JsonNodeElementComponent;
  let fixture: ComponentFixture<JsonNodeElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JsonNodeElementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(JsonNodeElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SelectQuantidadeModalComponent } from './select-quantidade-modal.component';

describe('SelectQuantidadeModalComponent', () => {
  let component: SelectQuantidadeModalComponent;
  let fixture: ComponentFixture<SelectQuantidadeModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectQuantidadeModalComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SelectQuantidadeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

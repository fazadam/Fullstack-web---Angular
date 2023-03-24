import { ComponentFixture, TestBed } from '@angular/core/testing';



import { CardListComponentComponent } from './card-list-component.component';

describe('CardListComponentComponent', () => {
  let component: CardListComponentComponent;
  let fixture: ComponentFixture<CardListComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardListComponentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardListComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

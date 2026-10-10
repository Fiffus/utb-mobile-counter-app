import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { SavedCounter } from '../models/saved-counter';
import { Tab1Page } from './tab1.page';
import { CounterService } from '../services/counter.service';

describe('Tab1Page', () => {
  let component: Tab1Page;
  let fixture: ComponentFixture<Tab1Page>;
  let cs: CounterService;

  beforeEach(() => {
    fixture = TestBed.createComponent(Tab1Page);
    cs = TestBed.inject(CounterService)
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add the newest saved counter to the beginning', async () => {
    const first: SavedCounter = {
      id: 'first',
      name: 'První',
      value: 1,
      createdAt: new Date().toISOString(),
    };
    const second: SavedCounter = {
      id: 'second',
      name: 'Druhé',
      value: 2,
      createdAt: new Date().toISOString(),
    };

    await component.onSaved(first);
    await component.onSaved(second);

    expect(cs.counters()).toEqual([second, first]);
  });
});

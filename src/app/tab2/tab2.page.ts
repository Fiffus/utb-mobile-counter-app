import { Component, inject, computed, signal, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonSpinner,
  IonTitle,
  IonToolbar,
  AlertController,
  ToastController,
  IonSearchbar,
} from '@ionic/angular';
import { CounterService } from '../services/counter.service';
import { SavedCounter } from '../models/saved-counter';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  imports: [
    DatePipe,
    IonButton,
    IonContent,
    IonHeader,
    IonItem,
    IonLabel,
    IonList,
    IonNote,
    IonSpinner,
    IonTitle,
    IonToolbar,
    IonSearchbar,
  ],
})
export class Tab2Page implements OnInit {
  private readonly alertController = inject(AlertController);
  private readonly toastController = inject(ToastController);
  readonly counterService = inject(CounterService);

  readonly searchText = signal('');
  readonly currentFilter = signal<'none' | 'positive' | 'negative'>('none');
  readonly sortOrder = signal<'default' | 'value' | 'name'>('default');
  readonly counters = computed(() => {
    const search = this.searchText().trim().toLocaleLowerCase();
    let list = this.counterService.counters().filter(counter => counter.name.toLocaleLowerCase().includes(search));

    switch (this.sortOrder()) {
      case 'value':
        return this.applyFilter(list.sort((a, b) => b.value - a.value));
      case 'name':
        return this.applyFilter(list.sort((a, b) => a.name.localeCompare(b.name)));
      default:
        return this.applyFilter(list);
    }
  });

  applyFilter(sorted: SavedCounter[]): SavedCounter[] {
    switch (this.currentFilter()) {
      case 'none':
        return sorted;
      case 'negative':
        return sorted.filter(counter => counter.value < 0);
      case 'positive':
        return sorted.filter(counter => counter.value >= 0);
    }
  }

  async ngOnInit(): Promise<void> {
    await this.counterService.initialize();
  }

  async remove(id: string): Promise<void> {
    await this.counterService.remove(id);
    await this.toastMessage('Záznam ' + id + ' byl úspěšně smazán.')
  }

  async clear(): Promise<void> {
    await this.counterService.clear();
  }

  async sortByValue(): Promise<void> {
    this.sortOrder.set('value');
  }

  async sortByName(): Promise<void> {
    this.sortOrder.set('name');
  }

  async noFilter(): Promise<void> {
    this.currentFilter.set('none');
  }

  async filterPositive(): Promise<void> {
    this.currentFilter.set('positive');
  }

  async filterNegative(): Promise<void> {
    this.currentFilter.set('negative');
  }

  async toastMessage(message: string): Promise<void> {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'top',
      color: 'success',
    });

    await toast.present();
  }

  async alertClear(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Varování',
      message: 'Tato akce smaže veškerou historii!',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: async () => {
            await this.clear();
            await this.toastMessage('Záznamy byly úspěšně smazány.');
          },
        }
      ],
    });

    await alert.present();
  }
}

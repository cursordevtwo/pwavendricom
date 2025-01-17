import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataApiService } from '@app/services/data-api-service';
import { GlobalService } from '@app/services/global.service';
import { virtualRouter } from '@app/services/virtualRouter.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent {
  dateRange: string = '';

  constructor(
    public global: GlobalService,
    public virtualRoute: virtualRouter,
    public dataApi: DataApiService
  ) {
    this.global.getRepositorios();
    this.global.getTemas();
    this.global.getCategories();
  }

  changeTema(tema: any) {
    this.global.selectedTema = tema;
  }

  changeCategory(category: any) {
    this.global.selectedCategory = category;
  }

  changeRepositorio(repositorio: any) {
    this.global.selectedRepositorio = repositorio;
  }
}

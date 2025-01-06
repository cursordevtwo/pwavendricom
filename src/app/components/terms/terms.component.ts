import { Component } from '@angular/core';
import { GlobalService } from '@app/services/global.service';
import { virtualRouter } from '@app/services/virtualRouter.service';

@Component({
  selector: 'app-terms',
  standalone: true,
  imports: [],
  templateUrl: './terms.component.html',
  styleUrl: './terms.component.css'
})
export class TermsComponent {
constructor(
  public global: GlobalService,
  public virtualRouter: virtualRouter
) { }
}

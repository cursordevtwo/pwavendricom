import { Component } from '@angular/core';
import { GlobalService } from '@app/services/global.service';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [],
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.css'
})
export class FaqComponent {
constructor (
  public global: GlobalService
){}
}

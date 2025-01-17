import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuthRESTService } from '@app/services/auth-rest.service';
import { GlobalService } from '@app/services/global.service';
import { PocketAuthService } from '@app/services/pocket-auth.service';
import { virtualRouter } from '@app/services/virtualRouter.service';

@Component({
  selector: 'app-capacitaciones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './capacitaciones.component.html',
  styleUrl: './capacitaciones.component.css'
})
export class CapacitacionesComponent {
  constructor(
    public virtualRouter: virtualRouter,
    public global: GlobalService,
    public auth:AuthRESTService ,
    public pocketAuthService: PocketAuthService
  ){}
}

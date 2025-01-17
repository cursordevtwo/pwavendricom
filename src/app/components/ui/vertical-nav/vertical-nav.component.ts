import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuthRESTService } from '@app/services/auth-rest.service';
import { GlobalService } from '@app/services/global.service';
import { PocketAuthService } from '@app/services/pocket-auth.service';
import { virtualRouter } from '@app/services/virtualRouter.service';

@Component({
  selector: 'app-vertical-nav',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vertical-nav.component.html',
  styleUrl: './vertical-nav.component.css'
})
export class VerticalNavComponent {
  activeRoute: string;

 constructor(
  public global:GlobalService,
  public auth:AuthRESTService,
  public virtualRouter:virtualRouter,
  public pocketAuthService: PocketAuthService
 ){
  this.activeRoute = this.virtualRouter.getCurrentRoute(); // Assuming this method exists to get the current route

 }
 setActiveRoute(route: string) {
  this.activeRoute = route;
  this.virtualRouter.setRoute(route); // Navigate to the selected route
}
}

import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { MainHeaderComponent } from '../../shared/components/main-header/main-header.component';

@Component({
  selector: 'app-suppourt',
  imports: [TranslatePipe, MainHeaderComponent],
  templateUrl: './suppourt.component.html',
  styleUrl: './suppourt.component.css',
})
export class SuppourtComponent {}

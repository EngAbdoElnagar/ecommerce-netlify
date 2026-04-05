import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-main-header',
  imports: [RouterLink, TranslatePipe],
  templateUrl: './main-header.component.html',
  styleUrl: './main-header.component.css',
})
export class MainHeaderComponent {
  title = input.required<string>();
  description = input.required<string>();
  breadcrumb = input<{ label: string; url?: string }[]>([]);

  iconClass = input<string>('fa-layer-group');

  image = input<string>();
  bgColorClass = input<string>('bg-linear-to-br from-primary via-primary-500 to-primary-400');
}

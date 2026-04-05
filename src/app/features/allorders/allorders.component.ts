import { IOrders } from './../../core/models/IOrders/iorders.interface';
import { DatePipe, isPlatformBrowser } from '@angular/common';
import { Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { OrdersService } from '../../core/services/orders/orders.service';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-allorders',
  imports: [DatePipe, LoadingComponent, TranslatePipe],
  templateUrl: './allorders.component.html',
  styleUrl: './allorders.component.css',
})
export class AllordersComponent implements OnInit {
  private readonly ordersService = inject(OrdersService);
  private readonly pLATFORM_ID = inject(PLATFORM_ID);

  isLoading = signal(true);
  allOrders = signal<IOrders[]>([]);

  userId = signal<string>('');

  detailsMap = signal<Record<string, boolean>>({});

  toggleDetails(orderId: string): void {
    this.detailsMap.update((map) => ({
      ...map,
      [orderId]: !map[orderId],
    }));
  }

  isOpen(orderId: string): boolean {
    return !!this.detailsMap()[orderId];
  }

  ngOnInit(): void {
    this.getUserIdFromToken();

    this.getOrders();
  }

  getUserIdFromToken(): void {
    if (isPlatformBrowser(this.pLATFORM_ID)) {
      const token = localStorage.getItem('freshToken');
      if (token) {
        const decoded: any = jwtDecode(token);
        this.userId.set(decoded.id);
      }
    }
  }

  getOrders(): void {
    this.isLoading.set(true);
    this.ordersService.getUserOrders(this.userId()).subscribe({
      next: (res) => {
        this.allOrders.set(res as IOrders[]);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.isLoading.set(false);
      },
    });
  }
}

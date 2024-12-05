import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { Order, OrderLineItem } from '../../../core/models/order.model';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-order-receipt',
  standalone: true,
  imports: [DatePipe, CurrencyPipe, MatTableModule, MatDialogModule, MatButtonModule],
  templateUrl: './order-receipt.component.html',
  styleUrl: './order-receipt.component.scss'
})
export class OrderReceiptComponent {
  orderLineItems: MatTableDataSource<OrderLineItem> = new MatTableDataSource();  // Initialize as empty MatTableDataSource
  displayedColumns: string[] = ['name', 'qty', 'price', 'total'];
  
  constructor(@Inject(MAT_DIALOG_DATA) public data:Order) {
    this.orderLineItems = new MatTableDataSource(this.data.orderLineItems);
  }
}

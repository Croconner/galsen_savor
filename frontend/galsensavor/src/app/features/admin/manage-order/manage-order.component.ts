import {  Component, OnInit, ViewChild } from '@angular/core';
import { Order } from '../../../core/models/order.model';
import { OrderService } from '../../../core/services/order.service';
import { MatIconModule } from '@angular/material/icon';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { SnackbarService } from '../../../core/services/snackbar.service';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';


@Component({
  selector: 'app-manage-order',
  standalone: true,
  imports: [
    MatCardModule, 
    MatIconModule, 
    MatButtonModule, 
    CurrencyPipe, 
    DatePipe,
    MatFormFieldModule, 
    MatInputModule,
    MatTableModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatSnackBarModule],
  providers: [DatePipe],
  templateUrl: './manage-order.component.html',
  styleUrl: './manage-order.component.scss'
})
export class ManageOrderComponent implements OnInit{

  allOrders: Order[] = [];
  displayedColumns: string[] = ['orderNumber', 'orderDate', 'name', 'menuItems', 'amount', 'actions'];
  dataSource: MatTableDataSource<Order> = new MatTableDataSource();  // Initialize as empty MatTableDataSource
  responseMessage: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;  // Allow paginator to be undefined
  
  constructor(private orderService: OrderService, 
    private dialog:MatDialog, private snackBarService: SnackbarService, private datePipe: DatePipe) {}

  
  ngOnInit() {
    this.orderTable();
  }

 // Get all orders
 orderTable() {
  this.orderService.getAllOrders().subscribe(orders => {
    this.dataSource = new MatTableDataSource(orders);
    this.dataSource.paginator = this.paginator;

    // Define custom filterPredicate for complex filtering
    this.dataSource.filterPredicate = (data: Order, filter: string) => {
      const transformedFilter = filter.trim().toLowerCase();

      // Check individual fields for matches
      const matchId = data.id.toString().toLowerCase().includes(transformedFilter);
      const matchOrderDate = data.orderDate
        ? this.datePipe.transform(data.orderDate, 'short')?.toLowerCase().includes(transformedFilter)
        : false;
      const matchUserName = data.user &&
        (`${data.user.firstName} ${data.user.lastName}`.toLowerCase().includes(transformedFilter));
      const matchMenuItems = data.orderLineItems.some(item =>
        item.menuItem.name.toLowerCase().includes(transformedFilter)
      );
      const matchTotalAmount = data.totalAmount.toString().toLowerCase().includes(transformedFilter);

      // Return true if any field matches the filter
      return matchId || matchOrderDate || matchUserName || matchMenuItems || matchTotalAmount;
    };
  });
}

  //allow search functionality
  applyFilter(event:Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  //open delete dialog and handle delete
handleDeleteAction(values:any) {
  const dialogConfig = new MatDialogConfig();
  dialogConfig.data = {
    message: 'delete order number ' + values.id + ' ?',
    confirmation: true
  };  
  const dialogRef = this.dialog.open(DeleteDialogComponent, dialogConfig);
  const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe(() => {
    this.deleteOrder(values.id);
    dialogRef.close();  
  });
}

  //delete order
  deleteOrder(id: number) {
    this.orderService.deleteOrder(id).subscribe((response) => {
      this.responseMessage = response?.message;
      this.orderTable();
      this.snackBarService.openSnackBar(this.responseMessage, 'success');
    });
  }
}

import { Component, ViewChild } from '@angular/core';
import { MenuService } from '../../../core/services/menu.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CurrencyPipe } from '@angular/common';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { AddMenuDialogComponent } from '../add-menu-dialog/add-menu-dialog.component';
import { SnackbarService } from '../../../core/services/snackbar.service';
import {MatSnackBarModule } from '@angular/material/snack-bar';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';


@Component({
  selector: 'app-manage-menu',
  standalone: true,
  imports: [    MatCardModule, 
    MatButtonModule, 
    MatIconModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatTableModule,
    MatTooltipModule,
    MatPaginatorModule,
    CurrencyPipe, MatSnackBarModule],
  templateUrl: './manage-menu.component.html',
  styleUrl: './manage-menu.component.scss'
})
export class ManageMenuComponent {

  displayedColumns: string[] = ['name', 'categoryName', 'description', 'price', 'edit'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();  // Initialize as empty MatTableDataSource
  responseMessage: any;
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;  // Allow paginator to be undefined


  constructor(private menuService:MenuService,
    private dialog:MatDialog, 
    private router:Router, private snackBarService: SnackbarService

  )
{}

tableData() {
  this.menuService.getAllMenuItems().subscribe(
    (response: any) => {
      this.dataSource = new MatTableDataSource(response);
            if (this.paginator) {
        this.dataSource.paginator = this.paginator;  // Set paginator if defined
      }
      console.log(this.dataSource);
    }, (error:any)=>{
    console.log(error.error?.message);
    if(error.error?.message){
      this.responseMessage = error.error?.message;
    }
    else{
      this.responseMessage = "Error";
    }
  })
}
applyFilter(event:Event){
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLowerCase();
}
handleAddAction(){    
  const dialogConfig = new MatDialogConfig();  
  dialogConfig.data = {
    action: 'Add'
  };
  dialogConfig.width = "850px";
  const dialogRef = this.dialog.open(AddMenuDialogComponent,dialogConfig);
  this.router.events.subscribe(() =>{
    dialogRef.close();
  });

    const sub = dialogRef.componentInstance.onAddProduct.subscribe((response)=>{
      this.tableData();
    })

}

handleEditAction(values:any){
  const dialogConfig = new MatDialogConfig();  
  dialogConfig.data = {
    action: 'Edit',
    data: values
  };
  dialogConfig.width = "850px";
  const dialogRef = this.dialog.open(AddMenuDialogComponent,dialogConfig);
  this.router.events.subscribe(() =>{
    dialogRef.close();
  });

    const sub = dialogRef.componentInstance.onEditProduct.subscribe((response)=>{
      this.tableData();
    })
}

handleDeleteAction(values:any){
  const dialogConfig = new MatDialogConfig();
  dialogConfig.data = {
    message: 'delete ' + values.name + ' menu-item ?',
    confirmation:true
  }
  const dialogRef = this.dialog.open(DeleteDialogComponent,  dialogConfig);
  const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((response:any) =>{
    this.deleteMenuItem(values.id);
    dialogRef.close();
  })
}

deleteMenuItem(id:number) {
  this.menuService.deleteMenuItem(id).subscribe((response:any) => {
    this.tableData();
    this.responseMessage = response?.message;
    this.snackBarService.openSnackBar(this.responseMessage, "success");
  })
}

ngOnInit() {
  this.tableData();
}
onPageChange(event: any) {
  // Optional: Handle pagination change events if necessary
  console.log(event);
}
}

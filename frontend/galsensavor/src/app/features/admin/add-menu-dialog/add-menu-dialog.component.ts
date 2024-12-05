import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { CurrencyPipe, CommonModule } from '@angular/common';  // for currency formatting
import { MenuService } from '../../../core/services/menu.service';
import { CONSTANTS } from '../../../shared/constants';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { SnackbarService } from '../../../core/services/snackbar.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@Component({
  selector: 'app-add-menu-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatSelectModule,
    MatToolbarModule,
    MatIconModule,
    CommonModule,
    CurrencyPipe,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './add-menu-dialog.component.html',
  styleUrls: ['./add-menu-dialog.component.scss']
})
export class AddMenuDialogComponent implements OnInit{

  onAddProduct = new EventEmitter();
  onEditProduct = new EventEmitter();
  productForm:any = FormGroup;
  dialogAction:any = "Add";
  action:any = "Add";
  responseMessage:any;
  categories: any[] = [];
  selectedFile: File | null = null;
  isLoading = false;
  initialFormValues:any;

  constructor(@Inject(MAT_DIALOG_DATA)public dialogData:any,
   private formBuilder:FormBuilder,
   private menuService:MenuService,
   public dialogRef:MatDialogRef<AddMenuDialogComponent>,
   private snackbarService:SnackbarService
  ){}
   
 
  ngOnInit(): void {
    this.productForm = this.formBuilder.group({
      name:[null,[Validators.required]],
      category:[null, [Validators.required]],
      price:[null,[Validators.required]],
      description:[null, [Validators.required]],
       selectedFile: this.dialogData.action === "Add" ? [null, [Validators.required]] : [null]

    });

    this.categories = CONSTANTS.categories.filter((category, index) => index !== 0); 

    if (this.dialogData.action === "Edit") {
      this.dialogAction = "Edit";
      this.action = "Update";

      //prefill the form with existing data
      this.productForm.patchValue({        
        name: this.dialogData.data.name,
        category: this.dialogData.data.category,  
        price: this.dialogData.data.price,
        description: this.dialogData.data.description,});

      //store the initial form values
      this.initialFormValues = this.productForm.value;
    }
  }

  // check if the form is updated
  isFormUpdated() {
    return JSON.stringify(this.productForm.value) === JSON.stringify(this.initialFormValues);
  }
    onSubmit() {
      this.dialogAction === "Edit" ? this.handleFormSubmit(true) : this.handleFormSubmit(false);
    }
  handleFormSubmit(isEdit: boolean) {
    // display loading spinner
    this.isLoading = true;

    const formValue = this.productForm.value;

    //create a JSON object to update the menu item
    const updatedData = {
      id: isEdit ? this.dialogData.data.id : null,
      name: formValue.name,
      description: formValue.description,
      price: formValue.price,
      category: formValue.category,
      imageUrl: isEdit ? this.dialogData.data.imageUrl : null
    };

    // create a FormData object to add new menu item
    const createData = new FormData();
    createData.append('name', formValue.name);
    createData.append('description', formValue.description);
    createData.append('price', formValue.price);
    createData.append('category', formValue.category);
    if (this.selectedFile) {
      createData.append('image', this.selectedFile, this.selectedFile.name);
    }

    // call the appropriate service method
    const actionCall = isEdit ? this.menuService.updateMenuItem(updatedData) : this.menuService.addMenuItem(createData);

    // handle the response
    actionCall.subscribe({
      next: (response: any) => {
        this.isLoading = false;
        this.dialogRef.close();
        // emit the onAddProduct or onEditProduct event
        isEdit ? this.onEditProduct.emit() : this.onAddProduct.emit();
        this.responseMessage = response?.message;
        this.snackbarService.openSnackBar(this.responseMessage, "success");
      },
      error: (error: any) => {
        this.isLoading = false;
        console.log(error);
        this.responseMessage = error?.error?.message || "An error occurred";
        this.snackbarService.openSnackBar(this.responseMessage, "error");
      }
    });
  
  }

onCancel() {
  this.dialogRef.close();
}
onFileSelect(event: Event) {
  if (this.dialogAction === "Add") {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedFile = fileInput.files[0];
      this.productForm.patchValue({ selectedFile: this.selectedFile });
    } else {
      this.productForm.patchValue({ selectedFile: null });
    }
 }
}
}
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { HttpclientService } from 'src/app/services/httpclient.service';
import { SingletonService } from 'src/app/services/singleton.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss'],
})
export class AddProductComponent implements OnInit {
  createProductForm: FormGroup;
  @ViewChild('form') form: NgForm;
  selectedFile: File;
  fileName: string;
  constructor(
    private fb: FormBuilder,
    private http: HttpclientService,
    private ss: SingletonService
  ) {}
  CATEGORY: Array<string> = [
    'mobile',
    'tv',
    'ac',
    'printer',
    'camera',
    'antuvirus',
    'powerbank',
    'fan',
    'laptop',
    'smartwatch',
  ];
  STOCK: Array<number> = [1, 5, 10, 15, 20];
  imageUrl: string | ArrayBuffer;
  ngOnInit(): void {
    this.createFormControls();
  }
  createFormControls() {
    this.createProductForm = this.fb.group({
      name: ['', Validators.required],
      price: ['', Validators.required],
      category: ['', Validators.required],
      stock: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  get name() {
    return this.createProductForm.get('name');
  }
  get price() {
    return this.createProductForm.get('price');
  }
  get description() {
    return this.createProductForm.get('description');
  }
  get category() {
    return this.createProductForm.get('category');
  }
  get stock() {
    return this.createProductForm.get('stock');
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    this.selectedFile = file;
    this.fileName = file.name;
    var reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      this.imageUrl = event.target.result;
      console.log('selected file...', this.imageUrl);
    };
  }

  clearImageData() {
    this.selectedFile = undefined;
    this.fileName = undefined;
    this.imageUrl = undefined;
  }

  createProductSubmit() {
    if (this.createProductForm.invalid) {
      return;
    }
    console.log(this.createProductForm.value);

    const endPoint = 'products/new';
    const formData = new FormData();
    formData.append('name', this.name.value);
    formData.append('price', this.price.value);
    formData.append('description', this.description.value);
    formData.append('category', this.category.value);
    formData.append('stock', this.stock.value);
    formData.append('image', this.selectedFile);
    this.http.request('POST', endPoint, formData).subscribe((res) => {
      if (res.status === 201) {
        this.ss.message.showStatusBar(
          'Product Updated Successfully',
          3000,
          'success'
        );
        this.clearImageData();
        this.form.resetForm();
      } else if (res.status === 500) {
        this.ss.message.showStatusBar('Internal Server Error', 3000, 'fail');
      }
    });
  }
}

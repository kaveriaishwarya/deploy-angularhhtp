import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription, map } from 'rxjs';
import { Products } from './model/products';
import { ProductService } from './Services/product.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit,OnDestroy {
  title = 'AngularHttp';
  allProducts:Products[] = [];
  isFetching:boolean = false;
  isEdit:boolean = false;
  currentProductId:string;
  errorMessage:string = null;
  errorsub : Subscription
  @ViewChild('productform') form:NgForm
  constructor(private http:HttpClient,private service:ProductService){}
  ngOnInit(){
    this.fetchProducts();
    this.errorsub= this.service.error.subscribe((message)=>{
      this.errorMessage=message;
    })
  }

  onProductFetch(){
    this.fetchProducts();
   
  }
  onProductsCreate(products: {pname:string,pdesc:string,pprice:string}){
    if(!this.isEdit){
   this.service.createProducts(products);
  }else{
    this.service.updateProduct(this.currentProductId,products)
  }
  }
 
  onDeleteProduct(id:string){
    this.service.deleteProducts(id);
  }
  onDeleteAllProduct(){
    this.service.deleteAllProducts();
  }
  private fetchProducts(){
    this.isFetching=true;
   this.service.fetchProducts().subscribe((products)=>{
     this.allProducts = products
     this.isFetching=false;
    },(err)=>{
     this.errorMessage = err.message;
    })
  }
  
  onEdit(id:string){
    this.currentProductId=id;
    this.isEdit=true;
    let currentprod =  this.allProducts.find((prod)=> prod.id === id);
  this.form.setValue({
    pname : currentprod.pname,
    pdesc:currentprod.pdesc,
    pprice : currentprod.pprice
  });
  }
  ngOnDestroy(): void {
    this.errorsub.unsubscribe();
  }
}

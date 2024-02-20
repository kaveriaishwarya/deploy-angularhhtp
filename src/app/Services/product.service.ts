import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Products } from "../model/products";
import { Subject, catchError, map, throwError } from "rxjs";

@Injectable({providedIn:"root"})
export class ProductService{
    error = new Subject<string>();
    constructor(private http:HttpClient){}

    createProducts(products: {pname:string,pdesc:string,pprice:string}){
        const headers = new HttpHeaders({'myHeader':'Aishu'})
        this.http.post<{name:string}>('https://angularbyaishu-default-rtdb.firebaseio.com/products.json123',products,{headers:headers}).subscribe((res)=>{
          console.log(res)
        },(err)=>{
            this.error.next(err.message);
        })
    }

    fetchProducts(){
       return this.http.get<{[key:string]: Products}>('https://angularbyaishu-default-rtdb.firebaseio.com/products.json').
        pipe(map((res)=>{
          const products=[]
          for(const key in res){
            if(res.hasOwnProperty(key)){
            products.push({...res[key],id:key})
          }
          }
          return products;
        }),catchError((err) => {
            return throwError(err);
        }))
    }

    deleteProducts(id:string){
        this.http.delete('https://angularbyaishu-default-rtdb.firebaseio.com/products/'+id+'.json').subscribe();
    }

    deleteAllProducts(){
        this.http.delete('https://angularbyaishu-default-rtdb.firebaseio.com/products.json').subscribe();
    }

    updateProduct(id:string,value:Products){
        this.http.put('https://angularbyaishu-default-rtdb.firebaseio.com/products/'+id+'.json',value).subscribe();
    }
}
import { Injectable } from '@angular/core';
import { Http, Headers, Response, URLSearchParams, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as moment from 'moment';
import { HttpClient } from '@angular/common/http';

import { Router, ActivatedRoute } from "@angular/router";
import { LocalStorage } from '@ngx-pwa/local-storage';


@Injectable()
export class AppService {

    private BASE_URL = "http://139.59.20.29/server/api/v1";
    private IMAGE_BASE_URL = "http://139.59.20.29/server"

    //private BASE_URL = "https://inventory-tracker-server.herokuapp.com/api/v1";
    //private IMAGE_BASE_URL = "https://inventory-tracker-server.herokuapp.com"
   // private BASE_URL = "http://10.176.16.106:5555/api/v1";
  //  private IMAGE_BASE_URL = "http://10.176.16.106:5555";
    private selectedBranch = new BehaviorSubject<string>("1");
    currentBranch = this.selectedBranch.asObservable();
    private SELECTED_BRANCH:any;

    constructor(private http: HttpClient, private router:Router, private localStorage: LocalStorage) { }

    getBaseUrl() {
        return this.BASE_URL;
    }

    setBranch(branch: string){
        this.SELECTED_BRANCH = branch;
    }
    getBranch(){
        return this.SELECTED_BRANCH;
    }

    getImageBaseUrl(){
      return this.IMAGE_BASE_URL;
    }

    logout() {
       console.log("Fallback to login")
       window.localStorage.setItem("mi3userToken", null);
       this.router.navigateByUrl('/login')
    }

    getBranches() {
        return this.http.get(this.BASE_URL+"/branches").map((response: Response) => {
                let branches = response;
                return branches;
        });
    }

    getTeachersList(branchId: string) {
         return this.http.get(this.BASE_URL+"/branches/" +branchId + "/teachers").map((response: Response) => {
                let teachersList = response;
                return teachersList;
        });
    }

    getProductListForBranch(branchId: string) {
         return this.http.get(this.BASE_URL+"/branches/"+branchId + "/products").map((response: Response) => {
                let productList = response;
                return productList;
        });
    }

    saveChoosenProducts(data: any) {
       return this.http.post(this.BASE_URL + "/inventories",data)
            .map((response: Response) => {
                let resp = response;
                return resp;
        });
    }

    getSavedProducts(branchId: string) {
        var startDate = moment(new Date()).startOf("day").format("YYYY-MM-DD HH:mm:ss");
        var endDate = moment(new Date()).endOf("day").format("YYYY-MM-DD HH:mm:ss");
         return this.http.get(this.BASE_URL+"/inventories/branch/"+branchId+"?startDate="+startDate+"&endDate=" + endDate).map((response: Response) => {
                let productList = response;
                return productList;
        });
    }

    changeBranch(branch: string) {
        this.selectedBranch.next(branch)
    }

    getHeaders() {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let requestOptions = new RequestOptions({ headers: headers});
        return requestOptions;
    }

    setDataInBrowser(data: Object, key: string) {
        this.localStorage.setItem(key, data).subscribe((data) => {
        },(err) => {
            console.log(err)
        });
    }

    getDataFromBrowser(key: string, callback:(d) => void) {
        this.localStorage.getItem<Object>(key).subscribe((data) => {
            callback(data);
        },(err) => {
            console.log(err);
        })
    }

    getJobDetails(id : string){
        var startDate = moment(new Date()).startOf("day").format("YYYY-MM-DD HH:mm:ss");
        var endDate = moment(new Date()).endOf("day").format("YYYY-MM-DD HH:mm:ss");
         return this.http.get(this.BASE_URL+"/branchProduct/"+id+"/inventories/?startDate="+startDate+"&endDate=" + endDate).map((response: Response) => {
                let jobsList = response;
                return jobsList;
        });
    }

    updateJobDetails(data: any) {
      return this.http.post(this.BASE_URL + "/inventories",[data])
           .map((response: Response) => {
               let resp = response;
               return resp;
       });
   }

   getTargetByBranch (branchId: string) {
     var date = moment(new Date()).startOf("day").format("YYYY-MM-DD HH:mm:ss");
     return this.http.get(this.BASE_URL+"/target/branch/"+branchId+"?date=" + date).map((response: Array<object>) => {
        let targetData =response;
        let targetMap = {};
        targetData.forEach(targetObj => {
            targetMap[targetObj['branch_product_id']] = targetObj['target']
        });
        return targetMap;
    });
   }

   getCompletedCountForBranchProduct (branchProductId: string) {
    // weekly - Monday - Sunday
    var startDate = moment(new Date()).startOf("week").add(1, 'days').format("YYYY-MM-DD HH:mm:ss");
    var endDate = moment(new Date()).endOf("week").add(1, 'days').format("YYYY-MM-DD HH:mm:ss");
     return this.http.get(this.BASE_URL+"/branchProduct/"+branchProductId+"/count/?startDate="+startDate+"&endDate=" + endDate).map((response: Array<object>) => {
        let completedObj = response
        return completedObj && completedObj.length > 0 ? completedObj[0]["completedCount"] : 0 ;
    });
   }


   login(user: any) {
       return this.http.post(this.BASE_URL + "/auth/login",user)
            .map((response: Response) => {
                let resp = response;
                return resp;
        });
    }

   getDetailsOfBranchProduct (branchProductId: string) {
    // weekly - Monday - Sunday
    var startDate = moment(new Date()).startOf("month").format("YYYY-MM-DD HH:mm:ss");
    var endDate = moment(new Date()).endOf("month").format("YYYY-MM-DD HH:mm:ss");
     return this.http.get(this.BASE_URL+"/branchProduct/"+branchProductId+"/details/?startDate="+startDate+"&endDate=" + endDate).map((response: Response) => {
        let result = response;
        return result;
    });
   }
}

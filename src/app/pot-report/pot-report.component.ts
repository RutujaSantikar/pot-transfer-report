import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SnackbarService } from './snackbar.service';
import { PotserviceService } from './potservice.service';
import { FormGroup, FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { DatePipe } from '@angular/common';

import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { style } from '@angular/animations';


@Component({
  selector: 'app-pot-report',
  templateUrl: './pot-report.component.html',
  styleUrls: ['./pot-report.component.scss'],
  providers:[DatePipe]
})
export class PotReportComponent implements OnInit, AfterViewInit{



  EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  EXCEL_EXTENSION = '.xlsx';
  // GLOBAL  VARIABLES
    getDistrict:any[]= [];
    getDivision:any[]= [];
    getSubDivision:any[]= [];
    showData:any[]=[];
    data:any[]=[];
    showExcel = false
    showFilter = false
    showTable = false
    maxDate = new Date();
     box1:any;
     box2:any;

    // COLUMNS FOR TABLE
   displayedColumns: string[] = ['srNo','complaintNo','location','landmark','stage','reason','reportDate','fromDeputyName','disName', 'potDivision', 'sudName', 'toDeputyName', 'transferDist', 'transferDiv', 'transferSubdiv', 'transferDate','transferRemark'];
   dataSource = new MatTableDataSource<any>;


      // TABLE PAGINATION
   @ViewChild(MatPaginator) paginator:any= MatPaginator;
    ngAfterViewInit() {
     this.dataSource.paginator = this.paginator;
    }

      // CUSTOM SEARCH FILTER
     applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
     }



    constructor(private potReportService : PotserviceService, private snackbarService : SnackbarService,
                private datePipe : DatePipe ) { }

       dataForm = new FormGroup({
           disData : new FormControl(''),
           divisionData : new FormControl(''),
           subDivisionData : new FormControl(''),
           fromDateData:  new FormControl(new Date()),
           toDateData:  new FormControl(new Date()),


           });

              //  WHEN DISTRICT SELECTED GETDIVISION WS WILL BE CALLED
       onChangeDistrict( ){
         const disData= this.dataForm.get('disData')?.value;
         console.log(disData)
         // proper error handling
            this.potReportService.getDivision(disData).subscribe((response:any) => {
            if(!response.error){
                if(response.status === "Success"){
                  // console.log(response);
                     this.getSubDivision=[];
                     if(response.data.length >  0){
                         this.getDivision= response.data;
                        }
                }
                else{
                  this.snackbarService.backendWarningSnackBar("Data not found")
                }

               }
               else{
                  this.snackbarService.warningSnackBar(response.error)
               }

            });


    }



       onChangeDivision(){
        const disData= this.dataForm.get('disData')?.value;
        const divisionData = this.dataForm.get('divisionData')?.value;
        console.log(divisionData)
                 // proper error handling
              this.potReportService.getSubDivision(disData,divisionData).subscribe((response:any) => {
              if(!response.error){
                if(response.status === "Success"){
                  console.log(response);
                   if(response.data.length >  0){
                       this.getSubDivision= response.data;
                         }
                        else{
                           this.snackbarService.errorSnackBar("record not found")
                            }
                 }
                else{
                  this.snackbarService.backendWarningSnackBar("Data not found")
                }
              }
              else{
                this.snackbarService.warningSnackBar(response.error)
              }
              })
              }



    ngOnInit() {

      // only one ws call here- initialized
      this.getDistrict=[];
      this.potReportService.getDistrict().subscribe((response:any) => {
      console.log(response);
      this.getDistrict= response.data;
      console.log(this.getDistrict)
  });

  }




    view(){
      // on search button click
      this.showExcel=true;
      this.showFilter=true;
      this.showTable=true;

      // to take RESPONSE.data in table format
      const disData= this.dataForm.get('disData')?.value;
      const divisionData = this.dataForm.get('divisionData')?.value;
      const subDivisionData = this.dataForm.get('subDivisionData')?.value;
      let  fromDateData  = this.dataForm.get('fromDateData')?.value;
      let  toDateData = this. dataForm.get('toDateData')?.value;


      // console.log(disData);
      // console.log(divisionData);
      // console.log(subDivisionData);


      // var datePipe = new DatePipe();
      const fromDateData1 = this.datePipe.transform(fromDateData,'MM/dd/yyyy');
      const toDateData1 = this.datePipe.transform(toDateData,'MM/dd/yyyy');

       console.log(fromDateData1)
       console.log(toDateData1);

      this.potReportService.getTransferReport(disData, divisionData, subDivisionData, fromDateData1,toDateData1).subscribe((response:any) => {
      console.log(response);

         for(let i=0 ; i<response[0].data.length ; i++){

          if(response[0].data[i]['status'] === "A"){
             this.box1=  response[0].data[i]['status'] = 'Assigned';
          }
          else if(response[0].data[i]['status'] === "C"){
                this.box2 = response[0].data[i]['status'] = 'Closed'
              }

          }

      this.dataSource.data = response[0].data;




      // to take data in excel format
      this.showData = response[0].data;
        for(let i=0 ; i<this.showData.length ; i++){
         this.data.push({
            "Sr No" : i+1,
            "Complaint No" : this.showData[i]['complaintId'],
            "Location" : this.showData[i]['potAddress'],
            "Landmark" : this.showData[i]['potLandmark'],
            "Stage" : this.showData[i]['status'],
            "Reason" : this.showData[i]['potReportComment'],
            "Report Date" : this.showData[i]['potAssignedAt'],
            "From Deputy Name" : this.showData[i]['AssignededDeputyEngineer'],
            "District" : this.showData[i]['potDistrict'],
            "Division ": this.showData[i]['potDivision'],
            "SubDivision": this.showData[i]['potSubDivision'],
            "To Deputy Name": this.showData[i]['TransferDeputyEngineer'],
            "Transfer District": this.showData[i]['transferredDisName'],
            "Transfer Division": this.showData[i]['transferredDivName'],
            "Transfer SubDivision": this.showData[i]['transferredSudName'],
            "Transfer Date": this.showData[i]['potTransferAt'],
            "Transfer Remark": this.showData[i]['potTransferComment'],

            })
         }
      console.log(this.dataSource.data);

      // this.dataSource = new MatTableDataSource<any>(response.data);
      // console.log(this.dataSource)
    });

    }
              //  to show excel
       showInExcel(){

          const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.data);
          const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
          const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
          this.saveAsExcelFile(excelBuffer, 'TransferReport');
       }
      //  to save excel
    saveAsExcelFile(buffer:any, fileName:string){

          const data: Blob = new Blob([buffer], {type: this.EXCEL_TYPE});
           FileSaver.saveAs(data, fileName + '_export_' + new  Date().getTime() + this.EXCEL_EXTENSION);

    }

}

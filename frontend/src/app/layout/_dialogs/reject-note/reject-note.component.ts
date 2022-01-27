import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RequestService } from 'src/app/shared/services/request.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-reject-note',
  templateUrl: './reject-note.component.html',
  styleUrls: ['./reject-note.component.scss']
})
export class RejectNoteComponent implements OnInit {

  form_note: FormGroup
  is_loading = false
  is_submitted = false;

  constructor(
    public dialog_ref: MatDialogRef<RejectNoteComponent>,
    public form_builder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data,
    public request_service: RequestService,
  ) {
    console.log(data)
    this.form_note = this.form_builder.group({
      subject: ["", Validators.required],
      note: ["", Validators.required]
    })
   }

  ngOnInit(): void {
  }

  closeDialog(){
    this.dialog_ref.close();
  }

  sendNote(){
    this.is_submitted = true;
    if(this.form_note.invalid){return}
    this.is_loading = true;
    let data = {
      ...this.form_note.value,
      created_by: this.request_service.id_user, 
      id_user: this.data.id_user,
      id_invoice: this.data.id_invoice, 
      folio: this.data.folio,
      full_name: `${this.request_service.first_name} ${this.request_service.last_name_1}`, 
      company_name: this.data.company_name
    }
    this.request_service.rejectInvoice(data)
    .subscribe(res=>{
      this.is_loading = false;
      if(res.status){
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: res.message
        })
        this.dialog_ref.close(true)
        console.log(res);
      }else{
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: res.message,
        })
      }
    })
  }

  get f() {  return this.form_note.controls }

}

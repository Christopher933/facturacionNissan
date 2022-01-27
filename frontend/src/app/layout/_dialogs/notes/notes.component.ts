import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent implements OnInit {

  submenu_selected:number = 1;
  is_loading:boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  selectSubmenu(number:number){
    this.submenu_selected=number;

  }

  closeDialog(){
    
  }

}

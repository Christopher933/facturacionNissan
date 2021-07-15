import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-spinner',
  template: `
  <div class="spinner-container">
    <div [ngStyle]="setSpinnerStyles()" class="spinner"></div>
  </div>
  `,
  styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent implements OnInit {
  @Input() width:  string = "";
  @Input() height: string = "";
  @Input() color:  string = "";
  @Input() border_width: string = "";

  constructor() { }

  ngOnInit(): void {
  }

  setSpinnerStyles() {
    const styles = {
      'width.px':          this.width        ? this.width        : '',
      'height.px':         this.height       ? this.height       : '',
      'border-left-color': this.color        ? this.color        : '',
      'border-width.px':   this.border_width ? this.border_width : ''
    }

    return styles;
  }


}


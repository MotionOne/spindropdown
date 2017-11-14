import { Component, OnInit } from '@angular/core';
import { UISpinDropdownOption } from './ui-spindropdown.component'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
	ready = false;
  
  fsize_options: UISpinDropdownOption = null;
  
    ngOnInit() {
      if (this.ready == false) {
        this.setup_fsize_options()
        this.ready = true;
      }
    }
  
    setup_fsize_options() {
      this.fsize_options = {
        items: [
          { value: 12, name: '12pt' },
          { value: 16, name: '16pt' },
          { value: 20, name: '20pt' },
          { value: 24, name: '24pt' },
          { value: 28, name: '28pt' },
          { value: 36, name: '36pt' },
          { value: 42, name: '42pt' },
          { value: 56, name: '56pt' },
          { value: 68, name: '68pt' },
          { value: 80, name: '80pt' },
          { value: 96, name: '96pt' },
          { value: 110, name: '110pt' },
          { value: 130, name: '130pt' },
          { value: 145, name: '145pt' },
          { value: 160, name: '160pt' },
        ],
        active_index: 2,
        //button_name: 'font-size',
        button_width: '68px',
        list_width: '86px',
        list_height: '180px',
        show_list_on_hover: true			
      }
    }  
}

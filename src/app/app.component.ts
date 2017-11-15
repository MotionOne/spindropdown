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
          { value: 6, name: '6pt' },
          { value: 8, name: '8pt' },
          { value: 9, name: '9pt' },
          { value: 10, name: '10pt' },
          { value: 11, name: '11pt' },
          { value: 12, name: '12pt' },
          { value: 24, name: '24pt' },
          { value: 18, name: '18pt' },
          { value: 24, name: '24pt' },
          { value: 24, name: '24pt' },
          { value: 30, name: '30pt' },
          { value: 36, name: '36pt' },
          { value: 48, name: '48pt' },
          { value: 60, name: '60pt' },
          { value: 72, name: '72pt' },
          { value: 96, name: '96pt' },
        ],
        active_index: 3,
        button_width: 84,
        list_width: '86px',
        list_height: '180px',
        show_list_on_hover: true,
        input_fn: (str)	=> {
          str = str.trim();

          let item = null;

          // 12.32pt 형식
          const regex = /^([0-9]+(.[0-9]+)?)[ ]*([a-z]*)?/g;
          let m = regex.exec(str);
          if (m == null) {
              alert('잘못된 값입니다.')
          }
          else {
              let val = parseInt(m[1]);
              let unit = m[3];
              unit = 'pt'; // 당분강 강제 'pt'로 설정함.

              val = Math.max(2, val);
              val = Math.min(160, val);
              item = {
                  name: val + unit,
                  value: val
              }
          }
          return item;
        },
        delta_fn: (value, delta)	=> {
          let val = parseInt(value) + delta;
          val = Math.max(2, val);
          val = Math.min(160, val);
          let item = {
              name: val + 'pt',
              value: val
          }
          return item;       
        },
      }
    }  
}

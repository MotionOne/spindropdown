import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';

/*
    필요한 option

    show_on_hover: boolean // mouse over되면 dropdown list를 보여주기 여부. (default는 click시 보여주기)
    button_width
    show_value_in_button
    list_width
    list_height

*/
export interface UISpinDropdownOption {
    items: Array<{          // {...} 또는 "seperator"
        value: any;
        name: string;
        style?: any;
        icon?: string; 
    } | string>             // string은 "seperator" 전달시 수평 seperator 표시됨.
    readonly active_index?: number; // active_index 지정이 있을 때만 (0 이상) active_index 항목의 highlight 처리함.
    button_name?: string;   // 값 지정이 없으면 선택된 항목의 name으로 표시됨.
    button_width?: number;
    list_width?: string;
    list_height?: string;
    large_padding?: boolean;
    show_list_on_hover?: boolean;
}

@Component({
    selector: "ui-dropdown",
    template: `
        <div class='ui-dropdown'>
            <div class='hor-container'>
                <div class='ui-dropdown-btn' (mouseover)='showList_on_hover(true)' (mouseleave)='showList_on_hover(false)' 
                    (click)='toggleShowList($event)'
                    [style.width.px]='options.button_width - 17'
                    [attr.active]='!SHOW_LIST'
                    [attr._disabled]='disabled'
                    tabindex='1'>
                    <input #inputbox class='ui-inputbox' type='text' [value]='getButtonString()' 
                        (keyup.enter)='update(inputbox.value)'
                        (keyup.escape)='update(inputbox.value)'
                        (focus)='onFocusInputBox()'
                        (blur)='onBlurInputBox()'
                        style='width:100%; border:none'>
                </div>
                <div class='ui-spinbox'>
                    <div class='ui-dropdown-up-arrow' (click)='increase_value(1)'>
                        <span class='m1f-arrow-list-single toolbar-btn-icon'></span>
                    </div>
                    <div class='ui-dropdown-down-arrow' (click)='increase_value(-1)'>
                        <span class='m1f-arrow-list-single toolbar-btn-icon'></span>
                    </div>
                </div>
            </div>

            <div *ngIf='!SHOW_LIST'>
                <div class='ui-dropdown-list'
                    [style.width]='options.list_width'
                    [style.height]='options.list_height'
                    [class.ui-dropdown-list-lpadding]='options.large_padding'
                    (mouseover)='showList_on_hover(true)' (mouseleave)='showList_on_hover(false)'
                    (ui-clickOutside)='focus_blur()'>
                    <div *ngFor='let item of options.items'>
                        <div *ngIf='item != "seperator"' class='ui-dropdown-item' 
                            [attr.active]='current_sel == item'
                            [class.ui-dropdown-item-lpadding]='options.large_padding'
                            [ngStyle] = 'item.style'
                            (click)='onClick(item)'>
                            <span *ngIf='item.icon' class='toolbar-btn-icon' [ngClass]='item.icon'></span>
                            &nbsp;{{item.name}}
                        </div>
                        <div class='ui-dropdown-list-seperator' *ngIf='item == "seperator"'>
                        <div>  
                    </div>
                </div>
            </div>
        </div>
    `,
	styleUrls: ['./ui-spindropdown.component.css']
})
export class UISpinDropdown implements OnInit {
    @Input('options') options = null;
    @Input('disabled') disabled = false;
    @Output('select') select = new EventEmitter();
    @ViewChild('inputbox') inputboxEl: ElementRef;
    show_list_case_hover = false;
    tentative_hide = false; // hover시에만 사용됨.
    inputBoxFocus = false;

    show_list_case_click = false;
    current_sel = null;

    constructor(
    ) {
    }

    ngOnInit() {
        if (this.options.active_index != undefined)
            this.current_sel = this.options.items[this.options.active_index];
    }

    get SHOW_LIST() {
        if (this.options.show_list_on_hover) {
            return !this.show_list_case_hover;
        }
        else {
            return !this.show_list_case_click;
        }
    }

    toggleShowList(e) {
        this.show_list_case_click = !this.show_list_case_click;
        e.stopPropagation();
    }

    showList_on_hover(val:boolean) {
        // tentative_hide는 hide시 약간의 delay를 주어 hide하기 위해 사용.
        // dropdown button과 list사이를 왔다갔다 할 때 show가 유지되도록 하기 위함.

        // console.log("showList_on_hover: ", val);
        if (val && this.inputBoxFocus == false) {
            this.show_list_case_hover = val;
            this.tentative_hide = false;
        }
        else {
            this.tentative_hide = true;
            setTimeout(_ => {
                if (this.tentative_hide) {
                    this.show_list_case_hover = false;
                    this.tentative_hide = false;
                }
            }, 10)
        }
    }

    focus_blur() {
        // console.log('focus_blur()..');
        this.show_list_case_click = false;
        
    }

    getButtonString() {
        if (this.options.button_name != undefined)
            return this.options.button_name;
        else if (this.current_sel)
            return this.current_sel.name;
        else
            return '';
    }

    _setValue(item) {
        // console.log(item);
        this.show_list_case_hover = false;
        this.show_list_case_click = false;

        if (this.options.active_index != undefined)
            this.current_sel = item;
        this.select.emit(item);
    }
    
    onClick(item) {
        console.log('item selected.');
        this._setValue(item)
    }

    // focus를 받으면 전체 선택이 되어 있도록 한다.
    onFocusInputBox() {
        this.inputBoxFocus = true;
        let el = this.inputboxEl.nativeElement;
        el.setSelectionRange(0, el.value.length);

        this.showList_on_hover(false);
    }
    onBlurInputBox() {
        this.inputBoxFocus = false;
        
        let el = this.inputboxEl.nativeElement;
        this.update(el.value);
    }

    update(str) {
        console.log('inputbox Blur called');        
        console.log(str);
        str = str.trim();
     
        // 12.32pt 형식
        const regex = /^([0-9]+(.[0-9]+)?)[ ]*([a-z]*)?/g;
        let m = regex.exec(str);
        if (m == null) {
            console.log('this.current_sel:', this.current_sel)
            alert('잘못된 값입니다.')
            this.inputboxEl.nativeElement.value = this.current_sel.name;
        }
        else {
            let val = m[1];
            let unit = m[3];
            unit = 'pt'; // 당분강 강제 'pt'로 설정함.

            let item = {
                name: val + unit,
                value: val
            }
            this._setValue(item);
            this.inputboxEl.nativeElement.value = item.name;
        }
    }

    increase_value(step) {
        console.log(this.current_sel)
        let val = parseInt(this.current_sel.value) + step;
        let item = {
            name: val + 'pt',
            value: val
        }
        this._setValue(item);
        this.inputboxEl.nativeElement.value = item.name;
    }
}

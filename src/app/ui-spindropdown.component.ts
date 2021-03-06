import { Component, Directive, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

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
    delta_step: Array<number>;      // [1, 10]인 경우 기본delta는 1, 큰 delta는 10 
    input_fn: (str)=>{name, value}
    delta_fn: (value, delta)=>{name, value}  // value:현재값, delta:적용할 증감값
}
export interface UISpinDropdownResult {
    item: {
        name: string,
        value: number,
    }
    opt: {
        focus_control?: string
    }
}

@Component({
    selector: "ui-spindropdown",
    template: `
        <div class='ui-dropdown'>
            <div class='hor-container'>
                <ng-content></ng-content>
                <div class='ui-dropdown-btn' (mouseover)='showList_on_hover(true)' (mouseleave)='showList_on_hover(false)' 
                    (click)='toggleShowList($event)'
                    [style.width.px]='options.button_width - 17'
                    [attr.active]='!SHOW_LIST'
                    [attr._disabled]='disabled'
                    tabindex='1'>
                    <input #inputbox class='ui-inputbox' type='text' [value]='getButtonString()' spellcheck="false"
                        (keydown)='onKeydownInputBox($event)'
                        (focus)='onFocusInputBox()'
                        (blur)='onBlurInputBox()'
                        style='width:100%; border:none'>
                </div>
                <div class='ui-spinbox'>
                    <div #spinup class='ui-dropdown-up-arrow noselect' (mousedown)='auto_increase_value(1)'>
                        <span class='m1f-arrow-list-single toolbar-btn-icon'></span>
                    </div>
                    <div class='ui-dropdown-down-arrow noselect' (mousedown)='auto_increase_value(-1)'>
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
    @Output('changed') changed = new EventEmitter<UISpinDropdownResult>();
    @ViewChild('inputbox') inputboxEl: ElementRef;
    @ViewChild('spinup') spinupEl: ElementRef;
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

    onClick(item) {
        console.log('item selected.');
        this._setValue(item)
    }

    
    onFocusInputBox() {
        this.inputBoxFocus = true;

        // focus를 받으면 전체 선택이 되어 있도록 하려했지만, setSelectionRange()를 하면 input focus를 잃어버리는 문제있음.
        // let el = this.inputboxEl.nativeElement;
        // el.setSelectionRange(0, el.value.length);

        this.showList_on_hover(false);
    }


    /*D171116
        이벤트 순서에 민감하니 canvas-main.component.ts::onMouseDown를 참조할 것.
    */
    onBlurInputBox() {
        this.inputBoxFocus = false;
        
        let el = this.inputboxEl.nativeElement;
        console.log('input text: ', el.value)
        this.update_by_string_value(el.value);
    }

    onKeydownInputBox(event) {
        let el = this.inputboxEl.nativeElement;
        let delta_val = event.shiftKey ? this.options.delta_step[1] : this.options.delta_step[0];
        
        /* 
            text를 selection(ctrl+a등)하면 focus를 잃게 되고 blur이벤트가 발생하고 거기서 this.update()가 불리는 문제있음.
        */
        switch(event.keyCode) {
            case 13: // enter
            case 27: //escape
            this.update_by_string_value(el.value);
                event.stopPropagation();
                event.preventDefault();
                break;
            // case 27: //escape
            //     this.inputboxEl.nativeElement.value = this.getButtonString();            
            //     event.stopPropagation();
            //     event.preventDefault();
            //     break;
            case 38: // arrow up
                this.increase_value(delta_val, {focus_control:'dont_focus'});
                event.stopPropagation();
                event.preventDefault();
                break;
            case 40: // arrow down
                this.increase_value(-delta_val, {focus_control:'dont_focus'});
                event.stopPropagation();
                event.preventDefault();
                break;
            default:            
                break;
        }

        event.stopPropagation();
        // event.preventDefault();
    }

    ////////////////////////////////////////////////////////////////////////////////////
    // private method

    update_by_string_value(str) {
        let item = this.options.input_fn(str);
        if (item == null) {
            this.inputboxEl.nativeElement.value = this.getButtonString();
        }
        else {
            this._setValue(item);
            this.inputboxEl.nativeElement.value = item.name;            
        }
    }

    increase_value(step, opt?) {
        let cur_item = this.options.input_fn(this.inputboxEl.nativeElement.value);
        if (cur_item == null)
            return;

        let item = this.options.delta_fn(cur_item.value, step);

        // opt {focus_control:'dont_focus'}
        // 커서키 up/down으로 값을 변경시 focus가 textbox에 가지 않도록 유지한다.
        this._setValue(item, opt);
        this.inputboxEl.nativeElement.value = item.name;
    }

    /* 
        기능 : 마우스를 누르고 있는 동안, 반복 호출 한다.
        
        주의 사항 :
        버튼에 .noselect지정을 하여 text가 select 되지 않도록 해야한다.
        그렇게 해야 document의 mouseup 이벤트를 browser 외부에서도 받을 수 있다.
    */
    auto_increase_value(step) {
        this.increase_value(step); // 단발로 끝날 수 있으므로 하나는 실행한다.

        let opt = {
            delay: 500,     // unit:ms
            interval: 50    // unit:ms
        }
        
        let mousedown = Observable
            .interval(opt.interval)     //  opt.interval 간격으로 값을 발생시킴.
            .map(x => ({val:x, state: 'none'}))
            .delay(opt.delay)            // opt.delay 만큼의 delay를 줌 

        let mouseup = Observable.create(observer => {
            function handler(event) {
                // next()는 complete()를 호출하기 전까지 여러번 부를 수 있다. 
                observer.next({val:0, state:'stop'});
                observer.complete();
                document.removeEventListener('mouseup', handler);
            }
            document.addEventListener('mouseup', handler)
        });

        Observable.merge(mousedown, mouseup)
        .takeWhile(x => x.state != 'stop')
        .subscribe(
            x => {
                // console.log('next: ',x)
                this.increase_value(step);
            },
            err => {
                // console.log('err: ', err);
            },
            () => {
                console.log('auto-fire completed.');
            }
        )
    }

    _setValue(item, opt?) {
        // console.log(item);
        this.show_list_case_hover = false;
        this.show_list_case_click = false;

        if (this.options.active_index != undefined)
            this.current_sel = this.options.items.find(_item => _item.name == item.name);

        this.options.button_name = item.name;
        
        if (item == undefined)
            console.log('aaa')

        this.changed.emit({
            item: item,
            opt: opt,
        });
    }    
}

import {Directive, Input, OnChanges, SimpleChanges} from '@angular/core';
import {ValidateFn} from "codelyzer/walkerFactory/walkerFn";
import {NG_VALIDATORS, ValidationErrors, Validator, Validators} from "@angular/forms";

// https://www.jokecamp.com/blog/angular-whitespace-validator-directive/#validator
import { AbstractControl, ValidatorFn } from '@angular/forms';

export function Singlewordonlyvalidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } => {
    if(!control.value){
      return null;
    }
    debugger;
    return control.value.split(" ").length <= 1 ? null : {'noSingleWord' : 'must be one word only'};
  };
}

@Directive({
  selector: '[singlewordonly][ngModel]',
  providers: [
    { provide: NG_VALIDATORS, useExisting:  SinglewordonlyvalidatorDirective, multi: true }
  ]
})
export class SinglewordonlyvalidatorDirective implements Validator{

  private valFn = Singlewordonlyvalidator();

  constructor() { }

  validate(control: AbstractControl): { [key: string]: any } {
   return this.valFn(control);
  }


}

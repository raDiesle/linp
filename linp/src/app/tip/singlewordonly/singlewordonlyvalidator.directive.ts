import {Directive} from '@angular/core';
// https://www.jokecamp.com/blog/angular-whitespace-validator-directive/#validator
import {AbstractControl, NG_VALIDATORS, Validator, ValidatorFn} from '@angular/forms';

export function Singlewordonlyvalidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } => {
    if (!control.value) {
      return null;
    }
    return control.value.split(' ').length <= 1 ? null : {'singlewordonly': 'must be one word only'};
  };
}

@Directive({
  selector: '[singlewordonlyvalidator][ngModel]',
  providers: [
    {provide: NG_VALIDATORS, useExisting: SinglewordonlyvalidatorDirective, multi: true}
  ]
})
export class SinglewordonlyvalidatorDirective implements Validator {

  private valFn = Singlewordonlyvalidator();

  constructor() {
  }

  validate(control: AbstractControl): { [key: string]: any } {
    return this.valFn(control);
  }


}

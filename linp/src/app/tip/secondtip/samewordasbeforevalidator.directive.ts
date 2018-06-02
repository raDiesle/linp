import { Directive, Input } from '@angular/core';
// https://www.jokecamp.com/blog/angular-whitespace-validator-directive/#validator
import { AbstractControl, NG_VALIDATORS, Validator, ValidatorFn } from '@angular/forms';

export function SamewordasbeforeValidator(getFirstSynonym): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } => {
    const firstSynonym = getFirstSynonym();

    if (!control.value || firstSynonym === '') {
      return null;
    }
    const invalid = { 'samewordasbeforevalidator': 'not same word again' };

    return control.value.includes(firstSynonym) === false ? null : invalid;
  };
}

@Directive({
  selector: '[samewordasbeforevalidator][ngModel]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: SamewordasbeforevalidatorDirective, multi: true }
  ]
})
export class SamewordasbeforevalidatorDirective implements Validator {

  @Input()
  public firstSynonym: string;

  private getFirstSynonym = (() => this.firstSynonym);
  private valFn = SamewordasbeforeValidator(this.getFirstSynonym);

 
  
  constructor() {
    
  }

  validate(control: AbstractControl): { [key: string]: any } {
    return this.valFn(control);
  }

}



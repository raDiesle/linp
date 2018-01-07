// https://filipmolcik.com/angular-2-local-storage/
export function LocalStorage(target: Object, // The prototype of the class
                             decoratedPropertyName: string // The name of the property
) {

  // get and set methods
  Object.defineProperty(target, decoratedPropertyName, {
    get: function () {
      return localStorage.getItem(decoratedPropertyName) || '';
    },
    set: function (newValue) {
      localStorage.setItem(decoratedPropertyName, newValue);
    }
  });
}

export function SessionStorage(
  target: Object, // The prototype of the class
  decoratedPropertyName: string // The name of the property
) {

  // get and set methods
  Object.defineProperty(target, decoratedPropertyName, {
    get: function () {
      return sessionStorage.getItem(decoratedPropertyName) || '';
    },
    set: function (newValue) {
      sessionStorage.setItem(decoratedPropertyName, newValue);
    }
  });
}

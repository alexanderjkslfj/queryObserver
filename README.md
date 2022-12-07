# queryObserver
Tiny Javascript library to easily create an observer watching for new elements matching a css selector.

Its intended use is for userscripts. If a site you write a script for dynamically adds elements it can be tempting to simply use a timeout to select the dynamically added elements. This library offers non-invasive methods to listen for dynamically added elements using a MutationObserver.

## Usage
```javascript
import { queryObserverAll } from "./queryObserver.js"

// Adds a div to the document. This will be passed to the callback.
document.body.appendChild(document.createElement("div"))

// Will execute the callback for all current and future divs in the body.
const disconnect = queryObserverAll("div", (node) => {
  console.log("Wow! I found another div:", node)
})

// Adds a div to the document. This will be passed to the callback.
document.body.appendChild(document.createElement("div"))

// Adds a different element to the document. This will not be passed tot the callback.
document.body.appendChild(document.createElement("notadiv"))

// Disconnects the observer. No more nodes will be passed to the callback.
disconnect()

// Adds a div to the document. This will not be passed to the callback, because the observer has been disconnected.
document.body.appendChild(document.createElement("div"))
```
```javascript
import { queryObserver } from "./queryObserver.js"

// Will execute the callback only(!) for the first div it finds.
queryObserver("div", (node) => {
  console.log("I found the element I was searching for:", node)
})

// Adds a div to the document. This will be passed to the callback.
document.body.appendChild(document.createElement("div"))
// Adds a div to the document. This will not be passed to the callback.
document.body.appendChild(document.createElement("div"))

// No need to disconnect. The observer disconnects automatically once it finds the element.
```
```javascript
import { queryObserver } from "./queryObserver.js"

// Will not be passed to the callback
document.body.appendChild("div")
document.body.firstChild.appendChild("div")

// Will execute the callback for the first future (not current) div added to the body's first child.
queryObserver("div", () => {
  console.log("A div was added to the body's first child!")
}, false, document.body.firstChild)

// Will not be passed to the callback
document.body.appendChild("div")

// Will be passed to the callback
document.body.firstChild.appendChild("div")

// Will not be passed to the callback
document.body.firstChild.appendChild("div")
```

## Documentation
**queryObserver**

This method executes the given callback for the first element found which matches the given css selector.

| Parameter | Type                              | Description                                                           | Default             |
| :---      | :---                              | :---                                                                  | :---                |
| selector  | ```string```                      | The observer searches for an element matching this css selector.      | -                   |
| callback  | ```(node: HTMLElement) => any```  | This callback is called when a matching element is found.             | -                   |
| current   | ```boolean```                     | Whether to check already existing elements too (or only future ones). | ```true```          |
| parent    | ```Node```                        | Node whose children are observed.                                     | ```document.body``` |

Returns a method. When this method is called, the observer is disconnected and no longer operates.
(The observer automatically disconnects when it finds the node searched for.)

**queryObserverAll**

This method executes the given callback for each (current and future) element matching the given css selector.

| Parameter | Type                              | Description                                                           | Default             |
| :---      | :---                              | :---                                                                  | :---                |
| selector  | ```string```                      | The observer searches for elements matching this css selector.        | -                   |
| callback  | ```(node: HTMLElement) => any```  | This callback is called for each matching element found.              | -                   |
| current   | ```boolean```                     | Whether to check already existing elements too (or only future ones). | ```true```          |
| parent    | ```Node```                        | Node whose children are observed.                                     | ```document.body``` |

Returns a method. When this method is called, the observer is disconnected and no longer operates.

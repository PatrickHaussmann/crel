/* Copyright (C) 2012 Kory Nunn
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

NOTE:
This code is formatted for run-speed and to assist compilers.
This might make it harder to read at times, but the code's intention should be transparent. */

// IIFE our function
((exporter) => {
  // Define our function and its properties
  // Helper functions used throughout the script
  const isType = (object, type) => typeof object === type,
    isElement = (object) => object instanceof Element,
    isNode = (node) => node instanceof Node,
    // Recursively appends children to given element. As a text node if not already an element
    appendChild = (element, child) => {
      if (child) {
        if (Array.isArray(child)) {
          // Support (deeply) nested child elements
          child.map((subChild) => appendChild(element, subChild));
        } else if (isNode(child)) {
          element.appendChild(child);
        } else if (isType(child, "string")) {
          child = document.createTextNode(child);
          element.appendChild(child);
        } else if (isType(child, "function")) {
          let return_el = child(element);
          if (isNode(return_el)) {
            element.appendChild(return_el);
          }
        } else console.error("Unsupported type of child");
      }
    },
    // Define our function as a proxy interface
    crel = new Proxy(
      (element, ...children) => {
        // If first argument is an element, use it as is, otherwise treat it as a tagname
        if (!isElement(element)) {
          if (!isType(element, "string") || element == "") {
            console.error("invalid input");
            return; // Do nothing on invalid input
          }
          if (element.startsWith("#")) {
            element = document.getElementById(element.slice(1));
            if (!element) throw "No element with this id";
          } else {
            element = document.createElement(element);
          }
        }
        // Define all used variables / shortcuts here, to make things smaller once compiled
        let settings = children[0],
          key,
          attribute;
        // Check if second argument is a settings object
        if (
          isType(settings, "object") &&
          !isNode(settings) &&
          !Array.isArray(settings)
        ) {
          // Don't treat settings as a child
          children.shift();
          // Go through settings / attributes object, if it exists
          for (key in settings) {
            // Store the attribute into a variable, before we potentially modify the key
            attribute = settings[key];
            // Get mapped key / function, if one exists
            key = crel.attrMap[key] || key;
            // Note: We want to prioritise mapping over properties
            if (isType(key, "function")) {
              key(element, attribute);
            } else if (isType(attribute, "function")) {
              // ex. onClick property
              element[key] = attribute;
            } else {
              // Set the element attribute
              element.setAttribute(key, attribute);
            }
          }
        }
        // Append remaining children to element and return it
        appendChild(element, children);
        return element;
      },
      {
        // Binds specific tagnames to crel function calls with that tag as the first argument
        get: (target, key) => {
          if (key in target) {
            // Crel internals like attrMap and cached
            return target[key];
          }
          // Transform key and cached
          let transformedKey = target.tagTransform(key);
          target[key] = target.bind(null, transformedKey);
          return target[key];
        },
      }
    );

  // Used for mapping attribute keys to supported versions in bad browsers, or to custom functionality
  crel.attrMap = {
    on: (element, value) => {
      for (let eventName in value) {
        if (Object.hasOwnProperty.call(value, eventName)) {
          element.addEventListener(eventName, value[eventName]);
        }
      }
    },
    style: (element, value) => {
      for (let styleName in value) {
        if (Object.hasOwnProperty.call(value, styleName)) {
          element.style[styleName] = value[styleName];
        }
      }
    },
  };

  // Transforms tags on call, to for example allow dashes in tags
  crel.tagTransform = (key) => key;

  // Export crel
  exporter(crel);
})((product) => {
  if (typeof exports === "object") {
    // Export for Browserify / CommonJS format
    module.exports = product;
  } else if (typeof define === "function" && define.amd) {
    // Export for RequireJS / AMD format
    define(() => product);
  } else {
    // Export as a 'global' function
    this.crel = product;
  }
});

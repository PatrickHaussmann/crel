# Notice: this is a private fork

The original project is [KoryNunn/crel](https://github.com/KoryNunn/crel)

If you want to switch from the original to this fork read the [Migration Guide](#migration-from-legacy)

![crel](https://raw.githubusercontent.com/KoryNunn/crel/master/logo.png)

# What

A small, simple, and fast DOM creation utility

# Installing

```html
<script src="https://cdn.jsdelivr.net/gh/PatrickHaussmann/crel@master/crel.min.js"></script>
```

# Improvements over the original

- Proxy as default api
- Custom tagTransform
- Prepopulated attrMap with eventListener and style
- Middleware functions

# Transform Tag

If you want to transform tags to for example get dashes in them, you can define a `tagTransform` function:

```javascript
// Adds dashes on camelCase, ex: `camelCase` -> `camel-case`
crel.tagTransform = (key) => key.replace(/([A-Z])/g, "-$1");
let element = crel.myTag("Crello World!");
console.log(element.tagName); // my-tag
```

# Attach EventListener

```javascript
// Attaches an onClick event to the img element
crel.img({
  on: {
    click: () => {
      console.log("Clicked");
    },
  },
});
```

# Set CSS Style

```javascript
crel.div({
  style: {
    display: "flex",
    height: "50vh",
  },
});
```

# Middleware function

```javascript
crel.div(
  crel.h1(),
  crel.div((element) => {
    fetch("/api/username")
      .then((response) => response.text())
      .then((data) => {
        element.textContent = data;
      });
  }),
  crel.p()
);
```

# Migration from Legacy

The only thing you need to do is to insert these lines into your project. After that, the API will be fully backward compatible with the original project.

```javascript
crel.proxy = crel;
crel.isElement = (object) => object instanceof Element;
crel.isNode = (node) => node instanceof Node;
```

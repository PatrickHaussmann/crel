# Notice: this is a private fork

The original project is [KoryNunn/crel](https://github.com/KoryNunn/crel)

Scripts written with the original should be compatible with this version!

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

# Transform Tag

If you want to transform tags to for example get dashes in them, you can define a `tagTransform` function:

```javascript
// Adds dashes on camelCase, ex: `camelCase` -> `camel-case`
crel.tagTransform = (key) => key.replace(/([0-9a-z])([A-Z])/g, "$1-$2");
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

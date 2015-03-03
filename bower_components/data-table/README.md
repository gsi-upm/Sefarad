data-table
==========

Ember Component for comparing two or more similar datasets.

```hbs
{{data-table dataset=dataset aliases=aliases}}
```

Here's a [demo][1] jsbin.

## Getting Started

Install via Bower, `bower install data-table --save`, then include in your page, and start using.

### Available Attributes

### Required
- __dataset__ - an Array of POJOs or Ember Data model records.

### Optional
- __defaultColumns__ - An array of type/attribute column mappings. These show up in the table. e.g. `['user:name', 'post:title']`.

[1]: http://emberjs.jsbin.com/royob/2

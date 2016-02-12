
# serialise2jsonapi

An easy-to-use JSON:API serialiser that does more of what you need it to and less of what you don't.

It doesn't handle relationships yet, but I intend to add that.

## Installation

    $ npm install --save serialise2jsonapi


## Manual

### Usage

```js
import Serialiser from 'serialise2jsonapi';

let serialiser = new Serialiser(resourceRoot, idField);
```

### `new Serialiser(resourceRoot, idField)`

| param | description |
|-------|-------------|
| resourceRoot | the base URL of your API e.g. 'http://myapi.org/api' |
| idField | the name of the ID field of your resources e.g. 'id' |

Constructs a new instance.  The generated links will use `resourceRoot` as the base URL.

### `serialiser.serialise(resource, data, links)`

| param | description |
|-------|-------------|
| resource | the name of the resource, e.g. 'users' |
| data | the data to serialise, as a POJO |
| links | any links to be added in an object hash |

Serialises `data` into JSON API compatible format.  `data` can be either a single object, an array of objects, or an `Error`.

**single object**

```js
let serialiser = new Serialiser('http://myapi.org/api', 'id');
serialiser.serialise('users', {id: '1', name: 'Fred Flintstone'});

/* returns:
{
  links: {
    self: 'http://myapi.org/api/users/1'
  },
  data: {
    type: 'users',
    id: '1',
    attributes: {
      name: 'Fred Flintstone'
    }
  }
}
*/
```

**array of objects**

```js
let serialiser = new Serialiser('http://myapi.org/api', 'id');
serialiser.serialise('users', [
  {id: '1', name: 'Fred Flintstone'},
  {id: '2', name: 'Wilma Flintstone'}
]);

/* returns:
{
  links: {
    self: 'http://myapi.org/api/users'
  },
  data: [{
    type: 'users',
    id: '1',
    links: {
      self: 'http://myapi.org/api/users/1'
    },
    attributes: {
      name: 'Fred Flintstone'
    }
  },
  {
    type: 'users',
    id: '2',
    links: {
      self: 'http://myapi.org/api/users/2'
    },
    attributes: {
      name: 'Wilma Flintstone'
    }
  }]
}
*/
```

**Error**

```js
let serialiser = new Serialiser('http://myapi.org/api', 'id');
serialiser.serialise('users', new Error('oh no!'));

/* returns:
{
  error: {
    message: 'oh no!',
    type: 'Error',
    code: undefined,
    status: undefined
  }
}
*/
```

The `links` parameter lets you supply additional links, e.g. for paging.  For convenience it will convert links starting with `'~'` to be relative to the `self` link, and those starting with `'/'` to be relative to the `resourceRoot`.

E.g.

```js
let serialiser = new Serialiser('http://myapi.org/api', 'id');

serialiser.serialise('users', [
  {id: '1', name: 'Fred Flintstone'},
  {id: '2', name: 'Wilma Flintstone'}
], {
  next: '~?page[number]=3',
  prev: '~?page[number]=1',
  posts: '/posts'
});

/* returns:
{
  links: {
    next: 'http://myapi.org/api/users?page[number]=3',
    prev: 'http://myapi.org/api/users?page[number]=1',
    posts: 'http://myapi.org/api/posts',
    self: 'http://myapi.org/api/users'
  },
  data: [{
    type: 'users',
    id: '1',
    links: {
      self: 'http://myapi.org/api/users/1'
    },
    attributes: {
      name: 'Fred Flintstone'
    }
  },
  {
    type: 'users',
    id: '2',
    links: {
      self: 'http://myapi.org/api/users/2'
    },
    attributes: {
      name: 'Wilma Flintstone'
    }
  }]
}
*/
```

## Licence, etc

This project is MIT licensed, so do what you like with it.  Feedback, suggestions, issues, and pull requests welcome.

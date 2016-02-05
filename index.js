
var clone = require('clone');


function Serialiser(resourceRoot, idField) {
  this.resourceRoot = resourceRoot;
  this.idField = idField;
}


Serialiser.prototype.serialise = function (resource, data, links) {
  links = links || {};

  if (data instanceof Error) {
    return {
      error: {
        message: data.message,
        type: data.name,
        code: data.code,
        status: data.status
      }
    };

  } else {
    // if the caller didn't supply a self link, figure it out
    if (!links.self) {
      links.self = this.resourceRoot + '/' + resource;

      if (!Array.isArray(data) && data[this.idField]) {
        links.self += '/' + data[this.idField];
      }
    }

    // for convenience, translate '~' to links.self and '/' to the resource root
    for (var k in links) {
      links[k] = links[k].replace(/^~/, links.self).replace(/^\//, '/' + this.resourceRoot);
    }

    return {
      links: links,
      data: this._serialise(resource, false, clone(data))
    };
  }
};


Serialiser.prototype._serialise = function (resource, includeLink, data) {
  if (Array.isArray(data)) {
    return data.map(this._serialise.bind(this, resource, true));

  } else {
    var result = {
      type: resource,
      id: data[this.idField],
    };

    if (includeLink) {
      result.links = {
        self: this.resourceRoot + '/' + resource + '/' + data[this.idField]
      };
    }

    delete data[this.idField];
    result.attributes = data;
    return result;
  }
};

module.exports = Serialiser;

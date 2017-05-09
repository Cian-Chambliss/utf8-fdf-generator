var fs = require('fs');
var iconvLite = require('iconv-lite');
var convertUTF16 = function(text) {    
    var buffer =  iconvLite.encode(text,'utf16') , i , tmp;
    for( i = 0 ; i < buffer.length ; i += 2 ) {
      tmp = buffer[i];
      buffer[i] = buffer[i+1];
      buffer[i+1] = tmp;
    }
    return buffer;
};

exports.generator = function(data, fileName) {
  var header, body, footer, dataKeys;

  header = Buffer([]);
  header = Buffer.concat([ header, new Buffer("%FDF-1.2\n") ]);
  header = Buffer.concat([ header, new Buffer((String.fromCharCode(226)) + (String.fromCharCode(227)) + (String.fromCharCode(207)) + (String.fromCharCode(211)) + "\n") ]);
  header = Buffer.concat([ header, new Buffer("1 0 obj \n") ]);
  header = Buffer.concat([ header, new Buffer("<<\n") ]);
  header = Buffer.concat([ header, new Buffer("/FDF \n") ]);
  header = Buffer.concat([ header, new Buffer("<<\n") ]);
  header = Buffer.concat([ header, new Buffer("/Fields [\n") ]);

  footer = Buffer([]);
  footer = Buffer.concat([ footer, new Buffer("]\n") ]);
  footer = Buffer.concat([ footer, new Buffer(">>\n") ]);
  footer = Buffer.concat([ footer, new Buffer(">>\n") ]);
  footer = Buffer.concat([ footer, new Buffer("endobj \n") ]);
  footer = Buffer.concat([ footer, new Buffer("trailer\n") ]);
  footer = Buffer.concat([ footer, new Buffer("\n") ]);
  footer = Buffer.concat([ footer, new Buffer("<<\n") ]);
  footer = Buffer.concat([ footer, new Buffer("/Root 1 0 R\n") ]);
  footer = Buffer.concat([ footer, new Buffer(">>\n") ]);
  footer = Buffer.concat([ footer, new Buffer("%%EOF\n") ]);

  dataKeys = Object.keys(data);

  body = new Buffer([]);

  for(var i=0; i<dataKeys.length; i++) {
    var name = dataKeys[i];
    var value = data[name];

    body = Buffer.concat([ body, new Buffer("<<\n") ]);
    body = Buffer.concat([ body, new Buffer("/T (") ]);
    body = Buffer.concat([ body, convertUTF16(name.toString()) ]);
    body = Buffer.concat([ body, new Buffer(")\n") ]);
    body = Buffer.concat([ body, new Buffer("/V (") ]);
    body = Buffer.concat([ body, convertUTF16(value.toString()) ]);
    body = Buffer.concat([ body, new Buffer(")\n") ]);
    body = Buffer.concat([ body, new Buffer(">>\n") ]);
  }

  fs.writeFileSync(fileName, Buffer.concat([ header, body, footer ]));
}

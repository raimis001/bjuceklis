var events = require('events')
var loader = {}

function jsonLoader(url) {
    this.url	= url;
		this.data = null;
}
loader.jsonLoader = jsonLoader

loader.jsonLoader.prototype.load = function () {
	
    var xhr = new XMLHttpRequest()
		var self = this;
		xhr.onload = function (e) {
			var s = e.target.response;
			
			try {
				self.data = JSON.parse(s);
			} catch (ex) {}
			console.log("data loaded:",self.data);
			if (self.data) 
				self.loaded(self.data);
				else self.onerror();
		}
		
    xhr.open('GET', this.url, true)  
    xhr.send(null)
}
loader.jsonLoader.prototype.loaded = function () {}
loader.jsonLoader.prototype.onerror = function () {}


module.exports = loader

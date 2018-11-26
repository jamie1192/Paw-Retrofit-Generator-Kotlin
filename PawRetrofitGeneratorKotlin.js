var mustache = require('./mustache');
var URI = require('URI.js');

var PawRetrofitGeneratorKotlin = function() {

	this.getEnvironmentVars = function(url, context, domName, envName) {

		var envObj = JSON.stringify(context.getEnvironmentDomainByName(domName).getEnvironmentByName(envName).getVariablesValues());
		
		// console.log("ObjList " + JSON.stringify(envObj));

		if(envObj) {
			console.log("envObj: " + envObj);

			// for(var item in obj.options) {
			// 	console.log(obj.options[item]);
			//   }

			Object.keys(envObj).forEach(element => {
				console.log("element: " + envObj[element]);
			}); 

			for (envVar in envObj) {
				var value = envObj[envVar].key;
				console.log("Value: " + value);
				url.replace(value, "{" + envVar.name + "}");
			}

		}
		console.log("Fixed url: " + url);
		return url;
	}

	this.url = function(request) {
		return {
			"fullpath": request.url
		};
	};

	this.getMethodName = function(requestName) {
		var name = requestName.name;

		return name.replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
			return index == 0 ? letter.toLowerCase() : letter.toUpperCase();
		  }).replace(/\s+/g, '');
	};

	this.getURI = function(uri) {
		return str = URI(uri).search(true);
	};

	this.trimBaseUrl = function(request) {

		var url = request.url;
		var sub;// = url.substring(0, url.indexOf(".net/"));
		if(url.substring(0, url.indexOf(".net/"))) {
			console.log(".net found");
			sub = url.substring(0, url.indexOf(".net/"));
			sub = url.replace(sub + ".net/", "");
		}
		else if(url.substring(0, url.indexOf(".com/"))) {
			console.log(".com found");
			sub = url.substring(0, url.indexOf(".com/"));
			sub = url.replace(sub + ".com/", "");
		}
		return "/" + sub;
		// return url.substring(0, url.lastIndexOf(sub + ".net"));
		// return url.replace(request.urlBase, "");
	};

	this.setDynamicVars = function(strings) {

		// for (str in strings) {
			console.log(strings.getVariablesValues);
		// }
	};

	this.queryParams = function(request) {

		var paramList = [];
		// var qParams = URI(request.url).search(true);
		var count = request.getUrlParameters().length;
		// console.log(JSON.stringify(request));
		var size = request.getUrlParametersNames().length;
		for (paramObj in request.getUrlParameters()) {
			// var value = request[paramObj];
			console.log("TEST: " + paramObj);

			//append closing parenthesis, no comma
			// if(paramObj == request.getUrlParametersNames().slice(-1)) {
			if(paramObj == request.getUrlParametersNames()[size - 1]) {
				// @Query("request") String request
				// @Path("membershipType") mType: String,
				
				
				var queryString = "@Query(\"" + paramObj + "\") " + paramObj + ": String" +"";
				
				console.log(queryString);
				paramList.push({ 
					"name": queryString
				});
			}
			else { 
				var queryString = "@Query(\"" + paramObj + "\") " + paramObj + ": String" +",";
				console.log(queryString);
				paramList.push({ 
					"name": queryString
				});
			}
			 console.log(JSON.stringify(paramList));
			// paramList.push(value);
		}
		console.log("b4 loop: " + paramList[1]);
		return paramList;
	};


 
	this.generate = function(context, requests, options) {
		var generated = "";

		// this.setDynamicVars(context);
		
		
		//iterate requests
		for (var i in requests) {
			var request = requests[i];

			console.log("Context: " + JSON.stringify(context));
			// console.log("env dom: " + context.)
			console.log("groups: " + JSON.stringify(context.getEnvironmentDomainByName("Bungie").getEnvironmentByName("Production").getVariablesValues()));
			console.log("PNamesList: " + request.getUrlParametersNames());
			// this.params(request.getUrlParametersNames());

			//request headers
			var headers = request.headers;
			for (var header_name in headers) {
				var header_value = headers[header_name];
				//TODO: do stuff


			}

			var trimmedUrl = this.trimBaseUrl(request);
			

			console.log("url: " + request.urlBase);
 
			var template, view;
			view = {
				// "request": this.getMethodName(context.getCurrentRequest()),
				"request": request,
				"trimmedUrl": this.getEnvironmentVars(trimmedUrl, context, "Bungie", "Production"),
				"method": this.getMethodName(context.getCurrentRequest()),
				// "method": request.method[0].toUpperCase() + request.method.slice(1).toLowerCase(),
				"url": this.url(request),
				"headers": headers,
				"queryParams": this.queryParams(request),
				//this.headers(request),
				"body": request.getLastExchange.responseBody
				//this.body(request)
			  };
			template = readFile('kotlin.mustache');
			return mustache.render(template, view );


			// var status_code = request.getLastExchange().responseStatusCode;

			// var body = request.getLastExchange.responseBody;

			// generated += status_code + "\n" + body + "\n\n";
		}
		
		
		return generated;
	};
};

//Set extension identifier
PawRetrofitGeneratorKotlin.identifier = "com.jastley.PawRetrofitGeneratorKotlin";

//Display name
PawRetrofitGeneratorKotlin.title = "Retrofit Generator (Kotlin)";

//Required register function
registerCodeGenerator(PawRetrofitGeneratorKotlin);
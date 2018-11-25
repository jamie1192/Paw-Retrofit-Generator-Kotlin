var mustache = require('./mustache');
var URI = require('URI.js');

var RetrofitKotlinGenerator = function() {

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
		
		return url.replace(request.urlBase, "");
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
		console.log(JSON.stringify(request));
		for (paramObj in request.getUrlParameters()) {
			// var value = request[paramObj];
			console.log("TEST: " + paramObj);

			//append closing parenthesis, no comma
			if(paramObj == request.getUrlParametersNames().slice(-1)) {
				// @Query("request") String request
				// @Path("membershipType") mType: String,
				var queryString = "@Query(\"" + paramObj + "\") " + paramObj + ": String" +");";
				
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

			console.log("PNamesList: " + request.getUrlParametersNames())
			// this.params(request.getUrlParametersNames());

			//request headers
			var headers = request.headers;
			for (var header_name in headers) {
				var header_value = headers[header_name];
				//TODO: do stuff


			}

			console.log("url: " + request.urlBase);
 
			var template, view;
			view = {
				// "request": this.getMethodName(context.getCurrentRequest()),
				"request": request,
				"trimmedUrl": this.trimBaseUrl(request),
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
RetrofitKotlinGenerator.identifier = "com.jastley.RetrofitKotlinGenerator";

//Display name
RetrofitKotlinGenerator.title = "Retrofit Generator (Kotlin)";

//Required register function
registerCodeGenerator(RetrofitKotlinGenerator);
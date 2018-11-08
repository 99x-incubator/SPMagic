window.MagicSP = window.MagicSP || {};


//Sharepoint Web Properties
MagicSP.getWeb = function (context, hostUrl) {
	var web = null;

	if (hostUrl) {
		var hostContext = new SP.AppContextSite(context, hostUrl);
		web = hostContext.get_web();
	} else {
		web = context.get_web();
	}

	return web;
}

//Target URL Configurations

MagicSP.targetUrl = function (url, hostUrl) {
	if (hostUrl) {
		var api = "_api/";
		var index = url.indexOf(api);
		url = url.slice(0, index + api.length) +
			"SP.AppContextSite(@target)" +
			url.slice(index + api.length - 1);

		var connector = "?";
		if (url.indexOf("?") > -1 && url.indexOf("$") > -1) {
			connector = "&";
		}

		url = url + connector + "@target='" + hostUrl + "'";
	}

	return url;
}

//Sharepoint List CRUD Operations

MagicSP.ListReoisitory = function (appUrl, hostUrl) {
	var listUrl;

	//Setting the List URL
	function setListUrl(listName) {

		listUrl = "/_api/Web/Lists/getByTitle('" + listName +"')";
	}

	//Get the Data from List with the Filters and Ordering and Presidence (No Expanding or Lookups)
	function getListItemwithFilter(filter, value, orderby, top, callback) {

		if (!orderby) orderby = "Id";
		if (!top) top = 15;

		var url = appUrl + listUrl + "/Items?$select=*&$filter=" + filter + " eq '" + value + "'&$orderby=" + orderby + "&$top=" + top;
		url = MagicSP.targetUrl(url, hostUrl);

		return jQuery.ajax({
			url: url,
			type: "GET",
			dataType: "json",
			headers: {
				Accept: "application/json;odata=verbose"
			}
		});

	}


	function getAllListItems(orderby, top, callback) {
		if (!orderby) orderby = "Id";
		if (!top) top = 15;

		var url = appUrl + listUrl + "/Items?$select=*&$orderby=" + orderby + "&$top=" + top;
		url = MagicSP.targetUrl(url, hostUrl);

		return jQuery.ajax({
			url: url,
			type: "GET",
			dataType: "json",
			headers: {
				Accept: "application/json;odata=verbose"
			}
		});
		
	}

	function getListItem(id) {
		if (!id) id = "1";

		var url = appUrl + listUrl + "/Items(" + id + ")";
		url = MagicSP.targetUrl(url, hostUrl);

		return jQuery.ajax({
			url: url,
			type: "GET",
			dataType: "json",
			headers: {
				Accept: "application/json;odata=verbose"
			}
		});
		
	}


	function updateListItem(id, data, formDigest) {
		var url = appUrl + listUrl + "/Items(" + id + ")";
		url = MagicSP.targetUrl(url, hostUrl);

		return jQuery.ajax({
			url: url,
			type: "POST",
			data: data,
			headers: {
				Accept: "application/json;odata=verbose",
				"Content-Type": "application/json;odata=verbose",
				"X-RequestDigest": formDigest,
				"IF-MATCH": "*",
				"X-Http-Method": "PATCH"
			}
		});
		
	}

	function deleteListItem(id, formDigest) {
		var url = appUrl + listUrl + "/Items(" + id + ")";
		url = MagicSP.targetUrl(url, hostUrl);

		var call = jQuery.ajax({
			url: url,
			type: "POST",
			headers: {
				Accept: "application/json;odata=verbose",
				"Content-Type": "application/json;odata=verbose",
				"X-RequestDigest": formDigest,
				"IF-MATCH": "*",
				"X-Http-Method": "DELETE"
			}
		});

		return call;
	}

	function createListItem(data, formDigest) {
		var url = appUrl + listUrl + "/Items";
		url = MagicSP.targetUrl(url, hostUrl);

		var call = jQuery.ajax({
			url: url,
			type: "POST",
			data: data,
			headers: {
				Accept: "application/json;odata=verbose",
				"Content-Type": "application/json;odata=verbose",
				"X-RequestDigest": formDigest
			}
		});

		return call;
	}

	function getPermissions() {
		var url = appUrl + listUrl + "/effectiveBasePermissions";
		url = MagicSP.targetUrl(url, hostUrl);

		var call = jQuery.ajax({
			url: url,
			type: "GET",
			dataType: "json",
			headers: {
				Accept: "application/json;odata=verbose"
			}
		});

		return call;
	}

	function getNextListItemId() {
		var dfd = new jQuery.Deferred();

		var url = appUrl + listUrl + "/Items?$top=1&$select=ID&$orderby=ID desc";
		url = MagicSP.targetUrl(url, hostUrl);

		var call = jQuery.ajax({
			url: url,
			type: "GET",
			dataType: "json",
			headers: {
				Accept: "application/json;odata=verbose"
			}
		});

		call.done(function (data, textStatus, jqXHR) {
			var productId = 1;

			if (data.d.results.length === 1) {
				productId = data.d.results[0].ID + 1;
			}

			dfd.resolve(productId);
		});
		call.fail(function (jqXHR, textStatus, errorThrown) {
			dfd.resolve(0);
		});

		return dfd.promise();
	}


	function failHandler(jqXHR, textStatus, errorThrown) {
		var response = "";
		try {
			var parsed = JSON.parse(jqXHR.responseText);
			response = parsed.error.message.value;
		} catch (e) {
			response = jqXHR.responseText;
		}
		return response;
	}

	return {
		setListUrl: setListUrl,
		getPermissions: getPermissions,
		getListItemwithFilter: getListItemwithFilter,
		getNextListItemId: getNextListItemId,
		createListItem: createListItem,
		deleteListItem: deleteListItem,
		updateListItem: updateListItem,
		getListItem: getListItem,
		getAllListItems: getAllListItems
	}
}

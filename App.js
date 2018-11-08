
$(function () {
    "use strict";

    var appUrl = GetUrlKeyValue("SPAppWebUrl");
    var hostUrl = GetUrlKeyValue("SPHostUrl");

	var list = SPMagic.ListManager(appUrl, hostUrl, "Users");


	list.getListItemEntityTypeFullName().then(function (res) {

		var listTypeName = res.d.ListItemEntityTypeFullName;

		UpdateFormDigest(_spPageContextInfo.webServerRelativeUrl, _spFormDigestRefreshInterval);

		var user = {
			"__metadata": { type: listTypeName },
			"Title": "Malith",
			"Role": "Admin",
			"Description": "Hello World",
			"Email": "malith@99x.lk",
			"UserID": 4
		}

		var data = JSON.stringify(user);

		list.createListItem(data, jQuery("#__REQUESTDIGEST").val()).then(function (res) {

			console.log(res);
		}, function (err) {

			console.log(err);

			});

	});
	

});
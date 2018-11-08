
$(function () {
    "use strict";

    var appUrl = GetUrlKeyValue("SPAppWebUrl");
    var hostUrl = GetUrlKeyValue("SPHostUrl");

	var list = SPMagic.ListManager(appUrl, hostUrl, "Users");


	list.getListItemEntityTypeFullName().then(function (res) {

		var listTypeName = res.d.ListItemEntityTypeFullName;

		UpdateFormDigest(_spPageContextInfo.webServerRelativeUrl, _spFormDigestRefreshInterval);

		list.deleteListItem(7, jQuery("#__REQUESTDIGEST").val()).then(function (res) {

			console.log(res);
		}, function (err) {

			console.log(err);

			});

	});
	

});
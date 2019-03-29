// Copyright (c) 2019, irayspacii@gmail.com and contributors
// For license information, please see license.txt

frappe.ui.form.on('User Biometric', {
	refresh: function(frm) {
		if (!frm.doc.__islocal) {
			frm.set_df_property('scan', 'hidden', 1);
		}
	},
	scan: function(frm) {
		captureFingerprint(frm);
	},
});

const URL = "https://localhost:8443/SGIFPCapture";

const OPTIONS = {
	Quality: 50,
	Timeout: 10000,
	licstr: "",
	templateFormat: "ISO",
};

function captureFingerprint(frm) {
	$.post(URL, OPTIONS)
		.done(function(data) {
			const res = JSON.parse(data);
			frm.set_value('biometric', res['TemplateBase64']);
		})
		.fail(function() {
			frappe.throw("Unable to connect to the biometric device.");
		});
}

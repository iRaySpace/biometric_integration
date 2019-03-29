// Copyright (c) 2019, irayspacii@gmail.com and contributors
// For license information, please see license.txt

frappe.ui.form.on('Biometric Approval', {
	onload: function(frm) {
		frm.fields_dict['ref_name'].get_query = function(doc, cdt, cdn) {
			return {
				filters: { 'status': 'Draft' }
			}
		};
	},
	user_biometric: function(frm) {
		frappe.call({
			method: "biometric_integration.get_fingerprint",
			args: { user: frm.doc.user_biometric },
			callback: function(r) {
				if (r.message) {
					frm.set_value('biometric', r.message);
				}
			}
		});
	},
	refresh: function(frm) {
		frm.page.set_primary_action('Approve', function() { approve(frm); });
	}
});

function approve(frm) {
	frm.set_value('approved_on', frappe.datetime.now_datetime());

	const mainFp = frm.doc.biometric;
	let scannedFp = "";

	captureFingerprint()
		.then(function(fp) {
			const res = JSON.parse(fp);
			scannedFp = res['TemplateBase64'];
			return matchFingerprint(mainFp, res['TemplateBase64']);
		})
		.then(function(score) {
			const res = JSON.parse(score);
			frm.set_value('score', res['MatchingScore']);
			frm.set_value('biometric', scannedFp);
			frm.save();
		});
}

const captureUrl = "https://localhost:8443/SGIFPCapture";
const captureOpts = {
	Quality: 50,
	Timeout: 10000,
	licstr: "",
	templateFormat: "ISO",
};

function captureFingerprint() {
	return $.post(captureUrl, captureOpts)
		.fail(function() {
			frappe.throw("Unable to connect to the biometric device.");
		});
}

const matchUrl = "https://localhost:8443/SGIMatchScore";

function matchFingerprint(fp1, fp2) {
	const matchOpts = {
		licstr: "",
		template1: fp1,
		template2: fp2,
		templateFormat: "ISO"
	};

	return $.post(matchUrl, matchOpts)
		.fail(function() {
			frappe.throw("Fingerprint device error!");
		});
}

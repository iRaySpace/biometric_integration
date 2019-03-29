# -*- coding: utf-8 -*-
# Copyright (c) 2019, irayspacii@gmail.com and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document


class BiometricApproval(Document):
	def validate(self):
		if self.score < 100:
			frappe.throw("There is something wrong with your finger. Please try again.")

	def after_insert(self):
		doc = frappe.get_doc(self.ref_doctype, self.ref_name)
		doc.biometric_approval = self.name
		doc.submit()

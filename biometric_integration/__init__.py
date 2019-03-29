import frappe

__version__ = '0.1.0'


@frappe.whitelist(allow_guest=True)
def get_fingerprint(user):
    return frappe.get_value('User Biometric', user, 'biometric')

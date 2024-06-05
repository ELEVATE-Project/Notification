const emailNotifications = require('@generics/helpers/email-notifications')
const httpStatusCode = require('@generics/http-status')
const apiResponses = require('@constants/api-responses')
const responses = require('@helpers/responses')

module.exports = class EmailHelper {
	/**
	 * send email
	 * @method
	 * @name send
	 * @param {String} bodyData.type - type of payload email
	 * @param {String} bodyData.email - email object
	 * @param {Boolean} bodyData.email.to - email id of receiver
	 * @param {String} bodyData.email.cc - email id of receiver in cc
	 * @param {String} bodyData.email.subject - subject of email
	 * @param {String} bodyData.email.body - body of email
	 * @returns {JSON} - email send status
	 */
	static async send(bodyData) {
		if (bodyData.type == 'email' && bodyData.email) {
			const currentDate = new Date().toISOString().split('T')[0].replace(/-/g, '')
			console.log('===========', currentDate)
			let result = await emailNotifications.sendEmail(bodyData.email)
			if (result && result.status == 'success') {
				console.log('===========', currentDate)
				return responses.successResponse({
					statusCode: httpStatusCode.ok,
					message: apiResponses.EMAIL_SENT_SUCCESSFULLY,
					result,
				})
			} else {
				return responses.failureResponse({
					message: apiResponses.MAIL_SENT_FAILED,
					statusCode: httpStatusCode.bad_request,
					responseCode: 'CLIENT_ERROR',
				})
			}
		}
	}
}

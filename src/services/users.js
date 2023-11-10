// Dependencies
const httpStatusCode = require('@generics/http-status')
const common = require('@constants/common')
const userRequests = require('@requests/user')
const menteeQueries = require('@database/queries/userExtension')
const mentorQueries = require('@database/queries/mentorExtension')
module.exports = class UserHelper {
	/**
	 * Get user list.
	 * @method
	 * @name create
	 * @param {String} userType - mentee/mentor.
	 * @param {Number} pageSize -  Page size.
	 * @param {Number} pageNo -  Page number.
	 * @param {String} searchText -  Search text.
	 * @returns {JSON} - User list.
	 */

	static async list(userType, pageNo, pageSize, searchText) {
		try {
			const userDetails = await userRequests.list(userType, pageNo, pageSize, searchText)

			const ids = userDetails.data.result.data.map((item) => item.values[0].id)
			let extensionDetails
			if (userType == common.MENTEE_ROLE) {
				extensionDetails = await menteeQueries.getUsersByUserIds(ids, {
					attributes: ['user_id', 'rating'],
				})
			} else if (userType == common.MENTOR_ROLE) {
				extensionDetails = await mentorQueries.getMentorsByUserIds(ids, {
					attributes: ['user_id', 'rating'],
				})
			}

			const extensionDataMap = new Map(extensionDetails.map((newItem) => [newItem.user_id, newItem]))
			console.log(extensionDataMap)
			console.log(userDetails.data.result)

			userDetails.data.result.data.forEach((existingItem) => {
				const user_id = existingItem.values[0].id
				if (extensionDataMap.has(user_id)) {
					const newItem = extensionDataMap.get(user_id)
					existingItem.values[0] = { ...existingItem.values[0], ...newItem }
				}
				delete existingItem.values[0].user_id
			})
			console.log(userDetails.data.result)
			return common.successResponse({
				statusCode: httpStatusCode.ok,
				message: userDetails.data.message,
				result: userDetails.data.result,
			})
		} catch (error) {
			throw error
		}
	}
}

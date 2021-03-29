/** Sanitizes the per_page query to return the number of items available per page,
 * or the maximum number of items which can be returned on a page (Capped at 999)
 * @param {number} per_page - The number of items available per page
 * @returns The number of items available per page
 */
const getPerPage = (per_page) => {
	per_page = Number(per_page);
	if (per_page <= 999) {
		return per_page;
	} else {
		return 999;
	}
};

module.exports = getPerPage;

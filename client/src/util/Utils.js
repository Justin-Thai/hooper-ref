/*
 * Sorts a list of items based on the indicated category
 * 
 * @param {Array} items The list to be sorted
 * @param {Array} categories The sortable categories
 * @param {number} index The category (indicated by the index) used to sort the list
 * @param {boolean} asc Determines the sorting order
*/
function sortItemsByCat(items, categories, index, asc = true) {
    const orderModifier = asc ? 1 : -1;
    const cat = categories[index];

    items.sort((a, b) => {
        const elementA = a[cat]; 
        const elementB = b[cat];

        return elementA > elementB ? (1 * orderModifier) : (-1 * orderModifier);
    });

    return items;
}

export { sortItemsByCat };

export function filterItems(items, array, prop) {
	if (prop) {
		if (items instanceof Array) {
			return array.filter(item => !items.some(i => i[prop] === item[prop]));
		} else {
			return array.filter(item => item[prop] !== items[prop]);
		}
	}

	if (items instanceof Array) {
		return array.filter(item => items.indexOf(item) === 0);
	} else {
		return array.filter(item => item !== items);
	}
}
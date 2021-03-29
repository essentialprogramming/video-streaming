export default class Collections {

    constructor() {

    }

    // Remove duplicates in an array
    static removeDuplicates(array) {
        if (!Array.isArray(array)) {
            return array;
        }
        return array.filter((item, index) => array.indexOf(item) === index);
    }

}
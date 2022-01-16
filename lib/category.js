function Category(category={}) {
    this.id = category.id ?? '';
    this.name = category.name ?? '';

    // return {
    //     getId: () => this.id,
    //     getName: () => this.name
    // }
} 

function bindCategoryArray(categories=[]) {
    if(Array.isArray(categories)) {
        let temp = categories.map(category => {
            return new Category(category);
        });
        return temp;
    }
    return [];
}

module.exports = {Category, bindCategoryArray};
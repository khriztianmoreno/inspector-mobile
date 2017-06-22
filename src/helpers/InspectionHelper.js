import path from 'path';

/**
 * Inspection Helper Class
 * A utility class for working with the inspection structure
 */
class InspectionHelper {
  /**
   * @constructor
   * @param: {Object} inspection - The inspection object to work with.
   */
  constructor(inspection) {
    const newInspection = { ...inspection };

    this.originalInspection = inspection;
    this.inspection = InspectionHelper.addCategoryToItems(newInspection);
  }

  /**
   * Get the current inspection object.
   * @return {Object} The inspection object.
   */
  getInspection() {
    return this.inspection;
  }

  /**
   * Add category to every single item for display purposes.
   * @param {Object} inspection - The inspection object.
   * @return {Object} The preprocesed inspection object.
   */
  static addCategoryToItems(inspection) {
    let index = 0;
    const uChecks = inspection.check
                      .map((check) => {
                        const items = check.items
                          .map(item => (
                            { ...item,
                              category: check.category[0],
                              id: index++,
                              picture: { path: '', promise: undefined },
                            }));
                        return { ...check, items };
                      });
    return {
      ...inspection,
      check: uChecks,
    };
  }

  /**
   * Get all the items available in the current inspection.
   * @return {Array} The items array.
   */
  getAllItems() {
    return this.inspection.check
      .reduce((base, current) => {
        current.items.forEach(item => base.push(item));
        return base;
      }, []);
  }

  /**
   * Get all the items that match by name.
   * @param {string} name - The name use to filter items.
   * @return {Array} The filtered items array.
   */
  getItemsByName(name) {
    const base = new RegExp(`.*${name}.*`, 'i');

    return this.inspection.check
      .reduce((initial, check) => {
        if (base.test(check.category[0].description)) {
          return initial.concat(check.items);
        }
        return InspectionHelper.filterByName(name, check.items)
          .concat(initial);
      }, []);
  }

  /**
   * Get the items filtered by name.
   * @param {string} name - The name use to filter the items.
   * @param {Array} items - The array of the items to filter in.
   * @return {Array} The array of the filtered items.
   */
  static filterByName(name, items) {
    const base = new RegExp(`.*${name}.*`, 'i');
    return items.filter(item => base.test(item.name['es'].description));
  }

  /**
   * Get items based in the picture path
   * @param {string} path - The path of the image
   * @return {Object} The item found
   */
  getItemByPicturePath(picturePath) {
    return this.inspection.check
      .reduce((prev, current) => prev.concat(current.items), [])
      .filter(item => path.basename(item.picture.path) === picturePath)[0];
  }

  // For future implementation
  updateItem(index, props) {
    const updatedChecks = this.inspection.check
      .map((check) => {
        const items = check.items
          .map((item) => {
            if (item.id === index) {
              return { ...item, ...props };
            }
            return item;
          });

        return { ...check, items };
      });

    this.inspection = {
      ...this.inspection,
      check: updatedChecks,
    };
  }

  updateItemImages(images) {
    images.forEach((image) => {
      console.log('Logging image:', image);
      const item = this.getAllItems().filter(current => current.id === image.itemId)[0];
      item.picture.path = image.url;
    });
  }

  uploadPictures(callback) {
    const pictures = this.getAllItems()
      .filter(item => item.picture.path !== '' && item.picture.promise !== undefined)
      .map(item => item.picture.promise);

    Promise.all(pictures)
      .then(images => this.updateItemImages(images))
      .then(() => callback())
      .catch(() => callback());
  }

  /**
   * Generate the review object.
   * @param {Object} customer - The customer of object.
   * @param {Object} vehicle - The vehicle reviewed.
   * @param {Object} userReview - The used who made the review.
   * @param {number} cost - The cost of the review,
   * @param {Array} images - The back and front image of the car.
   * @return {Object} The review object.
   */
  generateReview(customer, vehicle, userReview, cost, images) {
    const { _id, type } = this.inspection;
    const review = {
      cost,
      customer,
      inspectionId: _id,
      result: {
        check: [],
        images,
      },
      type,
      userReview,
      vehicle,
    };

    this.inspection.check
      .reduce((base, check) => {
        const currentFields = check.items.map(item => ({
          name: item.name['es'].description,
          code: item.code,
          value: item.value || 'PASS',
          localId: item.localId,
          image: item.picture.path || null,
          comment: item.comment || null,
        }));
        base.result.check.push({
          category: check.category[0].description,
          fields: currentFields,
        });
        return base;
      }, review);

    return review;
  }

}

export default InspectionHelper;

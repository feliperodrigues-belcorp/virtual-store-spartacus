import { OccConfig } from '../../config/occ-config';

export const defaultOccProductConfig: OccConfig = {
  backend: {
    occ: {
      endpoints: {
        product:
          'products/${productCode}?fields=DEFAULT,averageRating,images(FULL),classifications,numberOfReviews,categories(FULL)',
        productReviews: 'products/${productCode}/reviews',
        // Uncomment this when occ gets configured
        // productReferences:
        //   'products/${productCode}/references?fields=DEFAULT,references(target(images(FULL)))&referenceType=${referenceType}',
        productReferences:
          'products/${productCode}/references?fields=DEFAULT,references(target(images(FULL)))',
        // tslint:disable:max-line-length
        productSearch:
          'products/search?fields=products(code,name,summary,price(FULL),images(DEFAULT),stock(FULL),averageRating),facets,breadcrumbs,pagination(DEFAULT),sorts(DEFAULT),freeTextSearch',
        // tslint:enable
        productSuggestions: 'products/suggestions',
      },
    },
  },
};

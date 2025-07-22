export function getSearchCriteria(filter: any = {}, queryParams: any = {}) {
  const criteria: any = { ...filter };

  if (queryParams.search) {
    criteria.$or = [
      { name: { $regex: queryParams.search, $options: "i" } },
      { description: { $regex: queryParams.search, $options: "i" } },
      { venue: { $regex: queryParams.search, $options: "i" } },
      { category: { $regex: queryParams.search, $options: "i" } },
    ];
  }

  if (queryParams.category) {
    criteria.category = queryParams.category;
  }

  if (queryParams.status) {
    criteria.status = queryParams.status;
  }

  if (queryParams.priceFilter) {
    criteria.isFree = queryParams.priceFilter === "free";
  }

  return criteria;
}

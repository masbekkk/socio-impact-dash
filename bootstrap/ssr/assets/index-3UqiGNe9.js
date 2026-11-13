let urlDefaults = () => ({});
const getValue = (value) => {
  if (value === true) {
    return "1";
  }
  if (value === false) {
    return "0";
  }
  return value.toString();
};
const addNestedParams = (obj, prefix, params) => {
  Object.entries(obj).forEach(([subKey, value]) => {
    if (value === void 0) return;
    const paramKey = `${prefix}[${subKey}]`;
    if (Array.isArray(value)) {
      value.forEach((v) => params.append(`${paramKey}[]`, getValue(v)));
    } else if (value !== null && typeof value === "object") {
      addNestedParams(value, paramKey, params);
    } else if (["string", "number", "boolean"].includes(typeof value)) {
      params.set(paramKey, getValue(value));
    }
  });
};
const queryParams = (options) => {
  if (!options || !options.query && !options.mergeQuery) {
    return "";
  }
  const query = options.query ?? options.mergeQuery;
  const includeExisting = options.mergeQuery !== void 0;
  const params = new URLSearchParams(
    includeExisting && typeof window !== "undefined" ? window.location.search : ""
  );
  for (const key in query) {
    const queryValue = query[key];
    if (queryValue === void 0 || queryValue === null) {
      params.delete(key);
      continue;
    }
    if (Array.isArray(queryValue)) {
      if (params.has(`${key}[]`)) {
        params.delete(`${key}[]`);
      }
      queryValue.forEach((value) => {
        params.append(`${key}[]`, value.toString());
      });
    } else if (typeof queryValue === "object") {
      params.forEach((_, paramKey) => {
        if (paramKey.startsWith(`${key}[`)) {
          params.delete(paramKey);
        }
      });
      addNestedParams(queryValue, key, params);
    } else {
      params.set(key, getValue(queryValue));
    }
  }
  const str = params.toString();
  return str.length > 0 ? `?${str}` : "";
};
const applyUrlDefaults = (existing) => {
  const existingParams = { ...existing ?? {} };
  const defaultParams = urlDefaults();
  for (const key in defaultParams) {
    if (existingParams[key] === void 0 && defaultParams[key] !== void 0) {
      existingParams[key] = defaultParams[key];
    }
  }
  return existingParams;
};
export {
  applyUrlDefaults as a,
  queryParams as q
};

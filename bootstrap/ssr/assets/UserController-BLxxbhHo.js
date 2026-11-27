import { q as queryParams } from "./index-3UqiGNe9.js";
const destroy = (options) => ({
  url: destroy.url(options),
  method: "delete"
});
destroy.definition = {
  methods: ["delete"],
  url: "/user"
};
destroy.url = (options) => {
  return destroy.definition.url + queryParams(options);
};
destroy.delete = (options) => ({
  url: destroy.url(options),
  method: "delete"
});
const destroyForm = (options) => ({
  action: destroy.url({
    [options?.mergeQuery ? "mergeQuery" : "query"]: {
      _method: "DELETE",
      ...options?.query ?? options?.mergeQuery ?? {}
    }
  }),
  method: "post"
});
destroyForm.delete = (options) => ({
  action: destroy.url({
    [options?.mergeQuery ? "mergeQuery" : "query"]: {
      _method: "DELETE",
      ...options?.query ?? options?.mergeQuery ?? {}
    }
  }),
  method: "post"
});
destroy.form = destroyForm;
const UserController = { destroy };
export {
  UserController as U
};

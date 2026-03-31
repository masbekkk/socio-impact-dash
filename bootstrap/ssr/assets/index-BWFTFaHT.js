import { q as queryParams } from "./index-3UqiGNe9.js";
const store = (options) => ({
  url: store.url(options),
  method: "post"
});
store.definition = {
  methods: ["post"],
  url: "/two-factor-challenge"
};
store.url = (options) => {
  return store.definition.url + queryParams(options);
};
store.post = (options) => ({
  url: store.url(options),
  method: "post"
});
const storeForm = (options) => ({
  action: store.url(options),
  method: "post"
});
storeForm.post = (options) => ({
  action: store.url(options),
  method: "post"
});
store.form = storeForm;
const login$1 = {
  store: Object.assign(store, store)
};
const login = (options) => ({
  url: login.url(options),
  method: "get"
});
login.definition = {
  methods: ["get", "head"],
  url: "/two-factor-challenge"
};
login.url = (options) => {
  return login.definition.url + queryParams(options);
};
login.get = (options) => ({
  url: login.url(options),
  method: "get"
});
login.head = (options) => ({
  url: login.url(options),
  method: "head"
});
const loginForm = (options) => ({
  action: login.url(options),
  method: "get"
});
loginForm.get = (options) => ({
  action: login.url(options),
  method: "get"
});
loginForm.head = (options) => ({
  action: login.url({
    [options?.mergeQuery ? "mergeQuery" : "query"]: {
      _method: "HEAD",
      ...options?.query ?? options?.mergeQuery ?? {}
    }
  }),
  method: "get"
});
login.form = loginForm;
const enable = (options) => ({
  url: enable.url(options),
  method: "post"
});
enable.definition = {
  methods: ["post"],
  url: "/user/two-factor-authentication"
};
enable.url = (options) => {
  return enable.definition.url + queryParams(options);
};
enable.post = (options) => ({
  url: enable.url(options),
  method: "post"
});
const enableForm = (options) => ({
  action: enable.url(options),
  method: "post"
});
enableForm.post = (options) => ({
  action: enable.url(options),
  method: "post"
});
enable.form = enableForm;
const confirm = (options) => ({
  url: confirm.url(options),
  method: "post"
});
confirm.definition = {
  methods: ["post"],
  url: "/user/confirmed-two-factor-authentication"
};
confirm.url = (options) => {
  return confirm.definition.url + queryParams(options);
};
confirm.post = (options) => ({
  url: confirm.url(options),
  method: "post"
});
const confirmForm = (options) => ({
  action: confirm.url(options),
  method: "post"
});
confirmForm.post = (options) => ({
  action: confirm.url(options),
  method: "post"
});
confirm.form = confirmForm;
const disable = (options) => ({
  url: disable.url(options),
  method: "delete"
});
disable.definition = {
  methods: ["delete"],
  url: "/user/two-factor-authentication"
};
disable.url = (options) => {
  return disable.definition.url + queryParams(options);
};
disable.delete = (options) => ({
  url: disable.url(options),
  method: "delete"
});
const disableForm = (options) => ({
  action: disable.url({
    [options?.mergeQuery ? "mergeQuery" : "query"]: {
      _method: "DELETE",
      ...options?.query ?? options?.mergeQuery ?? {}
    }
  }),
  method: "post"
});
disableForm.delete = (options) => ({
  action: disable.url({
    [options?.mergeQuery ? "mergeQuery" : "query"]: {
      _method: "DELETE",
      ...options?.query ?? options?.mergeQuery ?? {}
    }
  }),
  method: "post"
});
disable.form = disableForm;
const qrCode = (options) => ({
  url: qrCode.url(options),
  method: "get"
});
qrCode.definition = {
  methods: ["get", "head"],
  url: "/user/two-factor-qr-code"
};
qrCode.url = (options) => {
  return qrCode.definition.url + queryParams(options);
};
qrCode.get = (options) => ({
  url: qrCode.url(options),
  method: "get"
});
qrCode.head = (options) => ({
  url: qrCode.url(options),
  method: "head"
});
const qrCodeForm = (options) => ({
  action: qrCode.url(options),
  method: "get"
});
qrCodeForm.get = (options) => ({
  action: qrCode.url(options),
  method: "get"
});
qrCodeForm.head = (options) => ({
  action: qrCode.url({
    [options?.mergeQuery ? "mergeQuery" : "query"]: {
      _method: "HEAD",
      ...options?.query ?? options?.mergeQuery ?? {}
    }
  }),
  method: "get"
});
qrCode.form = qrCodeForm;
const secretKey = (options) => ({
  url: secretKey.url(options),
  method: "get"
});
secretKey.definition = {
  methods: ["get", "head"],
  url: "/user/two-factor-secret-key"
};
secretKey.url = (options) => {
  return secretKey.definition.url + queryParams(options);
};
secretKey.get = (options) => ({
  url: secretKey.url(options),
  method: "get"
});
secretKey.head = (options) => ({
  url: secretKey.url(options),
  method: "head"
});
const secretKeyForm = (options) => ({
  action: secretKey.url(options),
  method: "get"
});
secretKeyForm.get = (options) => ({
  action: secretKey.url(options),
  method: "get"
});
secretKeyForm.head = (options) => ({
  action: secretKey.url({
    [options?.mergeQuery ? "mergeQuery" : "query"]: {
      _method: "HEAD",
      ...options?.query ?? options?.mergeQuery ?? {}
    }
  }),
  method: "get"
});
secretKey.form = secretKeyForm;
const recoveryCodes = (options) => ({
  url: recoveryCodes.url(options),
  method: "get"
});
recoveryCodes.definition = {
  methods: ["get", "head"],
  url: "/user/two-factor-recovery-codes"
};
recoveryCodes.url = (options) => {
  return recoveryCodes.definition.url + queryParams(options);
};
recoveryCodes.get = (options) => ({
  url: recoveryCodes.url(options),
  method: "get"
});
recoveryCodes.head = (options) => ({
  url: recoveryCodes.url(options),
  method: "head"
});
const recoveryCodesForm = (options) => ({
  action: recoveryCodes.url(options),
  method: "get"
});
recoveryCodesForm.get = (options) => ({
  action: recoveryCodes.url(options),
  method: "get"
});
recoveryCodesForm.head = (options) => ({
  action: recoveryCodes.url({
    [options?.mergeQuery ? "mergeQuery" : "query"]: {
      _method: "HEAD",
      ...options?.query ?? options?.mergeQuery ?? {}
    }
  }),
  method: "get"
});
recoveryCodes.form = recoveryCodesForm;
const regenerateRecoveryCodes = (options) => ({
  url: regenerateRecoveryCodes.url(options),
  method: "post"
});
regenerateRecoveryCodes.definition = {
  methods: ["post"],
  url: "/user/two-factor-recovery-codes"
};
regenerateRecoveryCodes.url = (options) => {
  return regenerateRecoveryCodes.definition.url + queryParams(options);
};
regenerateRecoveryCodes.post = (options) => ({
  url: regenerateRecoveryCodes.url(options),
  method: "post"
});
const regenerateRecoveryCodesForm = (options) => ({
  action: regenerateRecoveryCodes.url(options),
  method: "post"
});
regenerateRecoveryCodesForm.post = (options) => ({
  action: regenerateRecoveryCodes.url(options),
  method: "post"
});
regenerateRecoveryCodes.form = regenerateRecoveryCodesForm;
const show = (options) => ({
  url: show.url(options),
  method: "get"
});
show.definition = {
  methods: ["get", "head"],
  url: "/settings/two-factor"
};
show.url = (options) => {
  return show.definition.url + queryParams(options);
};
show.get = (options) => ({
  url: show.url(options),
  method: "get"
});
show.head = (options) => ({
  url: show.url(options),
  method: "head"
});
const showForm = (options) => ({
  action: show.url(options),
  method: "get"
});
showForm.get = (options) => ({
  action: show.url(options),
  method: "get"
});
showForm.head = (options) => ({
  action: show.url({
    [options?.mergeQuery ? "mergeQuery" : "query"]: {
      _method: "HEAD",
      ...options?.query ?? options?.mergeQuery ?? {}
    }
  }),
  method: "get"
});
show.form = showForm;
({
  login: Object.assign(login, login$1),
  enable: Object.assign(enable, enable),
  confirm: Object.assign(confirm, confirm),
  disable: Object.assign(disable, disable),
  qrCode: Object.assign(qrCode, qrCode),
  secretKey: Object.assign(secretKey, secretKey),
  recoveryCodes: Object.assign(recoveryCodes, recoveryCodes),
  regenerateRecoveryCodes: Object.assign(regenerateRecoveryCodes, regenerateRecoveryCodes),
  show: Object.assign(show, show)
});
export {
  store as a,
  secretKey as b,
  regenerateRecoveryCodes as c,
  confirm as d,
  disable as e,
  enable as f,
  qrCode as q,
  recoveryCodes as r,
  show as s
};

import { jsx } from "react/jsx-runtime";
import * as React from "react";
const TabsContext = React.createContext(void 0);
const Tabs = ({ defaultValue, value, onValueChange, children, className }) => {
  const [internalState, setInternalState] = React.useState(defaultValue || "");
  const activeTab = value !== void 0 ? value : internalState;
  const setActiveTab = onValueChange || setInternalState;
  return /* @__PURE__ */ jsx(TabsContext.Provider, { value: { activeTab, setActiveTab }, children: /* @__PURE__ */ jsx("div", { className, children }) });
};
const TabsList = ({ children, className }) => /* @__PURE__ */ jsx("div", { className: `inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground ${className || ""}`, children });
const TabsTrigger = ({ value, children, className }) => {
  const context = React.useContext(TabsContext);
  if (!context) throw new Error("TabsTrigger must be used within Tabs");
  const { activeTab, setActiveTab } = context;
  const isActive = activeTab === value;
  return /* @__PURE__ */ jsx(
    "button",
    {
      type: "button",
      role: "tab",
      "data-state": isActive ? "active" : "inactive",
      onClick: () => setActiveTab(value),
      className: `inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${isActive ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"} ${className || ""}`,
      children
    }
  );
};
const TabsContent = ({ value, children, className }) => {
  const context = React.useContext(TabsContext);
  if (!context) throw new Error("TabsContent must be used within Tabs");
  const { activeTab } = context;
  if (activeTab !== value) return null;
  return /* @__PURE__ */ jsx("div", { className: `mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${className || ""}`, children });
};
export {
  Tabs as T,
  TabsList as a,
  TabsTrigger as b,
  TabsContent as c
};

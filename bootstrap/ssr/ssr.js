import { jsx } from "react/jsx-runtime";
import { createInertiaApp } from "@inertiajs/react";
import createServer from "@inertiajs/react/server";
import ReactDOMServer from "react-dom/server";
async function resolvePageComponent(path, pages) {
  for (const p of Array.isArray(path) ? path : [path]) {
    const page = pages[p];
    if (typeof page === "undefined") {
      continue;
    }
    return typeof page === "function" ? page() : page;
  }
  throw new Error(`Page not found: ${path}`);
}
const appName = "SocialImpact.ID Dashboard";
createServer(
  (page) => createInertiaApp({
    page,
    render: ReactDOMServer.renderToString,
    title: (title) => title ? `${title} - ${appName}` : appName,
    resolve: (name) => resolvePageComponent(
      `./pages/${name}.tsx`,
      /* @__PURE__ */ Object.assign({ "./pages/Calendar/Index.tsx": () => import("./assets/Index-DF1dClAS.js"), "./pages/Calendar/Show.tsx": () => import("./assets/Show-B9KnacUG.js"), "./pages/Dashboard/Index.tsx": () => import("./assets/Index-g9SALCEl.js"), "./pages/Leave/CreateLeave.tsx": () => import("./assets/CreateLeave-B4RfFMNK.js"), "./pages/Leave/CreateTravel.tsx": () => import("./assets/CreateTravel-DWdvaXRa.js"), "./pages/Leave/Index.tsx": () => import("./assets/Index-GQ8AadWP.js"), "./pages/Leave/Show.tsx": () => import("./assets/Show-1xC2BfYG.js"), "./pages/LetterRequests/Create.tsx": () => import("./assets/Create-C36jeYRu.js"), "./pages/LetterRequests/Edit.tsx": () => import("./assets/Edit-CQwxLt10.js"), "./pages/LetterRequests/Index.tsx": () => import("./assets/Index-CilejjW-.js"), "./pages/Presence/Create.tsx": () => import("./assets/Create-Dx7AGUbx.js"), "./pages/Presence/Index.tsx": () => import("./assets/Index-CUG75mO-.js"), "./pages/Presence/Show.tsx": () => import("./assets/Show-BWHTHvp9.js"), "./pages/Projects/Allowance.tsx": () => import("./assets/Allowance-D5AzVioh.js"), "./pages/Projects/Create.tsx": () => import("./assets/Create-Cdmllio_.js"), "./pages/Projects/Edit.tsx": () => import("./assets/Edit-DI5O18vj.js"), "./pages/Projects/Index.tsx": () => import("./assets/Index-CUODl8Br.js"), "./pages/Projects/ProjectTabs.tsx": () => import("./assets/ProjectTabs-QhLUq_oi.js"), "./pages/Projects/Show.tsx": () => import("./assets/Show-CMc54S5W.js"), "./pages/Reimbursements/CreateATR.tsx": () => import("./assets/CreateATR-CMHYjkkS.js"), "./pages/Reimbursements/CreateAllowance.tsx": () => import("./assets/CreateAllowance-5RfUZc8o.js"), "./pages/Reimbursements/CreateEER.tsx": () => import("./assets/CreateEER-B5p8ftU3.js"), "./pages/Reimbursements/Index.tsx": () => import("./assets/Index-BbDXICxD.js"), "./pages/Reimbursements/Show.tsx": () => import("./assets/Show-09m6dGc8.js"), "./pages/Users/Create.tsx": () => import("./assets/Create-BL517H-f.js"), "./pages/Users/Edit.tsx": () => import("./assets/Edit-CjblUcq0.js"), "./pages/admin/divisions/create.tsx": () => import("./assets/create-B7hWaPMY.js"), "./pages/admin/divisions/edit.tsx": () => import("./assets/edit-Cm167U6L.js"), "./pages/admin/divisions/index.tsx": () => import("./assets/index-kH1-u_wx.js"), "./pages/admin/kpis/index.tsx": () => import("./assets/index-BtHtHyXn.js"), "./pages/admin/letter-codes/create.tsx": () => import("./assets/create-DXcGQJzn.js"), "./pages/admin/letter-codes/edit.tsx": () => import("./assets/edit-CzamUWSd.js"), "./pages/admin/letter-codes/index.tsx": () => import("./assets/index-D1ZTpJ4u.js"), "./pages/admin/letter-divisions/create.tsx": () => import("./assets/create-DRHkHhx4.js"), "./pages/admin/letter-divisions/edit.tsx": () => import("./assets/edit-CVClHyg-.js"), "./pages/admin/letter-divisions/index.tsx": () => import("./assets/index-DQjPGjbl.js"), "./pages/admin/rbac/components/PermissionList.tsx": () => import("./assets/PermissionList-BomXOLUx.js"), "./pages/admin/rbac/components/RoleList.tsx": () => import("./assets/RoleList-Codb_i8k.js"), "./pages/admin/rbac/components/RolePermissionEditor.tsx": () => import("./assets/RolePermissionEditor-CMnlP1QP.js"), "./pages/admin/rbac/index.tsx": () => import("./assets/index-qajNxvuj.js"), "./pages/appearance/update.tsx": () => import("./assets/update-B0v1GECp.js"), "./pages/session/create.tsx": () => import("./assets/create-BQAmVqDs.js"), "./pages/user-email-reset-notification/create.tsx": () => import("./assets/create-C46yX_EK.js"), "./pages/user-email-verification-notification/create.tsx": () => import("./assets/create-DUn9aX-f.js"), "./pages/user-password-confirmation/create.tsx": () => import("./assets/create-Cz59nN44.js"), "./pages/user-password/create.tsx": () => import("./assets/create-DTkHUZyN.js"), "./pages/user-password/edit.tsx": () => import("./assets/edit-DyeBj_-1.js"), "./pages/user-profile/edit.tsx": () => import("./assets/edit-Cv1ACicA.js"), "./pages/user-two-factor-authentication-challenge/show.tsx": () => import("./assets/show-DxLd0Ljl.js"), "./pages/user-two-factor-authentication/show.tsx": () => import("./assets/show-BaZkmGTU.js"), "./pages/user/create.tsx": () => import("./assets/create-Cm5HymZr.js"), "./pages/user/index.tsx": () => import("./assets/index-De-rzD2H.js"), "./pages/welcome.tsx": () => import("./assets/welcome-ZztE1F9S.js") })
    ),
    setup: ({ App, props }) => {
      return /* @__PURE__ */ jsx(App, { ...props });
    }
  })
);

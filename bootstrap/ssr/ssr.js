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
      /* @__PURE__ */ Object.assign({ "./pages/Calendar/Index.tsx": () => import("./assets/Index-CM5Eulvh.js"), "./pages/Calendar/Show.tsx": () => import("./assets/Show-Bob8CUpJ.js"), "./pages/Dashboard/Index.tsx": () => import("./assets/Index-BPwqkhBn.js"), "./pages/Leave/CreateLeave.tsx": () => import("./assets/CreateLeave-BYh9cJnN.js"), "./pages/Leave/CreateTravel.tsx": () => import("./assets/CreateTravel-D9p7GxvD.js"), "./pages/Leave/Index.tsx": () => import("./assets/Index-VNHixn-l.js"), "./pages/Leave/Show.tsx": () => import("./assets/Show-CWYaj2tA.js"), "./pages/LetterRequests/Create.tsx": () => import("./assets/Create-DFi1aRKT.js"), "./pages/LetterRequests/Edit.tsx": () => import("./assets/Edit-hvQgB0gA.js"), "./pages/LetterRequests/Index.tsx": () => import("./assets/Index-4L5c7Pjo.js"), "./pages/Presence/Create.tsx": () => import("./assets/Create-BNOeplzB.js"), "./pages/Presence/Index.tsx": () => import("./assets/Index-gyOoYAPF.js"), "./pages/Presence/Show.tsx": () => import("./assets/Show-QuGwDB-Z.js"), "./pages/Projects/Allowance.tsx": () => import("./assets/Allowance-CrBy4-5l.js"), "./pages/Projects/Create.tsx": () => import("./assets/Create-Bp4RaPjR.js"), "./pages/Projects/Edit.tsx": () => import("./assets/Edit-yx1iG0wl.js"), "./pages/Projects/Index.tsx": () => import("./assets/Index-CPf9lD1n.js"), "./pages/Projects/ProjectTabs.tsx": () => import("./assets/ProjectTabs-tfugzmTX.js"), "./pages/Projects/Show.tsx": () => import("./assets/Show-ClbiGxeW.js"), "./pages/Reimbursements/CreateATR.tsx": () => import("./assets/CreateATR-Ceur3cj6.js"), "./pages/Reimbursements/CreateAllowance.tsx": () => import("./assets/CreateAllowance-zcCBYlNw.js"), "./pages/Reimbursements/CreateEER.tsx": () => import("./assets/CreateEER-DKHDG65t.js"), "./pages/Reimbursements/Index.tsx": () => import("./assets/Index-CpAuEYjH.js"), "./pages/Reimbursements/Show.tsx": () => import("./assets/Show-BnY5wbnQ.js"), "./pages/Users/Create.tsx": () => import("./assets/Create-D7zA_emq.js"), "./pages/Users/Edit.tsx": () => import("./assets/Edit-CAQfhbz6.js"), "./pages/admin/divisions/create.tsx": () => import("./assets/create-CrXh1yFJ.js"), "./pages/admin/divisions/edit.tsx": () => import("./assets/edit-CDp2IK_s.js"), "./pages/admin/divisions/index.tsx": () => import("./assets/index-DPpJxEJd.js"), "./pages/admin/letter-codes/create.tsx": () => import("./assets/create-D9eX1wc6.js"), "./pages/admin/letter-codes/edit.tsx": () => import("./assets/edit-snFZ_W2V.js"), "./pages/admin/letter-codes/index.tsx": () => import("./assets/index-CX0JqK5z.js"), "./pages/admin/letter-divisions/create.tsx": () => import("./assets/create-CrMc6xMY.js"), "./pages/admin/letter-divisions/edit.tsx": () => import("./assets/edit-j_dHn__S.js"), "./pages/admin/letter-divisions/index.tsx": () => import("./assets/index-C7DG9R2G.js"), "./pages/admin/rbac/components/PermissionList.tsx": () => import("./assets/PermissionList-BomXOLUx.js"), "./pages/admin/rbac/components/RoleList.tsx": () => import("./assets/RoleList-Codb_i8k.js"), "./pages/admin/rbac/components/RolePermissionEditor.tsx": () => import("./assets/RolePermissionEditor-CMnlP1QP.js"), "./pages/admin/rbac/index.tsx": () => import("./assets/index-NsKWlzbb.js"), "./pages/appearance/update.tsx": () => import("./assets/update-IMf_1swk.js"), "./pages/session/create.tsx": () => import("./assets/create-Cxyh-k0o.js"), "./pages/user-email-reset-notification/create.tsx": () => import("./assets/create-C46yX_EK.js"), "./pages/user-email-verification-notification/create.tsx": () => import("./assets/create-DUn9aX-f.js"), "./pages/user-password-confirmation/create.tsx": () => import("./assets/create-Cz59nN44.js"), "./pages/user-password/create.tsx": () => import("./assets/create-DTkHUZyN.js"), "./pages/user-password/edit.tsx": () => import("./assets/edit-Ddcor8UL.js"), "./pages/user-profile/edit.tsx": () => import("./assets/edit-C59Dm_8o.js"), "./pages/user-two-factor-authentication-challenge/show.tsx": () => import("./assets/show-DxLd0Ljl.js"), "./pages/user-two-factor-authentication/show.tsx": () => import("./assets/show-BL_-t7M5.js"), "./pages/user/create.tsx": () => import("./assets/create-Cm5HymZr.js"), "./pages/user/index.tsx": () => import("./assets/index-BNcEa3-e.js"), "./pages/welcome.tsx": () => import("./assets/welcome-ZztE1F9S.js") })
    ),
    setup: ({ App, props }) => {
      return /* @__PURE__ */ jsx(App, { ...props });
    }
  })
);

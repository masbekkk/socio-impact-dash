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
      /* @__PURE__ */ Object.assign({ "./pages/Calendar/Index.tsx": () => import("./assets/Index-QUpDla5D.js"), "./pages/Calendar/Show.tsx": () => import("./assets/Show-CSY8vBBC.js"), "./pages/Dashboard/Index.tsx": () => import("./assets/Index-DCZEaNVj.js"), "./pages/Leave/CreateLeave.tsx": () => import("./assets/CreateLeave-CSssqY1l.js"), "./pages/Leave/CreateTravel.tsx": () => import("./assets/CreateTravel-QhvXuFmJ.js"), "./pages/Leave/Index.tsx": () => import("./assets/Index-CdMa5kFj.js"), "./pages/Leave/Show.tsx": () => import("./assets/Show-CwMuFXsY.js"), "./pages/LetterRequests/Create.tsx": () => import("./assets/Create-Beg_xJHe.js"), "./pages/LetterRequests/Edit.tsx": () => import("./assets/Edit-B4VgKJvL.js"), "./pages/LetterRequests/Index.tsx": () => import("./assets/Index-Bub3C2-4.js"), "./pages/Presence/Create.tsx": () => import("./assets/Create-DAfUrNIT.js"), "./pages/Presence/Index.tsx": () => import("./assets/Index-i0ywnJ2k.js"), "./pages/Presence/Show.tsx": () => import("./assets/Show-Dg7K7Kth.js"), "./pages/Projects/Allowance.tsx": () => import("./assets/Allowance-BN4wjmAI.js"), "./pages/Projects/Create.tsx": () => import("./assets/Create-BZiNN4PN.js"), "./pages/Projects/Edit.tsx": () => import("./assets/Edit-Drk5jc0u.js"), "./pages/Projects/EmployeeIndex.tsx": () => import("./assets/EmployeeIndex-BH5Lsjx2.js"), "./pages/Projects/EmployeeShow.tsx": () => import("./assets/EmployeeShow-DBumhT3o.js"), "./pages/Projects/Index.tsx": () => import("./assets/Index-D9SzzVlD.js"), "./pages/Projects/ProjectTabs.tsx": () => import("./assets/ProjectTabs-CqbHRD8C.js"), "./pages/Projects/Show.tsx": () => import("./assets/Show-C__01KWS.js"), "./pages/Projects/TerminUpload.tsx": () => import("./assets/TerminUpload-_36vYWZt.js"), "./pages/Reimbursements/CreateATR.tsx": () => import("./assets/CreateATR-DJKxGZVT.js"), "./pages/Reimbursements/CreateAllowance.tsx": () => import("./assets/CreateAllowance-Do07zf5b.js"), "./pages/Reimbursements/CreateEER.tsx": () => import("./assets/CreateEER-Bz_vKE9i.js"), "./pages/Reimbursements/Index.tsx": () => import("./assets/Index-CjU91eIj.js"), "./pages/Reimbursements/Show.tsx": () => import("./assets/Show-CSyEFTjR.js"), "./pages/Users/Create.tsx": () => import("./assets/Create-vceK21l5.js"), "./pages/Users/Edit.tsx": () => import("./assets/Edit-Dw3v1Fiw.js"), "./pages/admin/divisions/create.tsx": () => import("./assets/create-DwD82gq-.js"), "./pages/admin/divisions/edit.tsx": () => import("./assets/edit-DAQMl1fc.js"), "./pages/admin/divisions/index.tsx": () => import("./assets/index-E37Q6rRo.js"), "./pages/admin/kpis/index.tsx": () => import("./assets/index-B0OJgE2V.js"), "./pages/admin/letter-codes/create.tsx": () => import("./assets/create-CznBN2N9.js"), "./pages/admin/letter-codes/edit.tsx": () => import("./assets/edit-BMbvwJrx.js"), "./pages/admin/letter-codes/index.tsx": () => import("./assets/index-C8eHLojv.js"), "./pages/admin/letter-divisions/create.tsx": () => import("./assets/create-CjF87HH7.js"), "./pages/admin/letter-divisions/edit.tsx": () => import("./assets/edit-65-Ndma8.js"), "./pages/admin/letter-divisions/index.tsx": () => import("./assets/index--avhk6QQ.js"), "./pages/admin/rbac/components/PermissionList.tsx": () => import("./assets/PermissionList-BomXOLUx.js"), "./pages/admin/rbac/components/RoleList.tsx": () => import("./assets/RoleList-Codb_i8k.js"), "./pages/admin/rbac/components/RolePermissionEditor.tsx": () => import("./assets/RolePermissionEditor-CMnlP1QP.js"), "./pages/admin/rbac/index.tsx": () => import("./assets/index-DTcUnTvA.js"), "./pages/appearance/update.tsx": () => import("./assets/update-BEbb7bAO.js"), "./pages/session/create.tsx": () => import("./assets/create-BQAmVqDs.js"), "./pages/user-email-reset-notification/create.tsx": () => import("./assets/create-C46yX_EK.js"), "./pages/user-email-verification-notification/create.tsx": () => import("./assets/create-DUn9aX-f.js"), "./pages/user-password-confirmation/create.tsx": () => import("./assets/create-Cz59nN44.js"), "./pages/user-password/create.tsx": () => import("./assets/create-DTkHUZyN.js"), "./pages/user-password/edit.tsx": () => import("./assets/edit-C7GOjti-.js"), "./pages/user-profile/edit.tsx": () => import("./assets/edit-Bvb0RDsW.js"), "./pages/user-two-factor-authentication-challenge/show.tsx": () => import("./assets/show-DxLd0Ljl.js"), "./pages/user-two-factor-authentication/show.tsx": () => import("./assets/show-BS_nQYGd.js"), "./pages/user/create.tsx": () => import("./assets/create-Cm5HymZr.js"), "./pages/user/index.tsx": () => import("./assets/index-B2R7bevb.js"), "./pages/welcome.tsx": () => import("./assets/welcome-ZztE1F9S.js") })
    ),
    setup: ({ App, props }) => {
      return /* @__PURE__ */ jsx(App, { ...props });
    }
  })
);

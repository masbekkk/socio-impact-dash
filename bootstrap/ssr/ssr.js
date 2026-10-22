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
      /* @__PURE__ */ Object.assign({ "./pages/Calendar/Index.tsx": () => import("./assets/Index-CnIBZLh2.js"), "./pages/Calendar/Show.tsx": () => import("./assets/Show-UB3lSDNM.js"), "./pages/Dashboard/Index.tsx": () => import("./assets/Index-DW-53sur.js"), "./pages/Leave/CreateLeave.tsx": () => import("./assets/CreateLeave-nK0401o1.js"), "./pages/Leave/CreateTravel.tsx": () => import("./assets/CreateTravel-CUxWzJcD.js"), "./pages/Leave/Index.tsx": () => import("./assets/Index-BUzshRDS.js"), "./pages/Leave/Show.tsx": () => import("./assets/Show-nS-SfrQn.js"), "./pages/LetterRequests/Create.tsx": () => import("./assets/Create-RW1WI0Om.js"), "./pages/LetterRequests/Edit.tsx": () => import("./assets/Edit-CTrDJo6D.js"), "./pages/LetterRequests/Index.tsx": () => import("./assets/Index-CwLkPOHB.js"), "./pages/Presence/Create.tsx": () => import("./assets/Create-CkKVBMuF.js"), "./pages/Presence/Index.tsx": () => import("./assets/Index-C8bRaKF_.js"), "./pages/Presence/Show.tsx": () => import("./assets/Show-N-mweywh.js"), "./pages/Projects/Allowance.tsx": () => import("./assets/Allowance-C8NnnbvS.js"), "./pages/Projects/Create.tsx": () => import("./assets/Create-Bc9XKW72.js"), "./pages/Projects/Edit.tsx": () => import("./assets/Edit-DBsaun34.js"), "./pages/Projects/EmployeeIndex.tsx": () => import("./assets/EmployeeIndex-8-hI0HSQ.js"), "./pages/Projects/EmployeeShow.tsx": () => import("./assets/EmployeeShow-CD9e7Pfc.js"), "./pages/Projects/Index.tsx": () => import("./assets/Index-BXs9BkZu.js"), "./pages/Projects/ProjectTabs.tsx": () => import("./assets/ProjectTabs-DZzWheIs.js"), "./pages/Projects/Show.tsx": () => import("./assets/Show-BhU-oQmg.js"), "./pages/Projects/TerminUpload.tsx": () => import("./assets/TerminUpload-CFIxBfSv.js"), "./pages/Reimbursements/CreateATR.tsx": () => import("./assets/CreateATR-BmmSIm8D.js"), "./pages/Reimbursements/CreateAllowance.tsx": () => import("./assets/CreateAllowance-DSbsqQ6r.js"), "./pages/Reimbursements/CreateEER.tsx": () => import("./assets/CreateEER-CYdH-djt.js"), "./pages/Reimbursements/Index.tsx": () => import("./assets/Index-c04oG8yu.js"), "./pages/Reimbursements/Show.tsx": () => import("./assets/Show-VoVf-OV9.js"), "./pages/Users/Create.tsx": () => import("./assets/Create-oX7vUhtP.js"), "./pages/Users/Edit.tsx": () => import("./assets/Edit-nKoCGOXl.js"), "./pages/admin/divisions/create.tsx": () => import("./assets/create-BVUzMR-z.js"), "./pages/admin/divisions/edit.tsx": () => import("./assets/edit-DEEXBuoZ.js"), "./pages/admin/divisions/index.tsx": () => import("./assets/index-x4CoqAiR.js"), "./pages/admin/kpis/index.tsx": () => import("./assets/index-Cmm4zpny.js"), "./pages/admin/letter-codes/create.tsx": () => import("./assets/create-BRjrNhfv.js"), "./pages/admin/letter-codes/edit.tsx": () => import("./assets/edit-CTyQG97R.js"), "./pages/admin/letter-codes/index.tsx": () => import("./assets/index-BD8reFiu.js"), "./pages/admin/letter-divisions/create.tsx": () => import("./assets/create-7UDpB155.js"), "./pages/admin/letter-divisions/edit.tsx": () => import("./assets/edit-C4Pjkmo8.js"), "./pages/admin/letter-divisions/index.tsx": () => import("./assets/index-CVd4VSjf.js"), "./pages/admin/rbac/components/PermissionList.tsx": () => import("./assets/PermissionList-BomXOLUx.js"), "./pages/admin/rbac/components/RoleList.tsx": () => import("./assets/RoleList-Codb_i8k.js"), "./pages/admin/rbac/components/RolePermissionEditor.tsx": () => import("./assets/RolePermissionEditor-CMnlP1QP.js"), "./pages/admin/rbac/index.tsx": () => import("./assets/index-CHS7m9EE.js"), "./pages/appearance/update.tsx": () => import("./assets/update-PaQhmjUK.js"), "./pages/session/create.tsx": () => import("./assets/create-BQAmVqDs.js"), "./pages/user-email-reset-notification/create.tsx": () => import("./assets/create-C46yX_EK.js"), "./pages/user-email-verification-notification/create.tsx": () => import("./assets/create-DUn9aX-f.js"), "./pages/user-password-confirmation/create.tsx": () => import("./assets/create-Cz59nN44.js"), "./pages/user-password/create.tsx": () => import("./assets/create-DTkHUZyN.js"), "./pages/user-password/edit.tsx": () => import("./assets/edit-6APCNtbX.js"), "./pages/user-profile/edit.tsx": () => import("./assets/edit-DmdMuOqI.js"), "./pages/user-two-factor-authentication-challenge/show.tsx": () => import("./assets/show-DxLd0Ljl.js"), "./pages/user-two-factor-authentication/show.tsx": () => import("./assets/show-CnurCp3V.js"), "./pages/user/create.tsx": () => import("./assets/create-Cm5HymZr.js"), "./pages/user/index.tsx": () => import("./assets/index-D9hM3-0a.js"), "./pages/welcome.tsx": () => import("./assets/welcome-ZztE1F9S.js") })
    ),
    setup: ({ App, props }) => {
      return /* @__PURE__ */ jsx(App, { ...props });
    }
  })
);

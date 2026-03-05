import { useState } from "react"
import AdminSidebar from "../components/AdminSidebar"
import AdminRuleAgent from "./AdminRuleAgent"
import ManageWards from "./ManageWards"
import ManageDoctors from "./ManageDoctors"
import ViewRules from "./ViewRules"
import AdminExport from "./AdminExport"

export default function AdminDashboard(){

const [activeMenu,setActiveMenu] = useState("rules")


return(

<div className="appLayout">

{/* SIDEBAR */}

<AdminSidebar
activeMenu={activeMenu}
setActiveMenu={setActiveMenu}
/>

{/* MAIN AREA */}

<div className="mainArea">

<h1 className="pageTitle">Hospital Admin Control</h1>

{/* CONTENT SWITCH */}

{activeMenu === "rules" && (

<div className="card">
<AdminRuleAgent/>
</div>

)}

{activeMenu === "viewRules" && (
<ViewRules/>
)}

{activeMenu === "wards" && (
<ManageWards/>
)}

{activeMenu === "doctors" && (
<ManageDoctors/>
)}

{activeMenu === "export" && <AdminExport />}

</div>

</div>

)

}
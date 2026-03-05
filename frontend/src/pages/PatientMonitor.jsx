import { useEffect, useState } from "react"
import ManagerSidebar from "../components/ManagerSidebar"

export default function PatientMonitor(){

const [patients,setPatients] = useState([])

const [search,setSearch] = useState("")

const [filterType,setFilterType] = useState("Severity")
const [filterValue,setFilterValue] = useState("All")

const [wards,setWards] = useState([])
const [doctors,setDoctors] = useState([])

const [severities,setSeverities] = useState([])
const [statuses,setStatuses] = useState([])



/* -----------------------------
LOAD DATA
------------------------------*/

useEffect(()=>{

loadPatients()
loadFilters()

},[])



const loadPatients = async ()=>{

const res = await fetch("http://localhost:8000/patients")
const data = await res.json()

setPatients(data)

/* derive severity + status */

const uniqueSeverity = [...new Set(data.map(p=>p.severity))]
const uniqueStatus = [...new Set(data.map(p=>p.status))]

setSeverities(uniqueSeverity)
setStatuses(uniqueStatus)

}



const loadFilters = async ()=>{

/* wards */

const wardRes = await fetch("http://localhost:8000/wards")
const wardData = await wardRes.json()

setWards(wardData)

/* doctors */

const docRes = await fetch("http://localhost:8000/doctors/")
const docData = await docRes.json()

setDoctors(docData)

}



/* -----------------------------
FILTER LOGIC
------------------------------*/

const filteredPatients = patients.filter((p)=>{

const matchSearch =
p.name?.toLowerCase().includes(search.toLowerCase())

let matchFilter = true

if(filterValue !== "All"){

if(filterType === "Severity"){
matchFilter = p.severity === filterValue
}

if(filterType === "Status"){
matchFilter = p.status === filterValue
}

if(filterType === "Ward"){
matchFilter = p.ward === filterValue
}

if(filterType === "Doctor"){
matchFilter = p.doctor === filterValue
}

}

return matchSearch && matchFilter

})



/* -----------------------------
UPDATE STATUS (OLD LOGIC KEPT)
------------------------------*/

const updateStatus = async (id,status)=>{

await fetch(`http://localhost:8000/patients/${id}/status?status=${status}`,{

method:"PUT"

})

loadPatients()

}



/* -----------------------------
AI INSIGHT
------------------------------*/

const getInsight = async(patient)=>{

const res = await fetch("http://localhost:8000/ai/patient-insight",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify(patient)

})

const data = await res.json()

alert(data.message)

}



return(

<div className="appLayout">

<ManagerSidebar/>

<div className="mainArea">

<h1 className="pageTitle">Patient Monitor</h1>

<div className="card">

<h2 style={{marginBottom:"15px"}}>Live Patient Monitoring</h2>



{/* SEARCH + FILTER */}

<div className="tableControls">

{/* SEARCH */}

<div className="filterGroup">

<label className="filterLabel">Search Patient</label>

<input
placeholder="Type patient name..."
value={search}
onChange={(e)=>setSearch(e.target.value)}
/>

</div>



{/* FILTER TYPE */}

<div className="filterGroup">

<label className="filterLabel">Filter By</label>

<select
value={filterType}
onChange={(e)=>{

setFilterType(e.target.value)
setFilterValue("All")

}}
>

<option value="Severity">Severity</option>
<option value="Status">Status</option>
<option value="Ward">Ward</option>
<option value="Doctor">Doctor</option>

</select>

</div>



{/* FILTER VALUE */}

<div className="filterGroup">

<label className="filterLabel">Value</label>

<select
value={filterValue}
onChange={(e)=>setFilterValue(e.target.value)}
>

<option value="All">All</option>


{/* Severity */}

{filterType === "Severity" &&
severities.map((s,i)=>(
<option key={i} value={s}>{s}</option>
))
}


{/* Status */}

{filterType === "Status" &&
statuses.map((s,i)=>(
<option key={i} value={s}>{s}</option>
))
}


{/* Ward */}

{filterType === "Ward" &&
wards.map((w,i)=>(
<option key={i} value={w.name}>{w.name}</option>
))
}


{/* Doctor */}

{filterType === "Doctor" &&
doctors.map((d,i)=>(
<option key={i} value={d.name}>{d.name}</option>
))
}

</select>

</div>

</div>



{/* PATIENT TABLE */}

<table className="table">

<thead>

<tr>
<th>Name</th>
<th>Severity</th>
<th>Status</th>
<th>Ward</th>
<th>Doctor</th>
<th>AI Insight</th>
</tr>

</thead>

<tbody>

{filteredPatients.map((p,index)=>(

<tr key={index}>

<td>{p.name}</td>


<td>

<span className={`severity ${p.severity?.toLowerCase()}`}>
{p.severity}
</span>

</td>


{/* STATUS DROPDOWN (OLD FEATURE RESTORED) */}

<td>

<select
value={p.status}
onChange={(e)=>updateStatus(p.id,e.target.value)}
>

<option>Admitted</option>
<option>Under Treatment</option>
<option>Discharged</option>

</select>

</td>


<td>{p.ward}</td>

<td>{p.doctor}</td>


<td>

<button
className="insightBtn"
onClick={()=>getInsight(p)}
>

🧠 Explain Condition

</button>

</td>

</tr>

))}

</tbody>

</table>

</div>

</div>

</div>

)

}
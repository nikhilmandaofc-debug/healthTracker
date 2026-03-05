import { useState } from "react"

export default function AdminExport(){

const [loading,setLoading] = useState("")

const exportFile = async(type)=>{

setLoading(type)

const res = await fetch(`http://localhost:8000/export/${type}`)

const blob = await res.blob()

const url = window.URL.createObjectURL(blob)

const a = document.createElement("a")

a.href = url
a.download = `${type}.xlsx`

a.click()

setLoading("")

}

return(

<div>

<h1 className="pageTitle">Export Hospital Data</h1>

<div className="exportGrid">

<div className="exportCard">

<div className="exportIcon">📄</div>

<h3>Patients</h3>

<p>Download all patient records</p>

<button
className="primaryBtn"
onClick={()=>exportFile("patients")}
>

{loading==="patients" ? "Exporting..." : "Export Excel"}

</button>

</div>


<div className="exportCard">

<div className="exportIcon">👨‍⚕️</div>

<h3>Doctors</h3>

<p>Download doctor database</p>

<button
className="primaryBtn"
onClick={()=>exportFile("doctors")}
>

{loading==="doctors" ? "Exporting..." : "Export Excel"}

</button>

</div>


<div className="exportCard">

<div className="exportIcon">🏥</div>

<h3>Wards</h3>

<p>Download ward details</p>

<button
className="primaryBtn"
onClick={()=>exportFile("wards")}
>

{loading==="wards" ? "Exporting..." : "Export Excel"}

</button>

</div>


<div className="exportCard">

<div className="exportIcon">⚙</div>

<h3>Triage Rules</h3>

<p>Download triage rules</p>

<button
className="primaryBtn"
onClick={()=>exportFile("rules")}
>

{loading==="rules" ? "Exporting..." : "Export Excel"}

</button>

</div>

</div>

</div>

)

}
import { useEffect, useState } from "react"

export default function ViewRules(){

const [rules,setRules] = useState([])

const loadRules = async()=>{

const res = await fetch("http://localhost:8000/rules/")
const data = await res.json()

setRules(data)

}

useEffect(()=>{
loadRules()
},[])

return(

<div className="card">

<h2>Rules Table</h2>

<table className="table">

<thead>

<tr>
<th>ID</th>
<th>Parameter</th>
<th>Operator</th>
<th>Threshold</th>
<th>Category</th>
</tr>

</thead>

<tbody>

{rules.map(rule=>(
<tr key={rule.id}>
<td>{rule.id}</td>
<td>{rule.parameter}</td>
<td>{rule.operator}</td>
<td>{rule.threshold}</td>
<td>{rule.category}</td>
</tr>
))}

</tbody>

</table>

</div>

)

}
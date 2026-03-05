import { useState, useEffect } from "react"

export default function AdminRuleAgent(){

const [message,setMessage] = useState("")
const [chat,setChat] = useState([])
const [rules,setRules] = useState([])

useEffect(()=>{
loadRules()
},[])

const loadRules = async()=>{

const res = await fetch("http://localhost:8000/rules/")
const data = await res.json()

setRules(data)

}

const sendMessage = async () => {

    if(!message.trim()) return
    
    const userMessage = {type:"user",text:message}
    
    setChat(prev=>[...prev,userMessage])
    
    const res = await fetch("http://localhost:8000/rules/agent",{
    
    method:"POST",
    
    headers:{
    "Content-Type":"application/json"
    },
    
    body:JSON.stringify({
    prompt: message,
    overwrite: false
    })
    
    })
    
    const data = await res.json()
    
    const aiMessage = {
    type:"ai",
    text:data.message
    }
    
    setChat(prev=>[...prev,aiMessage])
    
    setMessage("")
    
    

loadRules()

}

return(

<div >

<h1 className="pageTitle">AI Rule Agent</h1>

{/* CHAT CARD */}

<div className="card">

<div className="chatWindow">

{chat.length === 0 && (

<p className="chatPlaceholder">
Ask AI to create or modify triage rules.
Example: "If oxygen falls below 88 send patient to ICU"
</p>

)}

{chat.map((msg,index)=>(
<div key={index} className={`chatMessage ${msg.type}`}>
{msg.text}
</div>
))}

</div>

<div className="chatInputArea">

<input
placeholder="Example: If oxygen falls below 88 assign ICU"
value={message}
onChange={(e)=>setMessage(e.target.value)}
/>

<button
className="primaryBtn"
onClick={sendMessage}
>
Send
</button>

</div>

</div>

{/* RULE TABLE */}

</div>

)

}
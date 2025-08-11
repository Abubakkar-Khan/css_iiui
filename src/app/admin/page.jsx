'use client'
import { useEffect, useState } from 'react'

export default function Admin(){
  const [items,setItems]=useState([])
  const [form,setForm]=useState({ title:'', date:'', img:'', excerpt:'' })
  async function refresh(){ const r=await fetch('/api/events'); setItems(await r.json()) }
  useEffect(()=>{ refresh() },[])
  return (
    <div className="section py-16">
      <div className="flex items-center justify-between">
        <h1 className="section-title">Dashboard</h1>
        <a className="btn-ghost" href="/api/auth/signin">Sign in</a>
      </div>
      <div className="grid md:grid-cols-2 gap-6 mt-8">
        <form className="card" onSubmit={async e=>{
          e.preventDefault();
          await fetch('/api/events',{method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(form)});
          setForm({title:'',date:'',img:'',excerpt:''});
          await refresh()
        }}>
          <h2 className="font-bold">Add Event</h2>
          {['title','date','img','excerpt'].map(k=> (
            <input key={k} placeholder={k} value={form[k]} onChange={e=>setForm({...form,[k]:e.target.value})} className="mt-2 w-full rounded bg-black/40 border border-white/10 px-3 py-2" />
          ))}
          <button className="btn mt-3">Save</button>
        </form>
        <div className="card">
          <h2 className="font-bold mb-2">Events</h2>
          <ul className="space-y-2">
            {items.map((it)=> (
              <li key={it.id} className="flex items-center justify-between bg-black/30 rounded px-3 py-2">
                <span>{it.title}</span>
                <button className="btn-ghost" onClick={async()=>{ await fetch('/api/events',{method:'DELETE', headers:{'Content-Type':'application/json'}, body:JSON.stringify({id:it.id})}); await refresh() }}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
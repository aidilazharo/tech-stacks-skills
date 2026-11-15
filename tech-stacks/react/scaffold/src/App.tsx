import React, { useEffect, useState } from 'react';
import './qi.css';
import './startup.css';
import { ComponentShowcase } from './ComponentShowcase';
type Health = { status: string; database?: string; apiPort?: number; startedAt?: string; instanceId?: string };
type Task = { id: number; title: string; status: string };
const commands = [['Install dependencies','npm install'],['Launch frontend and API','npm run dev'],['Run unit and API tests','npm test'],['Run browser tests','npm run test:e2e'],['Create production build','npm run build']];
const project=import.meta.env.VITE_ATGV_PROJECT||'React + SQLite starter';
const branch=import.meta.env.VITE_ATGV_BRANCH||'Local checkout';
const revision=import.meta.env.VITE_ATGV_REVISION||'Unspecified';
export function App() {
 const [health,setHealth]=useState<Health|null>(null);
 const [healthError,setHealthError]=useState('');
 const [tasks,setTasks]=useState<Task[]>([]);
 const [name,setName]=useState('');
 const [error,setError]=useState('');
 const [busy,setBusy]=useState(false);
 const [copied,setCopied]=useState('');
 async function reload(signal?:AbortSignal){
  const r=await fetch('/api/tasks',{signal,cache:'no-store'});
  if(!r.ok)throw Error('Task service returned '+r.status);
  setTasks(await r.json() as Task[]);
 }
 useEffect(()=>{
  const abort=new AbortController(); let active=true;
  async function check(){
   try{
    const r=await fetch('/api/health',{signal:abort.signal,cache:'no-store'});
    if(!r.ok)throw Error('API responded with HTTP '+r.status);
    const value=await r.json() as Health;
    if(value.status!=='ok')throw Error('API not ready');
    if(active){setHealth(value);setHealthError('');}
   }catch(cause){if(active&&!abort.signal.aborted){setHealth(null);setHealthError(String(cause));}}
  }
  void check();
  void reload(abort.signal).catch(cause=>{if(active&&!abort.signal.aborted)setError(String(cause));});
  const interval=setInterval(()=>{void check();},10000);
  return()=>{active=false;abort.abort();clearInterval(interval);};
 },[]);
 async function add(event:React.FormEvent<HTMLFormElement>){
  event.preventDefault();if(!name.trim()||busy)return;setBusy(true);
  try{
   const r=await fetch('/api/tasks',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({title:name.trim()})});
   if(!r.ok)throw Error('Unable to create task (HTTP '+r.status+')');
   setName('');setError('');await reload();
  }catch(cause){setError(String(cause));}finally{setBusy(false);}
 }
 async function remove(id:number){
  if(busy)return;setBusy(true);
  try{
   const r=await fetch('/api/tasks/'+id,{method:'DELETE'});
   if(r.status!==204)throw Error('Unable to delete task (HTTP '+r.status+')');
   setError('');await reload();
  }catch(cause){setError(String(cause));}finally{setBusy(false);}
 }
 async function copy(command:string){
  try{await navigator.clipboard.writeText(command);setCopied(command);}
  catch{setCopied('Select the command and copy manually.');}
 }
 const apiPort=health?.apiPort||Number(import.meta.env.VITE_ATGV_API_PORT||3001);
 const healthy=health?.status==='ok';
 const frontend=window.location.origin;
 return <div className="atgv-app" data-atgv-startup="react-sqlite">
  <header className="atgv-header"><div className="qi-container atgv-header-inner">
   <a href="/" className="atgv-brand" aria-label="ATGV application home"><img src="/atgv-mark.svg" alt="ATGV" width="102" height="36"/><span className="atgv-divider"/><span className="atgv-aia">AIA</span><span className="atgv-brand-note">Qi-inspired developer workspace</span></a>
   <span className="atgv-env"><span className="atgv-dot"/> LOCAL DEVELOPMENT</span>
  </div></header>
  <main className="qi-container atgv-main">
   <section className="atgv-hero">
    <div><p className="atgv-eyebrow">APPLICATION LAUNCHPAD / REACT + SQLITE</p>
     <h1>Your development environment, at a glance.</h1>
     <p className="atgv-intro">Review live service health, explore API documentation, run checks, and begin implementing approved business requirements.</p>
     <div className="atgv-actions"><a href="/api/docs" target="_blank" rel="noreferrer" className="qi-btn qi-btn-primary">Open Swagger documentation</a><a href="/api/health" target="_blank" rel="noreferrer" className="qi-btn qi-btn-secondary">Inspect API health</a><a className="qi-btn qi-btn-secondary" href="#qi-components">Browse UI components</a></div>
    </div><div className="atgv-hero-art" aria-hidden="true"><div className="atgv-ring"/><div className="atgv-hero-mark">ATGV<small>BUILD / TEST / RUN</small></div></div>
   </section>
   <div className="atgv-section-head"><div><p className="atgv-eyebrow">SYSTEM OVERVIEW</p><h2>Service readiness</h2></div><small>Health refreshes every 10 seconds</small></div>
   <section className="atgv-stats" aria-label="Live local service status" aria-live="polite">
    <article className="atgv-stat"><span>FRONTEND <b className="atgv-pill ok">Running</b></span><strong>React 19 / Vite</strong><code title={frontend}>{frontend}</code><small>Current browser origin</small></article>
    <article className="atgv-stat"><span>API SERVICE <b className={'atgv-pill '+(healthy?'ok':'warn')}>{healthy?'Connected':'Unverified'}</b></span><strong>Node.js / Express</strong><code>http://127.0.0.1:{apiPort}</code><small>Actual API port</small></article>
    <article className="atgv-stat"><span>DATABASE <b className={'atgv-pill '+(healthy&&health?.database==='sqlite'?'ok':'warn')}>{healthy&&health?.database==='sqlite'?'Connected':'Unverified'}</b></span><strong>SQLite / Drizzle</strong><code>Local database</code><small>Verified through the API</small></article>
    <article className="atgv-stat"><span>HEALTH STATUS <b className={'atgv-pill '+(healthy?'ok':'warn')}>{healthy?'Healthy':'Attention'}</b></span><strong>{healthy?'Core services ready':'API verification pending'}</strong><code>{healthy?'Status endpoint returned OK':(healthError||'Checking service')}</code><small>{health?.startedAt?'Started '+new Date(health.startedAt).toLocaleString():'Runtime check'}</small></article>
   </section>
   <ComponentShowcase/>
   <div className="atgv-columns"><div className="atgv-primary">
    <section className="qi-card atgv-panel"><p className="atgv-eyebrow">QUICK START</p><h2>Developer commands</h2><p className="atgv-hint">Run these from the local application checkout.</p>
     <div className="atgv-commands">{commands.map(([label,command])=><div className="atgv-command" key={command}><div><small>{label}</small><code>{command}</code></div><button type="button" onClick={()=>void copy(command)} aria-label={'Copy '+command}>{copied===command?'Copied':'Copy'}</button></div>)}</div>
     {copied==='Select the command and copy manually.'&&<p role="status">{copied}</p>}
    </section>
    <section className="qi-card atgv-panel"><p className="atgv-eyebrow">API SANDBOX</p><h2>Try the starter task endpoint</h2><p className="atgv-hint">A working smoke-test example for the SQLite API. Replace this sample with features grounded in approved BRs.</p>
     <form onSubmit={event=>void add(event)}><label className="qi-label" htmlFor="task-title">Task name</label><div className="atgv-task-input"><input id="task-title" className="qi-input" maxLength={200} value={name} onChange={event=>setName(event.target.value)} placeholder="e.g. Verify local API" /><button className="qi-btn qi-btn-primary" disabled={busy||!name.trim()} type="submit">Add task</button></div></form>
     {error&&<p className="atgv-alert" role="alert">{error}</p>}
     {tasks.length===0?<p className="atgv-empty">No sample tasks yet. Create one to verify the API.</p>:<ul className="atgv-tasks">{tasks.map(task=><li key={task.id}><span>{task.title} <small>({task.status})</small></span><button type="button" disabled={busy} onClick={()=>void remove(task.id)} aria-label={'Delete '+task.title}>Delete</button></li>)}</ul>}
    </section>
   </div><aside className="atgv-secondary">
    <section className="qi-card atgv-panel"><p className="atgv-eyebrow">ENVIRONMENT</p><h2>Project details</h2><dl className="atgv-details"><div><dt>Project</dt><dd>{project}</dd></div><div><dt>Framework</dt><dd>React 19 + TypeScript</dd></div><div><dt>Build tool</dt><dd>Vite</dd></div><div><dt>Database</dt><dd>SQLite + Drizzle ORM</dd></div><div><dt>Git branch</dt><dd>{branch}</dd></div><div><dt>Git revision</dt><dd title={revision}>{revision.slice(0,12)}</dd></div><div><dt>API port</dt><dd>{apiPort}</dd></div></dl></section>
    <section className="qi-card atgv-panel atgv-note"><p className="atgv-eyebrow">DEVELOPER NOTES</p><h2>Good to know</h2><ul><li>ATGV manages one application process tree at a time.</li><li>Occupied ports are not proof of ATGV ownership; use the URL shown by the extension.</li><li>Run approved BR acceptance tests separately from this starter smoke test.</li><li>Browser tests may require installing Playwright browsers.</li></ul></section>
   </aside></div>
   <footer className="atgv-footer"><span>ATGV AIATECH Assist / Qi-inspired local developer experience</span><span>Starter dashboard — not an application acceptance result</span></footer>
  </main>
 </div>;
}

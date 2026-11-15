import React, { useState } from 'react';

/** Interactive demonstration of the independent Qi-inspired catalog.
 * These are starter examples, not the licensed or official AIA Qi library.
 */
export function ComponentShowcase() {
 const [tab,setTab]=useState<'components'|'forms'|'data'>('components');
 const [dialog,setDialog]=useState(false);
 const [alert,setAlert]=useState('');
 const [choice,setChoice]=useState('standard');
 const [agreed,setAgreed]=useState(false);
 const [name,setName]=useState('');
 const [progress,setProgress]=useState(68);
 const tabs: Array<{value:typeof tab;label:string}>=[
  {value:'components',label:'Components'},
  {value:'forms',label:'Forms & inputs'},
  {value:'data',label:'Data & feedback'}
 ];
 return <section id="qi-components" className="atgv-showcase" aria-labelledby="qi-gallery-title">
  <div className="atgv-showcase-head">
   <div><p className="atgv-eyebrow">DESIGN SYSTEM / LIVE COMPONENT REFERENCE</p>
    <h2 id="qi-gallery-title">Qi-inspired component library</h2>
    <p>Explore the reusable UI elements, states and accessible interactions used to build ATGV applications.</p>
   </div>
   <span className="atgv-kit-label">Independent starter · not official AIA Qi</span>
  </div>
  <div className="atgv-showcase-tabs" role="tablist" aria-label="Component categories">
   {tabs.map((item)=> <button key={item.value} role="tab" id={'qi-tab-'+item.value}
    aria-selected={tab===item.value} aria-controls={'qi-panel-'+item.value}
    tabIndex={tab===item.value?0:-1} className={'atgv-demo-tab'+(tab===item.value?' active':'')}
    onClick={()=>setTab(item.value)}
    onKeyDown={event=>{if(['ArrowRight','ArrowLeft','Home','End'].includes(event.key)){
     event.preventDefault();const i=tabs.findIndex(t=>t.value===tab);
     const j=event.key==='Home'?0:event.key==='End'?tabs.length-1:(i+(event.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;
     setTab(tabs[j].value);
     document.getElementById('qi-tab-'+tabs[j].value)?.focus();
    }}}>{item.label}</button>)}
  </div>
  {tab==='components'&&<div id="qi-panel-components" role="tabpanel" aria-labelledby="qi-tab-components" className="atgv-showcase-body">
   <div className="atgv-demo-grid">
    <article className="qi-card atgv-demo-card"><div className="atgv-demo-card-head"><strong>Buttons</strong><code>.qi-btn</code></div>
     <p>Action hierarchy and disabled states.</p>
     <div className="atgv-demo-actions"><button type="button" className="qi-btn qi-btn-primary" onClick={()=>setAlert('Primary button activated.')}>Primary</button>
      <button type="button" className="qi-btn qi-btn-secondary" onClick={()=>setAlert('Secondary button activated.')}>Secondary</button>
      <button type="button" className="qi-btn qi-btn-danger" onClick={()=>setDialog(true)}>Destructive</button>
      <button type="button" className="qi-btn qi-btn-secondary" disabled>Disabled</button></div>
    </article>
    <article className="qi-card atgv-demo-card"><div className="atgv-demo-card-head"><strong>Status badges & chips</strong><code>.qi-badge</code></div>
     <p>Communicate status using labels, not color alone.</p><div className="atgv-demo-actions">
      <span className="qi-badge qi-badge-success">Ready</span><span className="qi-badge qi-badge-warning">Pending</span>
      <span className="qi-badge qi-badge-danger">Blocked</span><span className="qi-badge qi-badge-info">Draft</span></div>
    </article>
    <article className="qi-card atgv-demo-card"><div className="atgv-demo-card-head"><strong>Cards & KPI</strong><code>.qi-card / .qi-kpi</code></div>
     <p>Responsive surfaces for important information.</p><div className="atgv-demo-kpis">
      <div><span>Open items</span><strong>24</strong></div><div><span>Success rate</span><strong>98%</strong></div><div><span>Review queue</span><strong>3</strong></div></div>
    </article>
   </div>
   <div className="qi-alert qi-alert-success atgv-demo-alert" role="status">Component library loaded from the verified SDLC Catalog.</div>
  </div>}
  {tab==='forms'&&<div id="qi-panel-forms" role="tabpanel" aria-labelledby="qi-tab-forms" className="atgv-showcase-body">
   <div className="atgv-demo-grid">
    <form className="qi-card atgv-demo-card atgv-demo-form" onSubmit={e=>{e.preventDefault();setAlert(name.trim()?'Sample form validated: '+name.trim():'Enter a name before submitting.');}}>
     <div className="atgv-demo-card-head"><strong>Text fields & validation</strong><code>.qi-input</code></div>
     <label className="qi-label" htmlFor="demo-person-name">Person name</label>
     <input className="qi-input" id="demo-person-name" value={name} onChange={e=>setName(e.target.value)} placeholder="Enter name" required maxLength={80}/>
     <small>Required · maximum 80 characters</small>
     <button type="submit" className="qi-btn qi-btn-primary">Submit sample</button>
    </form>
    <article className="qi-card atgv-demo-card atgv-demo-form">
     <div className="atgv-demo-card-head"><strong>Dropdowns & checks</strong><code>.qi-select</code></div>
     <label className="qi-label" htmlFor="demo-variant">Choose variant</label>
     <select id="demo-variant" className="qi-select" value={choice} onChange={e=>setChoice(e.target.value)}>
      <option value="standard">Standard</option><option value="compact">Compact</option><option value="wide">Wide</option>
     </select>
     <label className="atgv-demo-check"><input type="checkbox" checked={agreed} onChange={e=>setAgreed(e.target.checked)}/> Enable example setting</label>
     <small>Selected: {choice}; setting {agreed?'enabled':'disabled'}</small>
    </article>
    <article className="qi-card atgv-demo-card atgv-demo-form">
     <div className="atgv-demo-card-head"><strong>Textarea & actions</strong><code>.qi-textarea</code></div>
     <label className="qi-label" htmlFor="demo-notes">Notes</label>
     <textarea id="demo-notes" className="qi-textarea" rows={3} placeholder="Write an example note"/>
     <button className="qi-btn qi-btn-secondary" type="button" onClick={()=>setAlert('Sample notes ready for review.')}>Review notes</button>
    </article>
   </div>
  </div>}
  {tab==='data'&&<div id="qi-panel-data" role="tabpanel" aria-labelledby="qi-tab-data" className="atgv-showcase-body">
   <div className="atgv-demo-grid">
    <article className="qi-card atgv-demo-card atgv-demo-wide"><div className="atgv-demo-card-head"><strong>Responsive data table</strong><code>.qi-table</code></div>
     <div className="qi-table-wrap"><table className="qi-table"><thead><tr><th scope="col">Item</th><th scope="col">Owner</th><th scope="col">Status</th></tr></thead>
      <tbody><tr><td>Developer handoff</td><td>Solution Architect</td><td><span className="qi-badge qi-badge-success">Ready</span></td></tr>
       <tr><td>API contract</td><td>Developer</td><td><span className="qi-badge qi-badge-warning">Pending</span></td></tr>
       <tr><td>Acceptance tests</td><td>QA</td><td><span className="qi-badge qi-badge-info">Draft</span></td></tr></tbody></table></div>
    </article>
    <article className="qi-card atgv-demo-card"><div className="atgv-demo-card-head"><strong>Progress & disclosure</strong><code>.qi-progress</code></div>
     <label htmlFor="demo-progress">Completion: {progress}%</label>
     <progress id="demo-progress" className="atgv-demo-progress" value={progress} max={100}/>
     <input type="range" aria-label="Adjust progress example" min={0} max={100} step={1} value={progress} onChange={e=>setProgress(Number(e.target.value))}/>
     <details className="atgv-demo-accordion"><summary>What does the progress show?</summary><p>A demonstration value only, not an actual project result.</p></details>
    </article>
   </div>
  </div>}
  {alert&&<div className="atgv-demo-message" role="status"><span>{alert}</span><button type="button" aria-label="Dismiss notification" onClick={()=>setAlert('')}>Dismiss</button></div>}
  {dialog&&<div className="atgv-demo-backdrop" role="presentation">
   <div className="atgv-demo-dialog" role="dialog" aria-modal="true" aria-labelledby="demo-modal-title">
    <h3 id="demo-modal-title">Example confirmation</h3><p>This is a component demo. No data will be deleted.</p>
    <div className="atgv-demo-actions"><button type="button" className="qi-btn qi-btn-secondary" autoFocus onClick={()=>setDialog(false)}>Cancel</button>
     <button type="button" className="qi-btn qi-btn-danger" onClick={()=>{setDialog(false);setAlert('Demo confirmation completed.');}}>Confirm demo</button></div>
   </div></div>}
 </section>;
}

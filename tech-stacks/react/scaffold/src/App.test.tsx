import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { App } from './App';
afterEach(()=>{cleanup();vi.unstubAllGlobals();});
describe('developer startup',()=>{
 it('renders interactive Qi-inspired component gallery with forms and data tables',()=>{
  vi.stubGlobal('fetch',vi.fn(async(input:string)=>({ok:true,status:200,json:async()=>input==='/api/health'?{status:'ok',database:'sqlite',apiPort:3002}:[]})));
  render(<App/>);
  expect(screen.getByRole('heading',{name:'Qi-inspired component library'})).toBeInTheDocument();
  expect(screen.getByRole('link',{name:'Browse UI components'})).toHaveAttribute('href','#qi-components');
  fireEvent.click(screen.getByRole('tab',{name:'Forms & inputs'}));
  expect(screen.getByLabelText('Person name')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('tab',{name:'Data & feedback'}));
  expect(screen.getByRole('table')).toBeInTheDocument();
 });
 it('mounts and displays live API port from health',async()=>{
  vi.stubGlobal('fetch',vi.fn(async (input:string)=>({ok:true,status:200,json:async()=>input==='/api/health'?{status:'ok',database:'sqlite',apiPort:3002}:[]})));
  render(<App/>);
  expect(screen.getByRole('heading',{name:/development environment/i})).toBeInTheDocument();
  await waitFor(()=>expect(screen.getByText('http://127.0.0.1:3002')).toBeInTheDocument());
  expect(screen.getByRole('link',{name:/Swagger documentation/i})).toHaveAttribute('href','/api/docs');
 });
 it('does not claim connected database when health check fails',async()=>{
  vi.stubGlobal('fetch',vi.fn(async()=>{throw Error('offline');}));
  render(<App/>);
  await waitFor(()=>expect(screen.getByText('API verification pending')).toBeInTheDocument());
  expect(screen.getAllByText('Unverified').length).toBeGreaterThan(0);
 });
});

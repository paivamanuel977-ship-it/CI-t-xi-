import React, { useMemo, useState } from 'react';
import { LayoutDashboard, CarFront, Wallet, Users, Banknote, FileText, Plus, LogOut, ShieldCheck, Menu } from 'lucide-react';

const initialTrips = [
  { id: 1, date: new Date().toISOString().slice(0,10), driver: 'Motorista de exemplo', destination: 'Rio Tinto', cash: 10000, transfer: 0, fuel: 2500 }
];
const money = n => new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA', maximumFractionDigits: 0 }).format(Number(n || 0));

export default function App() {
  const [role, setRole] = useState('');
  const [tab, setTab] = useState('Painel');
  const [trips, setTrips] = useState(() => JSON.parse(localStorage.getItem('ci-taxi-trips') || 'null') || initialTrips);
  const [expenses, setExpenses] = useState(() => JSON.parse(localStorage.getItem('ci-taxi-expenses') || '[]'));
  const [employees, setEmployees] = useState(() => JSON.parse(localStorage.getItem('ci-taxi-employees') || '[]'));
  const [tripForm, setTripForm] = useState({date:new Date().toISOString().slice(0,10), driver:'', destination:'', cash:'', transfer:'', fuel:''});
  const [expenseForm, setExpenseForm] = useState({date:new Date().toISOString().slice(0,10), description:'', amount:''});
  const [employeeForm, setEmployeeForm] = useState({name:'', phone:'', salary:''});
  const [notice, setNotice] = useState('');

  const save = (key, value, setter) => { setter(value); localStorage.setItem(key, JSON.stringify(value)); };
  const totals = useMemo(() => ({
    revenue: trips.reduce((s,t)=>s+Number(t.cash||0)+Number(t.transfer||0),0),
    fuel: trips.reduce((s,t)=>s+Number(t.fuel||0),0),
    other: expenses.reduce((s,e)=>s+Number(e.amount||0),0)
  }), [trips, expenses]);
  const nav = [
    ['Painel', LayoutDashboard], ['Corridas', CarFront], ['Despesas', Wallet], ['Funcionários', Users],
    ...(role === 'owner' ? [['Salários', Banknote], ['Relatórios', FileText]] : [])
  ];

  function addTrip(e) {
    e.preventDefault();
    const item = {...tripForm, id:Date.now(), cash:Number(tripForm.cash), transfer:Number(tripForm.transfer), fuel:Number(tripForm.fuel)};
    save('ci-taxi-trips', [item,...trips], setTrips);
    setTripForm({date:new Date().toISOString().slice(0,10), driver:'', destination:'', cash:'', transfer:'', fuel:''});
    setNotice('Corrida registada neste dispositivo.');
  }
  function addExpense(e) {
    e.preventDefault();
    const item = {...expenseForm, id:Date.now(), amount:Number(expenseForm.amount)};
    save('ci-taxi-expenses', [item,...expenses], setExpenses);
    setExpenseForm({date:new Date().toISOString().slice(0,10), description:'', amount:''});
    setNotice('Despesa registada neste dispositivo.');
  }
  function addEmployee(e) {
    e.preventDefault();
    const item = {...employeeForm, id:Date.now(), salary:Number(employeeForm.salary)};
    save('ci-taxi-employees', [item,...employees], setEmployees);
    setEmployeeForm({name:'',phone:'',salary:''});
    setNotice('Funcionário registado neste dispositivo.');
  }
  if (!role) return <main className="login"><div className="brand-mark">CI</div><p className="eyebrow">SISTEMA DE GESTÃO</p><h1>CI Táxi</h1><p className="muted">Gestão simples de corridas, despesas e equipa.</p><div className="role-card"><h2>Entrar na demonstração</h2><p>Escolhe o perfil para explorar os ecrãs.</p><button onClick={()=>setRole('owner')}>Entrar como proprietário</button><button className="secondary" onClick={()=>setRole('manager')}>Entrar como responsável</button><small>Esta seleção é apenas demonstrativa; não é um sistema de autenticação.</small></div></main>;

  return <div className="app-shell">
    <aside className="sidebar"><div className="brand"><div className="brand-mark small">CI</div><div><b>CI TÁXI</b><small>Gestão de frota</small></div></div>
      <div className="nav-label">MENU PRINCIPAL</div>{nav.map(([name,Icon])=><button key={name} className={'nav-item '+(tab===name?'active':'')} onClick={()=>{setTab(name);setNotice('')}}><Icon size={18}/>{name}</button>)}
      <div className="side-bottom"><ShieldCheck size={17}/><span>{role==='owner'?'Proprietário':'Responsável'}<small>{role==='owner'?'Acesso de demonstração':'Acesso limitado de demonstração'}</small></span></div>
      <button className="logout" onClick={()=>{setRole('');setTab('Painel')}}><LogOut size={17}/> Sair</button>
    </aside>
    <main className="main">
      <header><div><p className="eyebrow">BEM-VINDO AO SISTEMA</p><h1>{tab}</h1></div><span className="user-pill">{role==='owner'?'Proprietário':'Responsável'}</span></header>
      {notice && <div className="notice">{notice}</div>}
      {tab==='Painel' && <><div className="stats">
        <Stat title="Receita registada" value={money(totals.revenue)} icon={<Banknote/>}/>
        <Stat title="Combustível" value={money(totals.fuel)} icon={<CarFront/>}/>
        <Stat title="Outras despesas" value={money(totals.other)} icon={<Wallet/>}/>
        {role==='owner'&&<Stat title="Saldo estimado" value={money(totals.revenue-totals.fuel-totals.other)} icon={<FileText/>}/>}
      </div><section className="panel"><h2>Atividade recente</h2><DataTable headers={['Data','Motorista','Destino','Receita']} rows={trips.slice(0,5).map(t=>[t.date,t.driver,t.destination,money(Number(t.cash)+Number(t.transfer))])}/></section></>}
      {tab==='Corridas' && <><section className="panel"><h2>Registar corrida</h2><form onSubmit={addTrip} className="form-grid"><Field label="Data"><input type="date" required value={tripForm.date} onChange={e=>setTripForm({...tripForm,date:e.target.value})}/></Field><Field label="Motorista"><input required placeholder="Nome do motorista" value={tripForm.driver} onChange={e=>setTripForm({...tripForm,driver:e.target.value})}/></Field><Field label="Destino"><input required placeholder="Destino da corrida" value={tripForm.destination} onChange={e=>setTripForm({...tripForm,destination:e.target.value})}/></Field><Field label="Dinheiro (Kz)"><input type="number" min="0" value={tripForm.cash} onChange={e=>setTripForm({...tripForm,cash:e.target.value})}/></Field><Field label="Transferência (Kz)"><input type="number" min="0" value={tripForm.transfer} onChange={e=>setTripForm({...tripForm,transfer:e.target.value})}/></Field><Field label="Combustível (Kz)"><input type="number" min="0" value={tripForm.fuel} onChange={e=>setTripForm({...tripForm,fuel:e.target.value})}/></Field><button className="submit"><Plus size={17}/> Guardar corrida</button></form></section><section className="panel"><h2>Corridas registadas</h2><DataTable headers={['Data','Motorista','Destino','Cash','Transferência','Combustível']} rows={trips.map(t=>[t.date,t.driver,t.destination,money(t.cash),money(t.transfer),money(t.fuel)])}/></section></>}
      {tab==='Despesas' && <><section className="panel"><h2>Registar despesa</h2><form className="form-grid" onSubmit={addExpense}><Field label="Data"><input type="date" required value={expenseForm.date} onChange={e=>setExpenseForm({...expenseForm,date:e.target.value})}/></Field><Field label="Descrição"><input required placeholder="Ex.: manutenção" value={expenseForm.description} onChange={e=>setExpenseForm({...expenseForm,description:e.target.value})}/></Field><Field label="Valor (Kz)"><input type="number" min="0" required value={expenseForm.amount} onChange={e=>setExpenseForm({...expenseForm,amount:e.target.value})}/></Field><button className="submit"><Plus size={17}/> Guardar despesa</button></form></section><section className="panel"><h2>Despesas registadas</h2><DataTable headers={['Data','Descrição','Valor']} rows={expenses.map(x=>[x.date,x.description,money(x.amount)])}/></section></>}
      {tab==='Funcionários' && <><section className="panel"><h2>Adicionar funcionário</h2><form className="form-grid" onSubmit={addEmployee}><Field label="Nome"><input required value={employeeForm.name} onChange={e=>setEmployeeForm({...employeeForm,name:e.target.value})}/></Field><Field label="Telefone"><input value={employeeForm.phone} onChange={e=>setEmployeeForm({...employeeForm,phone:e.target.value})}/></Field>{role==='owner'&&<Field label="Salário (Kz)"><input type="number" min="0" value={employeeForm.salary} onChange={e=>setEmployeeForm({...employeeForm,salary:e.target.value})}/></Field>}<button className="submit"><Plus size={17}/> Guardar funcionário</button></form></section><section className="panel"><h2>Equipa</h2><DataTable headers={role==='owner'?['Nome','Telefone','Salário']:['Nome','Telefone']} rows={employees.map(x=>role==='owner'?[x.name,x.phone,money(x.salary)]:[x.name,x.phone])}/></section></>}
      {tab==='Salários' && role==='owner' && <section className="panel"><h2>Salários — acesso do proprietário</h2><p className="muted">Os valores abaixo são dados de demonstração guardados apenas neste navegador.</p><DataTable headers={['Funcionário','Salário mensal']} rows={employees.map(x=>[x.name,money(x.salary)])}/></section>}
      {tab==='Relatórios' && role==='owner' && <section className="panel"><h2>Resumo financeiro</h2><div className="report-row"><span>Receita total</span><b>{money(totals.revenue)}</b></div><div className="report-row"><span>Combustível</span><b>{money(totals.fuel)}</b></div><div className="report-row"><span>Outras despesas</span><b>{money(totals.other)}</b></div><div className="report-row total"><span>Saldo estimado</span><b>{money(totals.revenue-totals.fuel-totals.other)}</b></div></section>}
      <footer>CI Táxi · Protótipo inicial · Valores em Kz</footer>
    </main>
  </div>;
}
function Stat({title,value,icon}) { return <div className="stat"><div className="stat-icon">{icon}</div><span>{title}</span><strong>{value}</strong></div> }
function Field({label,children}) { return <label className="field"><span>{label}</span>{children}</label> }
function DataTable({headers,rows}) { return rows.length?<div className="table-wrap"><table><thead><tr>{headers.map(h=><th key={h}>{h}</th>)}</tr></thead><tbody>{rows.map((r,i)=><tr key={i}>{r.map((c,j)=><td key={j}>{c}</td>)}</tr>)}</tbody></table></div>:<p className="empty">Ainda não existem registos.</p> }

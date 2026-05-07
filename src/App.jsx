import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  Boxes,
  Building2,
  CreditCard,
  Edit3,
  FileText,
  Home,
  LogIn,
  LogOut,
  Menu,
  Package,
  Plus,
  Receipt,
  RotateCcw,
  Save,
  Search,
  ShoppingCart,
  Trash2,
  UserRound,
  Users,
  Wallet,
  X,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const currency = (value) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(value) || 0);

const getToday = () => new Date().toISOString().slice(0, 10);
const today = getToday();
const chartColors = ["#2563eb", "#059669", "#f59e0b", "#dc2626", "#7c3aed", "#0891b2"];
const storageKey = "gestao-comercial-integrada-v2";

const initialProducts = [
  { id: 1, name: "Camiseta Básica", sku: "CAM-001", category: "Vestuário", description: "Camiseta algodão", cost: 18, price: 39.9, stock: 32, minStock: 10, status: "Ativo" },
  { id: 2, name: "Calça Jeans", sku: "CAL-002", category: "Vestuário", description: "Jeans azul", cost: 55, price: 119.9, stock: 8, minStock: 10, status: "Ativo" },
  { id: 3, name: "Tênis Casual", sku: "TEN-003", category: "Calçados", description: "Tênis urbano", cost: 80, price: 169.9, stock: 14, minStock: 5, status: "Ativo" },
  { id: 4, name: "Caderno Universitário", sku: "CAD-004", category: "Papelaria", description: "200 folhas", cost: 12, price: 24.9, stock: 45, minStock: 12, status: "Ativo" },
  { id: 5, name: "Caneta Azul", sku: "CAN-005", category: "Papelaria", description: "Caneta esferográfica", cost: 0.9, price: 2.5, stock: 120, minStock: 30, status: "Ativo" },
  { id: 6, name: "Refrigerante Lata", sku: "REF-006", category: "Bebidas", description: "350ml", cost: 3, price: 6.5, stock: 24, minStock: 12, status: "Ativo" },
  { id: 7, name: "Água Mineral", sku: "AGU-007", category: "Bebidas", description: "500ml", cost: 1.2, price: 3.5, stock: 60, minStock: 20, status: "Ativo" },
  { id: 8, name: "Salgado Assado", sku: "SAL-008", category: "Alimentos", description: "Unidade", cost: 3.2, price: 8, stock: 18, minStock: 8, status: "Ativo" },
  { id: 9, name: "Chocolate", sku: "CHO-009", category: "Alimentos", description: "Barra 90g", cost: 4, price: 8.9, stock: 7, minStock: 10, status: "Ativo" },
  { id: 10, name: "Carregador USB", sku: "USB-010", category: "Eletrônicos", description: "Carregador rápido", cost: 22, price: 49.9, stock: 11, minStock: 6, status: "Ativo" },
];

const initialCustomers = [
  { id: 1, name: "Ana Souza", document: "", phone: "(11) 99999-1001", email: "ana@email.com", address: "São Paulo - SP", birthday: "", notes: "Prefere PIX", status: "Recorrente" },
  { id: 2, name: "Carlos Lima", document: "", phone: "(11) 99999-1002", email: "carlos@email.com", address: "São Paulo - SP", birthday: "", notes: "Cliente de loja física", status: "Ativo" },
  { id: 3, name: "Fernanda Alves", document: "", phone: "(11) 99999-1003", email: "fernanda@email.com", address: "São Paulo - SP", birthday: "", notes: "Compra itens de papelaria", status: "Ativo" },
  { id: 4, name: "João Pereira", document: "", phone: "(11) 99999-1004", email: "joao@email.com", address: "São Paulo - SP", birthday: "", notes: "Cliente novo", status: "Novo" },
  { id: 5, name: "Marina Costa", document: "", phone: "(11) 99999-1005", email: "marina@email.com", address: "São Paulo - SP", birthday: "", notes: "Gosta de promoções", status: "Recorrente" },
];

const initialSales = [
  { id: 1001, date: today, customerId: 1, customerName: "Ana Souza", payment: "PIX", discount: 0, status: "Concluída", items: [{ productId: 1, name: "Camiseta Básica", qty: 2, price: 39.9 }, { productId: 9, name: "Chocolate", qty: 1, price: 8.9 }] },
  { id: 1002, date: today, customerId: 2, customerName: "Carlos Lima", payment: "Cartão de crédito", discount: 5, status: "Concluída", items: [{ productId: 10, name: "Carregador USB", qty: 1, price: 49.9 }] },
  { id: 1003, date: "2026-05-05", customerId: 3, customerName: "Fernanda Alves", payment: "Dinheiro", discount: 0, status: "Concluída", items: [{ productId: 4, name: "Caderno Universitário", qty: 3, price: 24.9 }, { productId: 5, name: "Caneta Azul", qty: 10, price: 2.5 }] },
];

const initialMovements = [
  { id: 1, date: today, productName: "Camiseta Básica", type: "Venda", qty: -2, user: "Administrador" },
  { id: 2, date: today, productName: "Chocolate", type: "Venda", qty: -1, user: "Administrador" },
  { id: 3, date: "2026-05-04", productName: "Água Mineral", type: "Entrada", qty: 30, user: "Administrador" },
];

const menu = [
  { key: "dashboard", label: "Dashboard", icon: Home },
  { key: "products", label: "Produtos", icon: Package },
  { key: "stock", label: "Estoque", icon: Boxes },
  { key: "pdv", label: "PDV", icon: ShoppingCart },
  { key: "customers", label: "Clientes", icon: Users },
  { key: "crm", label: "CRM", icon: UserRound },
  { key: "sales", label: "Vendas", icon: Receipt },
  { key: "reports", label: "Relatórios", icon: FileText },
];

function getNextId(items, fallback = 1) {
  if (!items.length) return fallback;
  return Math.max(...items.map((item) => Number(item.id) || 0)) + 1;
}

function getSaleTotal(sale) {
  const subtotal = sale.items.reduce((sum, item) => sum + Number(item.qty) * Number(item.price), 0);
  return Math.max(subtotal - (Number(sale.discount) || 0), 0);
}

function readStorage() {
  try {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

function StatCard({ title, value, icon: Icon, caption }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <h3 className="mt-1 text-2xl font-bold text-slate-900">{value}</h3>
          {caption && <p className="mt-1 text-xs text-slate-400">{caption}</p>}
        </div>
        <div className="rounded-2xl bg-blue-50 p-3 text-blue-700"><Icon size={22} /></div>
      </div>
    </motion.div>
  );
}

function SectionTitle({ title, subtitle, actions }) {
  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-slate-950">{title}</h1>
        <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
      </div>
      {actions}
    </div>
  );
}

function Badge({ children, tone = "blue" }) {
  const styles = {
    blue: "bg-blue-50 text-blue-700",
    green: "bg-emerald-50 text-emerald-700",
    red: "bg-red-50 text-red-700",
    amber: "bg-amber-50 text-amber-700",
    slate: "bg-slate-100 text-slate-700",
  };
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${styles[tone] || styles.blue}`}>{children}</span>;
}

const emptyProduct = { name: "", sku: "", category: "", description: "", cost: "", price: "", stock: "", minStock: "", status: "Ativo" };
const emptyCustomer = { name: "", document: "", phone: "", email: "", address: "", birthday: "", notes: "", status: "Novo" };

function App() {
  const saved = readStorage();
  const [logged, setLogged] = useState(false);
  const [active, setActive] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [products, setProducts] = useState(saved?.products || initialProducts);
  const [customers, setCustomers] = useState(saved?.customers || initialCustomers);
  const [sales, setSales] = useState(saved?.sales || initialSales);
  const [movements, setMovements] = useState(saved?.movements || initialMovements);
  const [cart, setCart] = useState([]);
  const [toast, setToast] = useState("");

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify({ products, customers, sales, movements }));
  }, [products, customers, sales, movements]);

  const showToast = (message) => {
    setToast(message);
    window.clearTimeout(showToast.timeoutId);
    showToast.timeoutId = window.setTimeout(() => setToast(""), 2800);
  };

  const totalToday = sales.filter((sale) => sale.date === today && sale.status === "Concluída").reduce((sum, sale) => sum + getSaleTotal(sale), 0);
  const totalMonth = sales.filter((sale) => sale.status === "Concluída").reduce((sum, sale) => sum + getSaleTotal(sale), 0);
  const lowStock = products.filter((product) => product.stock <= product.minStock && product.status === "Ativo");

  const productSales = useMemo(() => {
    const salesMap = {};
    sales.filter((sale) => sale.status === "Concluída").forEach((sale) => {
      sale.items.forEach((item) => {
        salesMap[item.name] = (salesMap[item.name] || 0) + Number(item.qty);
      });
    });
    return Object.entries(salesMap).map(([name, qty]) => ({ name, qty })).sort((a, b) => b.qty - a.qty).slice(0, 6);
  }, [sales]);

  const paymentData = useMemo(() => {
    const paymentMap = {};
    sales.filter((sale) => sale.status === "Concluída").forEach((sale) => {
      paymentMap[sale.payment] = (paymentMap[sale.payment] || 0) + getSaleTotal(sale);
    });
    return Object.entries(paymentMap).map(([name, value]) => ({ name, value }));
  }, [sales]);

  const salesByDay = useMemo(() => {
    const dayMap = {};
    sales.filter((sale) => sale.status === "Concluída").forEach((sale) => {
      dayMap[sale.date.slice(5)] = (dayMap[sale.date.slice(5)] || 0) + getSaleTotal(sale);
    });
    return Object.entries(dayMap).map(([date, total]) => ({ date, total })).sort((a, b) => a.date.localeCompare(b.date));
  }, [sales]);

  const resetData = () => {
    localStorage.removeItem(storageKey);
    setProducts(initialProducts);
    setCustomers(initialCustomers);
    setSales(initialSales);
    setMovements(initialMovements);
    setCart([]);
    showToast("Dados restaurados para o estado inicial.");
  };

  const saveProduct = (form) => {
    if (!form.name || !form.price || !form.stock) {
      showToast("Preencha nome, preço de venda e estoque.");
      return false;
    }
    const product = {
      ...form,
      id: form.id || getNextId(products),
      sku: form.sku || `PRO-${Date.now().toString().slice(-5)}`,
      cost: Number(form.cost) || 0,
      price: Number(form.price) || 0,
      stock: Number(form.stock) || 0,
      minStock: Number(form.minStock) || 0,
      category: form.category || "Geral",
      description: form.description || "Sem descrição",
      status: form.status || "Ativo",
    };
    setProducts((current) => form.id ? current.map((item) => item.id === form.id ? product : item) : [...current, product]);
    showToast(form.id ? "Produto atualizado com sucesso." : "Produto cadastrado com sucesso.");
    return true;
  };

  const deleteProduct = (productId) => {
    const productInCart = cart.some((item) => item.productId === productId);
    const productInSales = sales.some((sale) => sale.items.some((item) => item.productId === productId));
    if (productInCart || productInSales) {
      setProducts((current) => current.map((product) => product.id === productId ? { ...product, status: "Inativo" } : product));
      showToast("Produto vinculado a vendas foi marcado como inativo.");
      return;
    }
    setProducts((current) => current.filter((product) => product.id !== productId));
    showToast("Produto removido com sucesso.");
  };

  const saveCustomer = (form) => {
    if (!form.name || !form.phone) {
      showToast("Preencha nome e telefone do cliente.");
      return false;
    }
    const customer = { ...form, id: form.id || getNextId(customers), status: form.status || "Novo" };
    setCustomers((current) => form.id ? current.map((item) => item.id === form.id ? customer : item) : [...current, customer]);
    showToast(form.id ? "Cliente atualizado com sucesso." : "Cliente cadastrado com sucesso.");
    return true;
  };

  const deleteCustomer = (customerId) => {
    const customerHasSales = sales.some((sale) => sale.customerId === customerId);
    if (customerHasSales) {
      setCustomers((current) => current.map((customer) => customer.id === customerId ? { ...customer, status: "Inativo" } : customer));
      showToast("Cliente vinculado a vendas foi marcado como inativo.");
      return;
    }
    setCustomers((current) => current.filter((customer) => customer.id !== customerId));
    showToast("Cliente removido com sucesso.");
  };

  const addToCart = (product) => {
    if (product.status !== "Ativo") return showToast("Produto inativo não pode ser vendido.");
    if (product.stock <= 0) return showToast("Estoque insuficiente para este produto.");
    const existing = cart.find((item) => item.productId === product.id);
    if (existing && existing.qty + 1 > product.stock) return showToast("Quantidade maior que o estoque disponível.");
    setCart((current) => existing
      ? current.map((item) => item.productId === product.id ? { ...item, qty: item.qty + 1 } : item)
      : [...current, { productId: product.id, name: product.name, qty: 1, price: product.price }]
    );
  };

  const updateCartQty = (productId, qty) => {
    const product = products.find((item) => item.id === productId);
    const safeQty = Math.max(1, Number(qty) || 1);
    if (product && safeQty > product.stock) return showToast("Quantidade maior que o estoque disponível.");
    setCart((current) => current.map((item) => item.productId === productId ? { ...item, qty: safeQty } : item));
  };

  const finishSale = ({ customerId, payment, discount }) => {
    if (!cart.length) return showToast("Adicione produtos ao carrinho antes de finalizar.");
    const hasStockError = cart.some((item) => {
      const product = products.find((currentProduct) => currentProduct.id === item.productId);
      return !product || product.status !== "Ativo" || product.stock < item.qty;
    });
    if (hasStockError) return showToast("Existe produto inativo ou com estoque insuficiente no carrinho.");

    const customer = customers.find((item) => item.id === Number(customerId));
    const id = getNextId(sales, 1001);
    const newSale = {
      id,
      date: today,
      customerId: customer?.id || null,
      customerName: customer?.name || "Cliente não informado",
      payment: payment || "PIX",
      discount: Number(discount) || 0,
      status: "Concluída",
      items: cart.map((item) => ({ ...item })),
    };
    const newMovements = cart.map((item, index) => ({ id: getNextId(movements) + index, date: today, productName: item.name, type: "Venda", qty: -item.qty, user: "Administrador" }));
    setSales((current) => [newSale, ...current]);
    setProducts((current) => current.map((product) => {
      const sold = cart.find((item) => item.productId === product.id);
      return sold ? { ...product, stock: product.stock - sold.qty } : product;
    }));
    setMovements((current) => [...newMovements, ...current]);
    setCart([]);
    showToast("Venda finalizada e estoque atualizado automaticamente.");
  };

  const cancelSale = (sale) => {
    if (sale.status === "Cancelada") return;
    const newMovements = sale.items.map((item, index) => ({ id: getNextId(movements) + index, date: today, productName: item.name, type: "Cancelamento", qty: item.qty, user: "Administrador" }));
    setSales((current) => current.map((currentSale) => currentSale.id === sale.id ? { ...currentSale, status: "Cancelada" } : currentSale));
    setProducts((current) => current.map((product) => {
      const item = sale.items.find((saleItem) => saleItem.productId === product.id);
      return item ? { ...product, stock: product.stock + item.qty } : product;
    }));
    setMovements((current) => [...newMovements, ...current]);
    showToast("Venda cancelada e itens devolvidos ao estoque.");
  };

  const addStock = (product, amount = 5) => {
    const qty = Number(amount) || 0;
    if (qty <= 0) return showToast("Informe uma quantidade válida.");
    const movement = { id: getNextId(movements), date: today, productName: product.name, type: "Entrada", qty, user: "Administrador" };
    setProducts((current) => current.map((currentProduct) => currentProduct.id === product.id ? { ...currentProduct, stock: currentProduct.stock + qty } : currentProduct));
    setMovements((current) => [movement, ...current]);
    showToast(`Entrada de ${qty} unidades registrada.`);
  };

  const cartTotal = useMemo(() => cart.reduce((sum, item) => sum + Number(item.qty) * Number(item.price), 0), [cart]);
  const handleNavigate = (key) => { setActive(key); setSidebarOpen(false); };

  const renderContent = () => {
    if (active === "dashboard") return <Dashboard totalToday={totalToday} totalMonth={totalMonth} products={products} customers={customers} lowStock={lowStock} salesByDay={salesByDay} productSales={productSales} paymentData={paymentData} resetData={resetData} />;
    if (active === "products") return <Products products={products} saveProduct={saveProduct} deleteProduct={deleteProduct} />;
    if (active === "stock") return <Stock products={products} movements={movements} addStock={addStock} />;
    if (active === "pdv") return <PDV products={products} customers={customers} cart={cart} addToCart={addToCart} updateCartQty={updateCartQty} removeFromCart={(id) => setCart((current) => current.filter((item) => item.productId !== id))} finishSale={finishSale} cartTotal={cartTotal} />;
    if (active === "customers") return <Customers customers={customers} saveCustomer={saveCustomer} deleteCustomer={deleteCustomer} sales={sales} />;
    if (active === "crm") return <CRM customers={customers} sales={sales} />;
    if (active === "sales") return <Sales sales={sales} cancelSale={cancelSale} />;
    if (active === "reports") return <Reports sales={sales} products={products} customers={customers} productSales={productSales} paymentData={paymentData} salesByDay={salesByDay} />;
    return null;
  };

  if (!logged) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-800 to-emerald-700 flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl grid md:grid-cols-2">
          <div className="p-10 bg-slate-950 text-white flex flex-col justify-between min-h-[520px]">
            <div>
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-emerald-500 p-3"><Building2 /></div>
                <div>
                  <p className="text-sm text-blue-100">Projeto Integrador UNIVESP</p>
                  <h1 className="text-2xl font-bold">Gestão Comercial Integrada</h1>
                </div>
              </div>
              <p className="mt-8 text-lg leading-relaxed text-slate-200">Sistema web com PDV, estoque, clientes, CRM e relatórios para apoiar pequenos negócios na organização comercial.</p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-2xl bg-white/10 p-4">Cadastros reais</div>
              <div className="rounded-2xl bg-white/10 p-4">Persistência local</div>
              <div className="rounded-2xl bg-white/10 p-4">PDV completo</div>
              <div className="rounded-2xl bg-white/10 p-4">Relatórios</div>
            </div>
          </div>
          <div className="p-10 flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-slate-950">Entrar no sistema</h2>
            <p className="mt-2 text-slate-500">Acesso administrativo para demonstração funcional.</p>
            <div className="mt-8 space-y-4">
              <Input label="E-mail" defaultValue="admin@demo.com" />
              <Input label="Senha" type="password" defaultValue="123456" />
              <button onClick={() => setLogged(true)} className="w-full rounded-2xl bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800 flex items-center justify-center gap-2"><LogIn size={18} /> Entrar</button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {toast && <div className="fixed right-6 top-6 z-50 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-medium text-white shadow-xl">{toast}</div>}
      <Sidebar active={active} onNavigate={handleNavigate} onLogout={() => setLogged(false)} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="lg:ml-72 p-4 md:p-8">
        <div className="mb-6 rounded-3xl bg-white p-4 shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden rounded-2xl border border-slate-200 p-3 text-slate-700"><Menu size={20} /></button>
            <div>
              <p className="text-sm text-slate-500">Projeto Integrador — UNIVESP</p>
              <h2 className="font-bold text-slate-950">Painel administrativo para pequenos negócios</h2>
            </div>
          </div>
          <div className="flex items-center gap-3"><Badge tone="green">Administrador</Badge><Badge tone="blue">Dados salvos localmente</Badge></div>
        </div>
        {renderContent()}
      </main>
    </div>
  );
}

function Input({ label, value, onChange, type = "text", defaultValue, placeholder }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <input type={type} value={value} onChange={onChange} defaultValue={defaultValue} placeholder={placeholder} className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500" />
    </label>
  );
}

function Select({ label, value, onChange, children }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <select value={value} onChange={onChange} className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 bg-white">{children}</select>
    </label>
  );
}

function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-3xl rounded-3xl bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="mb-5 flex items-center justify-between"><h2 className="text-xl font-bold text-slate-950">{title}</h2><button onClick={onClose} className="rounded-xl p-2 hover:bg-slate-100"><X size={20} /></button></div>
        {children}
      </motion.div>
    </div>
  );
}

function Sidebar({ active, onNavigate, onLogout, open, onClose }) {
  return (
    <>
      {open && <button aria-label="Fechar menu" onClick={onClose} className="fixed inset-0 z-30 bg-slate-950/40 lg:hidden" />}
      <aside className={`fixed left-0 top-0 z-40 h-full w-72 bg-slate-950 text-white p-5 flex flex-col transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
        <div className="flex items-center justify-between border-b border-white/10 pb-5">
          <div className="flex items-center gap-3"><div className="rounded-2xl bg-emerald-500 p-3"><Building2 size={22} /></div><div><p className="text-xs text-blue-100">Sistema Web</p><h2 className="font-bold leading-tight">Gestão Comercial Integrada</h2></div></div>
          <button onClick={onClose} className="lg:hidden rounded-xl p-2 hover:bg-white/10"><X size={18} /></button>
        </div>
        <nav className="mt-6 space-y-2 flex-1">
          {menu.map((item) => { const Icon = item.icon; return <button key={item.key} onClick={() => onNavigate(item.key)} className={`w-full flex items-center gap-3 rounded-2xl px-4 py-3 text-left transition ${active === item.key ? "bg-blue-600 text-white" : "text-slate-300 hover:bg-white/10"}`}><Icon size={18} /> {item.label}</button>; })}
        </nav>
        <button onClick={onLogout} className="flex items-center gap-3 rounded-2xl px-4 py-3 text-slate-300 hover:bg-white/10"><LogOut size={18} /> Sair</button>
      </aside>
    </>
  );
}

function Dashboard({ totalToday, totalMonth, products, customers, lowStock, salesByDay, productSales, paymentData, resetData }) {
  return (
    <div>
      <SectionTitle title="Dashboard" subtitle="Visão geral das vendas, estoque, clientes e indicadores comerciais." actions={<button onClick={resetData} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"><RotateCcw size={16} /> Restaurar dados</button>} />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Vendas do dia" value={currency(totalToday)} icon={Wallet} caption="Atualizado em tempo real" />
        <StatCard title="Vendas do mês" value={currency(totalMonth)} icon={CreditCard} caption="Total de vendas concluídas" />
        <StatCard title="Produtos cadastrados" value={products.length} icon={Package} caption="Produtos ativos e inativos" />
        <StatCard title="Clientes cadastrados" value={customers.length} icon={Users} caption="Base de relacionamento" />
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Baixo estoque" value={lowStock.length} icon={Boxes} caption="Itens abaixo do mínimo" />
        <StatCard title="Valor em estoque" value={currency(products.reduce((sum, product) => sum + product.stock * product.cost, 0))} icon={BarChart3} caption="Custo estimado" />
      </div>
      <div className="mt-6 grid gap-5 xl:grid-cols-2">
        <ChartCard title="Vendas por dia"><ResponsiveContainer width="100%" height={260}><BarChart data={salesByDay}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="date" /><YAxis /><Tooltip formatter={(value) => currency(value)} /><Bar dataKey="total" fill="#2563eb" radius={[10, 10, 0, 0]} /></BarChart></ResponsiveContainer></ChartCard>
        <ChartCard title="Produtos mais vendidos"><ResponsiveContainer width="100%" height={260}><BarChart data={productSales}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis /><Tooltip /><Bar dataKey="qty" fill="#059669" radius={[10, 10, 0, 0]} /></BarChart></ResponsiveContainer></ChartCard>
      </div>
      <div className="mt-6 grid gap-5 xl:grid-cols-2">
        <ChartCard title="Formas de pagamento"><ResponsiveContainer width="100%" height={260}><PieChart><Pie data={paymentData} dataKey="value" nameKey="name" outerRadius={90} label>{paymentData.map((entry, index) => <Cell key={entry.name} fill={chartColors[index % chartColors.length]} />)}</Pie><Tooltip formatter={(value) => currency(value)} /></PieChart></ResponsiveContainer></ChartCard>
        <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100"><h3 className="font-bold text-slate-950">Alertas de estoque</h3><div className="mt-4 space-y-3">{lowStock.length === 0 && <p className="text-sm text-slate-400">Nenhum produto abaixo do estoque mínimo.</p>}{lowStock.map((product) => <div key={product.id} className="flex items-center justify-between rounded-2xl bg-amber-50 p-4"><span>{product.name}</span><Badge tone="amber">{product.stock} un.</Badge></div>)}</div></div>
      </div>
    </div>
  );
}

function ChartCard({ title, children }) {
  return <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100"><h3 className="mb-4 font-bold text-slate-950">{title}</h3>{children}</div>;
}

function Products({ products, saveProduct, deleteProduct }) {
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(emptyProduct);
  const filtered = products.filter((product) => `${product.name} ${product.sku} ${product.category}`.toLowerCase().includes(query.toLowerCase()));
  const openForm = (product) => { setForm(product ? { ...product } : emptyProduct); setModal(product ? "edit" : "new"); };
  const submit = () => { if (saveProduct(form)) setModal(null); };
  return (
    <div>
      <SectionTitle title="Produtos" subtitle="Cadastro real, edição, pesquisa e alerta de estoque mínimo." />
      <Toolbar query={query} setQuery={setQuery} placeholder="Pesquisar produto, SKU ou categoria..." button="Novo produto" onClick={() => openForm()} />
      <DataTable headers={["Produto", "SKU", "Categoria", "Preço", "Estoque", "Status", "Ações"]}>{filtered.map((product) => <tr key={product.id} className="border-t border-slate-100"><td className="p-4"><b>{product.name}</b><p className="text-xs text-slate-500">{product.description}</p></td><td className="p-4">{product.sku}</td><td className="p-4">{product.category}</td><td className="p-4">{currency(product.price)}</td><td className="p-4">{product.stock <= product.minStock ? <Badge tone="amber">{product.stock} baixo</Badge> : `${product.stock} un.`}</td><td className="p-4"><Badge tone={product.status === "Ativo" ? "green" : "slate"}>{product.status}</Badge></td><td className="p-4"><div className="flex gap-3"><button onClick={() => openForm(product)} className="text-blue-700"><Edit3 size={18} /></button><button onClick={() => deleteProduct(product.id)} className="text-red-600"><Trash2 size={18} /></button></div></td></tr>)}</DataTable>
      {modal && <Modal title={modal === "edit" ? "Editar produto" : "Cadastrar produto"} onClose={() => setModal(null)}><ProductForm form={form} setForm={setForm} onSubmit={submit} /></Modal>}
    </div>
  );
}

function ProductForm({ form, setForm, onSubmit }) {
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  return <div className="grid gap-4 md:grid-cols-2"><Input label="Nome do produto" value={form.name} onChange={(e) => update("name", e.target.value)} /><Input label="SKU/Código" value={form.sku} onChange={(e) => update("sku", e.target.value)} /><Input label="Categoria" value={form.category} onChange={(e) => update("category", e.target.value)} /><Input label="Descrição" value={form.description} onChange={(e) => update("description", e.target.value)} /><Input label="Preço de custo" type="number" value={form.cost} onChange={(e) => update("cost", e.target.value)} /><Input label="Preço de venda" type="number" value={form.price} onChange={(e) => update("price", e.target.value)} /><Input label="Estoque atual" type="number" value={form.stock} onChange={(e) => update("stock", e.target.value)} /><Input label="Estoque mínimo" type="number" value={form.minStock} onChange={(e) => update("minStock", e.target.value)} /><Select label="Status" value={form.status} onChange={(e) => update("status", e.target.value)}><option>Ativo</option><option>Inativo</option></Select><div className="md:col-span-2 flex justify-end"><button onClick={onSubmit} className="rounded-2xl bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800 flex items-center gap-2"><Save size={18} /> Salvar produto</button></div></div>;
}

function Stock({ products, movements, addStock }) {
  const [amounts, setAmounts] = useState({});
  return <div><SectionTitle title="Estoque" subtitle="Controle de entrada, movimentações e produtos com baixo estoque." /><div className="grid gap-5 xl:grid-cols-2"><div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100"><h3 className="font-bold mb-4">Produtos em estoque</h3><div className="space-y-3">{products.map((product) => <div key={product.id} className="rounded-2xl border border-slate-100 p-4"><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><b>{product.name}</b><p className="text-xs text-slate-500">Mínimo: {product.minStock} un. • {product.status}</p></div><Badge tone={product.stock <= product.minStock ? "amber" : "green"}>{product.stock} un.</Badge></div><div className="mt-3 flex gap-2"><input type="number" min="1" value={amounts[product.id] || 5} onChange={(e) => setAmounts((current) => ({ ...current, [product.id]: e.target.value }))} className="w-28 rounded-xl border border-slate-200 px-3 py-2" /><button onClick={() => addStock(product, amounts[product.id] || 5)} className="rounded-xl bg-blue-600 px-3 py-2 text-sm text-white">Registrar entrada</button></div></div>)}</div></div><div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100"><h3 className="font-bold mb-4">Histórico de movimentações</h3><div className="space-y-3">{movements.map((movement) => <div key={movement.id} className="rounded-2xl bg-slate-50 p-4"><div className="flex justify-between gap-3"><b>{movement.productName}</b><Badge tone={movement.qty < 0 ? "red" : "green"}>{movement.qty > 0 ? "+" : ""}{movement.qty}</Badge></div><p className="text-xs text-slate-500">{movement.type} • {movement.date} • {movement.user}</p></div>)}</div></div></div></div>;
}

function PDV({ products, customers, cart, addToCart, updateCartQty, removeFromCart, finishSale, cartTotal }) {
  const [query, setQuery] = useState("");
  const [customerId, setCustomerId] = useState(customers[0]?.id || "");
  const [payment, setPayment] = useState("PIX");
  const [discount, setDiscount] = useState(0);
  const filtered = products.filter((product) => product.status === "Ativo" && `${product.name} ${product.sku}`.toLowerCase().includes(query.toLowerCase()));
  const finalTotal = Math.max(cartTotal - (Number(discount) || 0), 0);
  return <div><SectionTitle title="PDV / Frente de Caixa" subtitle="Venda com cliente, desconto, forma de pagamento e baixa automática no estoque." /><div className="grid gap-5 xl:grid-cols-[1.4fr_0.8fr]"><div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100"><div className="relative mb-4"><Search className="absolute left-4 top-3.5 text-slate-400" size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar produto por nome ou SKU..." className="w-full rounded-2xl border border-slate-200 py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-blue-500" /></div><div className="grid gap-3 md:grid-cols-2">{filtered.map((product) => <button key={product.id} onClick={() => addToCart(product)} className="text-left rounded-2xl border border-slate-100 p-4 hover:border-blue-300 hover:bg-blue-50"><div className="flex justify-between gap-3"><b>{product.name}</b><span className="font-bold text-blue-700">{currency(product.price)}</span></div><p className="text-xs text-slate-500">SKU {product.sku} • estoque {product.stock}</p></button>)}</div></div><div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100"><h3 className="font-bold flex items-center gap-2"><ShoppingCart size={18} /> Carrinho</h3><div className="mt-4 space-y-3 min-h-[170px]">{cart.length === 0 && <p className="text-sm text-slate-400">Nenhum produto adicionado.</p>}{cart.map((item) => <div key={item.productId} className="rounded-2xl bg-slate-50 p-4"><div className="flex justify-between gap-3"><b>{item.name}</b><button onClick={() => removeFromCart(item.productId)} className="text-red-600"><Trash2 size={16} /></button></div><div className="mt-2 flex items-center justify-between gap-3"><input type="number" min="1" value={item.qty} onChange={(e) => updateCartQty(item.productId, e.target.value)} className="w-20 rounded-xl border border-slate-200 px-3 py-2" /><p className="text-sm text-slate-500">{currency(item.qty * item.price)}</p></div></div>)}</div><div className="mt-5 border-t border-slate-100 pt-5 space-y-3"><Select label="Cliente" value={customerId} onChange={(e) => setCustomerId(e.target.value)}><option value="">Cliente não informado</option>{customers.filter((c) => c.status !== "Inativo").map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</Select><Select label="Forma de pagamento" value={payment} onChange={(e) => setPayment(e.target.value)}><option>PIX</option><option>Dinheiro</option><option>Cartão de débito</option><option>Cartão de crédito</option><option>Outros</option></Select><Input label="Desconto" type="number" value={discount} onChange={(e) => setDiscount(e.target.value)} /><div className="flex justify-between text-sm"><span>Subtotal</span><b>{currency(cartTotal)}</b></div><div className="flex justify-between text-lg font-bold"><span>Total</span><span>{currency(finalTotal)}</span></div><button onClick={() => finishSale({ customerId, payment, discount })} className="w-full rounded-2xl bg-emerald-600 px-4 py-3 font-semibold text-white hover:bg-emerald-700">Finalizar venda</button></div></div></div></div>;
}

function Customers({ customers, saveCustomer, deleteCustomer, sales }) {
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(emptyCustomer);
  const filtered = customers.filter((customer) => `${customer.name} ${customer.phone} ${customer.email}`.toLowerCase().includes(query.toLowerCase()));
  const openForm = (customer) => { setForm(customer ? { ...customer } : emptyCustomer); setModal(customer ? "edit" : "new"); };
  const submit = () => { if (saveCustomer(form)) setModal(null); };
  return <div><SectionTitle title="Clientes" subtitle="Cadastro real, pesquisa e histórico de relacionamento do cliente." /><Toolbar query={query} setQuery={setQuery} placeholder="Pesquisar cliente..." button="Novo cliente" onClick={() => openForm()} /><DataTable headers={["Cliente", "Contato", "Endereço", "Status", "Compras", "Ações"]}>{filtered.map((customer) => <tr key={customer.id} className="border-t border-slate-100"><td className="p-4"><b>{customer.name}</b><p className="text-xs text-slate-500">{customer.email}</p></td><td className="p-4">{customer.phone}</td><td className="p-4">{customer.address}</td><td className="p-4"><Badge tone={customer.status === "Inativo" ? "slate" : "blue"}>{customer.status}</Badge></td><td className="p-4">{sales.filter((sale) => sale.customerId === customer.id).length}</td><td className="p-4"><div className="flex gap-3"><button onClick={() => openForm(customer)} className="text-blue-700"><Edit3 size={18} /></button><button onClick={() => deleteCustomer(customer.id)} className="text-red-600"><Trash2 size={18} /></button></div></td></tr>)}</DataTable>{modal && <Modal title={modal === "edit" ? "Editar cliente" : "Cadastrar cliente"} onClose={() => setModal(null)}><CustomerForm form={form} setForm={setForm} onSubmit={submit} /></Modal>}</div>;
}

function CustomerForm({ form, setForm, onSubmit }) {
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  return <div className="grid gap-4 md:grid-cols-2"><Input label="Nome completo" value={form.name} onChange={(e) => update("name", e.target.value)} /><Input label="CPF/CNPJ" value={form.document} onChange={(e) => update("document", e.target.value)} /><Input label="Telefone" value={form.phone} onChange={(e) => update("phone", e.target.value)} /><Input label="E-mail" value={form.email} onChange={(e) => update("email", e.target.value)} /><Input label="Endereço" value={form.address} onChange={(e) => update("address", e.target.value)} /><Input label="Data de nascimento" type="date" value={form.birthday} onChange={(e) => update("birthday", e.target.value)} /><Select label="Status" value={form.status} onChange={(e) => update("status", e.target.value)}><option>Novo</option><option>Ativo</option><option>Recorrente</option><option>Inativo</option></Select><Input label="Observações" value={form.notes} onChange={(e) => update("notes", e.target.value)} /><div className="md:col-span-2 flex justify-end"><button onClick={onSubmit} className="rounded-2xl bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800 flex items-center gap-2"><Save size={18} /> Salvar cliente</button></div></div>;
}

function CRM({ customers, sales }) {
  return <div><SectionTitle title="CRM" subtitle="Análise simples do relacionamento, frequência e oportunidades com clientes." /><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{customers.map((customer) => { const customerSales = sales.filter((sale) => sale.customerId === customer.id && sale.status === "Concluída"); const total = customerSales.reduce((sum, sale) => sum + getSaleTotal(sale), 0); return <div key={customer.id} className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100"><div className="flex items-start justify-between gap-3"><div><h3 className="font-bold">{customer.name}</h3><p className="text-sm text-slate-500">{customer.phone}</p></div><Badge tone={customer.status === "Recorrente" ? "green" : customer.status === "Inativo" ? "slate" : "blue"}>{customer.status}</Badge></div><div className="mt-5 grid grid-cols-2 gap-3"><div className="rounded-2xl bg-slate-50 p-3"><p className="text-xs text-slate-500">Compras</p><b>{customerSales.length}</b></div><div className="rounded-2xl bg-slate-50 p-3"><p className="text-xs text-slate-500">Total</p><b>{currency(total)}</b></div></div><p className="mt-4 text-sm text-slate-500">{customer.notes || "Sem observações."}</p>{customerSales.length === 0 ? <p className="mt-3 text-sm text-amber-600">Oportunidade: cliente sem compra recente.</p> : <p className="mt-3 text-sm text-emerald-600">Cliente com histórico de compra.</p>}</div>; })}</div></div>;
}

function Sales({ sales, cancelSale }) {
  return <div><SectionTitle title="Histórico de Vendas" subtitle="Consulta de vendas, detalhes, pagamento e cancelamento com devolução ao estoque." /><DataTable headers={["Venda", "Data", "Cliente", "Itens", "Pagamento", "Desconto", "Total", "Status", "Ações"]}>{sales.map((sale) => <tr key={sale.id} className="border-t border-slate-100"><td className="p-4 font-bold">#{sale.id}</td><td className="p-4">{sale.date}</td><td className="p-4">{sale.customerName || "Não informado"}</td><td className="p-4 text-sm">{sale.items.map((item) => `${item.qty}x ${item.name}`).join(", ")}</td><td className="p-4">{sale.payment}</td><td className="p-4">{currency(sale.discount)}</td><td className="p-4 font-bold">{currency(getSaleTotal(sale))}</td><td className="p-4"><Badge tone={sale.status === "Concluída" ? "green" : "red"}>{sale.status}</Badge></td><td className="p-4"><button disabled={sale.status === "Cancelada"} onClick={() => cancelSale(sale)} className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700 disabled:opacity-40">Cancelar</button></td></tr>)}</DataTable></div>;
}

function Reports({ sales, products, customers, productSales, paymentData, salesByDay }) {
  const total = sales.filter((sale) => sale.status === "Concluída").reduce((sum, sale) => sum + getSaleTotal(sale), 0);
  return <div><SectionTitle title="Relatórios" subtitle="Indicadores gerenciais para apoio à tomada de decisão." /><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"><StatCard title="Receita total" value={currency(total)} icon={Wallet} /><StatCard title="Vendas concluídas" value={sales.filter((sale) => sale.status === "Concluída").length} icon={Receipt} /><StatCard title="Clientes" value={customers.length} icon={Users} /><StatCard title="Produtos baixo estoque" value={products.filter((product) => product.stock <= product.minStock).length} icon={Boxes} /></div><div className="mt-6 grid gap-5 xl:grid-cols-2"><ChartCard title="Vendas por período"><ResponsiveContainer width="100%" height={270}><BarChart data={salesByDay}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="date" /><YAxis /><Tooltip formatter={(value) => currency(value)} /><Bar dataKey="total" fill="#2563eb" radius={[10, 10, 0, 0]} /></BarChart></ResponsiveContainer></ChartCard><ChartCard title="Produtos mais vendidos"><ResponsiveContainer width="100%" height={270}><BarChart data={productSales}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis /><Tooltip /><Bar dataKey="qty" fill="#059669" radius={[10, 10, 0, 0]} /></BarChart></ResponsiveContainer></ChartCard></div><div className="mt-6 rounded-3xl bg-white p-6 shadow-sm border border-slate-100"><h3 className="font-bold mb-4">Vendas por forma de pagamento</h3><div className="grid gap-3 md:grid-cols-3">{paymentData.map((payment) => <div key={payment.name} className="rounded-2xl bg-slate-50 p-4"><p className="text-sm text-slate-500">{payment.name}</p><b>{currency(payment.value)}</b></div>)}{paymentData.length === 0 && <p className="text-sm text-slate-400">Nenhuma venda concluída no período demonstrativo.</p>}</div></div></div>;
}

function Toolbar({ query, setQuery, placeholder, button, onClick }) {
  return <div className="mb-5 flex flex-col md:flex-row gap-3 md:items-center md:justify-between"><div className="relative flex-1"><Search className="absolute left-4 top-3.5 text-slate-400" size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={placeholder} className="w-full rounded-2xl border border-slate-200 py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-blue-500" /></div><button onClick={onClick} className="rounded-2xl bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800 flex items-center justify-center gap-2"><Plus size={18} /> {button}</button></div>;
}

function DataTable({ headers, children }) {
  return <div className="overflow-hidden rounded-3xl bg-white shadow-sm border border-slate-100"><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-slate-500"><tr>{headers.map((header) => <th key={header} className="p-4 font-semibold whitespace-nowrap">{header}</th>)}</tr></thead><tbody>{children}</tbody></table></div></div>;
}

export default App;

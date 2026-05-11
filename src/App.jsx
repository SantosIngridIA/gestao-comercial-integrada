import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  Boxes,
  Building2,
  CreditCard,
  Download,
  Edit3,
  Eye,
  FileText,
  Home,
  LogIn,
  LogOut,
  Menu,
  Package,
  Plus,
  Receipt,
  Printer,
  RotateCcw,
  Save,
  Search,
  ShoppingCart,
  Trash2,
  Truck,
  Upload,
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
import { supabase } from "./supabaseClient";

const currency = (value) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(value) || 0);

const today = new Date().toISOString().slice(0, 10);
const storageKey = "gestao-comercial-integrada-estavel";
const chartColors = ["#2563eb", "#059669", "#f59e0b", "#dc2626", "#7c3aed", "#0891b2"];

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

const initialSuppliers = [
  { id: 1, name: "Distribuidora São Paulo", document: "12.345.678/0001-90", phone: "(11) 3333-1000", email: "contato@distribuidorasp.com", category: "Atacado", suppliedItems: "Bebidas, alimentos e descartáveis", address: "São Paulo - SP", notes: "Fornecedor principal para reposição de estoque", status: "Ativo" },
  { id: 2, name: "Tech Import Soluções", document: "98.765.432/0001-10", phone: "(11) 4444-2000", email: "vendas@techimport.com", category: "Eletrônicos", suppliedItems: "Carregadores, cabos e acessórios", address: "São Paulo - SP", notes: "Consultar prazo de entrega antes de comprar", status: "Ativo" },
];

const initialSales = [
  { id: 1001, date: today, customerId: 1, customerName: "Ana Souza", payment: "PIX", discount: 0, amountPaid: 0, change: 0, status: "Concluída", items: [{ productId: 1, name: "Camiseta Básica", qty: 2, price: 39.9 }, { productId: 9, name: "Chocolate", qty: 1, price: 8.9 }] },
  { id: 1002, date: today, customerId: 2, customerName: "Carlos Lima", payment: "Dinheiro", discount: 5, amountPaid: 60, change: 15.1, status: "Concluída", items: [{ productId: 10, name: "Carregador USB", qty: 1, price: 49.9 }] },
];

const initialMovements = [
  { id: 1, date: today, productName: "Camiseta Básica", type: "Venda", qty: -2, user: "Administrador" },
  { id: 2, date: today, productName: "Chocolate", type: "Venda", qty: -1, user: "Administrador" },
  { id: 3, date: today, productName: "Água Mineral", type: "Entrada", qty: 30, user: "Administrador" },
];

const menu = [
  { key: "dashboard", label: "Dashboard Gerencial", icon: Home },
  { key: "products", label: "Produtos", icon: Package },
  { key: "stock", label: "Estoque", icon: Boxes },
  { key: "pdv", label: "PDV", icon: ShoppingCart },
  { key: "customers", label: "Clientes", icon: Users },
  { key: "suppliers", label: "Fornecedores", icon: Truck },
  { key: "settings", label: "Configurações", icon: Building2 },
  { key: "crm", label: "CRM", icon: UserRound },
  { key: "sales", label: "Vendas", icon: Receipt },
];

const emptyProduct = { name: "", sku: "", category: "", description: "", cost: "", price: "", stock: "", minStock: "", status: "Ativo" };
const emptyCustomer = { name: "", document: "", phone: "", email: "", address: "", birthday: "", notes: "", status: "Novo" };
const emptySupplier = { name: "", document: "", phone: "", email: "", category: "", suppliedItems: "", address: "", notes: "", status: "Ativo" };
const defaultCompanySettings = {
  companyName: "Gestão Comercial Integrada",
  fantasyName: "Sistema Web Comercial",
  document: "00.000.000/0001-00",
  phone: "(11) 99999-9999",
  email: "contato@empresa.com",
  address: "São Paulo - SP",
  cityState: "São Paulo / SP",
  receiptFooter: "Obrigado pela preferência!",
};

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

function produtoDoBanco(produto) {
  return {
    id: produto.id,
    name: produto.nome,
    sku: produto.sku || "",
    category: produto.categoria || "Geral",
    description: produto.descricao || "Sem descrição",
    cost: Number(produto.preco_custo) || 0,
    price: Number(produto.preco_venda) || 0,
    stock: Number(produto.estoque) || 0,
    minStock: Number(produto.estoque_minimo) || 0,
    status: produto.status || "Ativo",
  };
}

function produtoParaBanco(produto) {
  return {
    nome: produto.name,
    sku: produto.sku,
    categoria: produto.category,
    descricao: produto.description,
    preco_custo: Number(produto.cost) || 0,
    preco_venda: Number(produto.price) || 0,
    estoque: Number(produto.stock) || 0,
    estoque_minimo: Number(produto.minStock) || 0,
    status: produto.status || "Ativo",
  };
}

function clienteDoBanco(cliente) {
  return {
    id: cliente.id,
    name: cliente.nome,
    document: cliente.documento || "",
    phone: cliente.telefone || "",
    email: cliente.email || "",
    address: cliente.endereco || "",
    birthday: cliente.data_nascimento || "",
    notes: cliente.observacoes || "",
    status: cliente.status || "Novo",
  };
}

function clienteParaBanco(cliente) {
  return {
    nome: cliente.name,
    documento: cliente.document,
    telefone: cliente.phone,
    email: cliente.email,
    endereco: cliente.address,
    data_nascimento: cliente.birthday || null,
    observacoes: cliente.notes,
    status: cliente.status || "Novo",
  };
}

function vendaParaBanco(venda) {
  return {
    cliente_id: venda.customerId || null,
    cliente_nome: venda.customerName || "Cliente não informado",
    forma_pagamento: venda.payment,
    desconto: Number(venda.discount) || 0,
    valor_recebido: Number(venda.amountPaid) || 0,
    troco: Number(venda.change) || 0,
    total: getSaleTotal(venda),
    status: venda.status || "Concluída",
    cancelado_por: venda.canceledBy || null,
    cancelado_em: venda.canceledAt || null,
  };
}

function vendaDoBanco(venda, itens = []) {
  return {
    id: venda.id,
    date: venda.criado_em ? venda.criado_em.slice(0, 10) : today,
    customerId: venda.cliente_id || null,
    customerName: venda.cliente_nome || "Cliente não informado",
    payment: venda.forma_pagamento,
    discount: Number(venda.desconto) || 0,
    amountPaid: Number(venda.valor_recebido) || 0,
    change: Number(venda.troco) || 0,
    status: venda.status || "Concluída",
    canceledBy: venda.cancelado_por || "",
    canceledAt: venda.cancelado_em || "",
    items: itens.map((item) => ({
      productId: item.produto_id,
      name: item.produto_nome,
      qty: Number(item.quantidade) || 0,
      price: Number(item.preco_unitario) || 0,
    })),
  };
}

function itemVendaParaBanco(item, vendaId) {
  return {
    venda_id: vendaId,
    produto_id: item.productId,
    produto_nome: item.name,
    quantidade: Number(item.qty) || 0,
    preco_unitario: Number(item.price) || 0,
    subtotal: Number(item.qty) * Number(item.price),
  };
}

function movimentoDoBanco(movimento) {
  return {
    id: movimento.id,
    date: movimento.criado_em ? movimento.criado_em.slice(0, 10) : today,
    productName: movimento.produto_nome,
    type: movimento.tipo,
    qty: Number(movimento.quantidade) || 0,
    user: movimento.usuario || "Administrador",
  };
}

function movimentoParaBanco(movimento, produtoId = null) {
  return {
    produto_id: produtoId,
    produto_nome: movimento.productName,
    tipo: movimento.type,
    quantidade: Number(movimento.qty) || 0,
    usuario: movimento.user || "Administrador",
  };
}

function escaparXml(valor) {
  return String(valor ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function baixarExcelXml(nomeArquivo, nomePlanilha, colunas, linhas) {
  const cabecalho = colunas.map((coluna) => `<Cell><Data ss:Type="String">${escaparXml(coluna.label)}</Data></Cell>`).join("");
  const corpo = linhas.map((linha) => {
    const cells = colunas.map((coluna) => `<Cell><Data ss:Type="String">${escaparXml(linha[coluna.key])}</Data></Cell>`).join("");
    return `<Row>${cells}</Row>`;
  }).join("");

  const xml = `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <Worksheet ss:Name="${escaparXml(nomePlanilha)}">
  <Table>
   <Row>${cabecalho}</Row>
   ${corpo}
  </Table>
 </Worksheet>
</Workbook>`;

  const blob = new Blob([xml], { type: "application/vnd.ms-excel" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = nomeArquivo;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function lerArquivoExcelXml(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parser = new DOMParser();
        const xml = parser.parseFromString(reader.result, "text/xml");
        const rows = Array.from(xml.getElementsByTagName("Row"));
        if (rows.length < 2) return resolve([]);

        const getCellValues = (row) => Array.from(row.getElementsByTagName("Cell")).map((cell) => {
          const data = cell.getElementsByTagName("Data")[0];
          return data?.textContent?.trim() || "";
        });

        const headers = getCellValues(rows[0]).map((header) => header.toLowerCase().normalize("NFD").replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, ""));
        const dados = rows.slice(1).map((row) => {
          const values = getCellValues(row);
          return headers.reduce((obj, header, index) => ({ ...obj, [header]: values[index] || "" }), {});
        });

        resolve(dados);
      } catch {
        reject(new Error("Arquivo inválido"));
      }
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

function normalizarProdutoImportado(item, index) {
  return {
    id: item.id || Date.now() + index,
    name: item.name || item.nome || item.produto || "Produto importado",
    sku: item.sku || item.codigo || "",
    category: item.category || item.categoria || "Importados",
    description: item.description || item.descricao || "Produto importado por arquivo Excel XML",
    cost: Number(item.cost || item.preco_custo || item.custo || 0),
    price: Number(item.price || item.preco_venda || item.valor_venda || 0),
    stock: Number(item.stock || item.estoque || 0),
    minStock: Number(item.minStock || item.estoque_minimo || item.minimo || 0),
    status: item.status || "Ativo",
  };
}

function normalizarClienteImportado(item, index) {
  return {
    id: item.id || Date.now() + index,
    name: item.name || item.nome || item.cliente || "Cliente importado",
    document: item.document || item.documento || item.cpf_cnpj || "",
    phone: item.phone || item.telefone || "",
    email: item.email || "",
    address: item.address || item.endereco || "",
    birthday: item.birthday || item.data_nascimento || "",
    notes: item.notes || item.observacoes || "Cliente importado por arquivo Excel XML",
    status: item.status || "Novo",
  };
}

function normalizarFornecedorImportado(item, index) {
  return {
    id: item.id || Date.now() + index,
    name: item.name || item.nome || item.fornecedor || "Fornecedor importado",
    document: item.document || item.documento || item.cnpj || "",
    phone: item.phone || item.telefone || "",
    email: item.email || "",
    category: item.category || item.categoria || "Geral",
    suppliedItems: item.suppliedItems || item.itens_fornecidos || item.produtos_servicos_fornecidos || item.produtos || "",
    address: item.address || item.endereco || "",
    notes: item.notes || item.observacoes || "Fornecedor importado por arquivo Excel XML",
    status: item.status || "Ativo",
  };
}

function App() {
  const saved = readStorage();
  const [logged, setLogged] = useState(false);
  const [active, setActive] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [products, setProducts] = useState(saved?.products || initialProducts);
  const [customers, setCustomers] = useState(saved?.customers || initialCustomers);
  const [suppliers, setSuppliers] = useState(saved?.suppliers || initialSuppliers);
  const [companySettings, setCompanySettings] = useState(saved?.companySettings || defaultCompanySettings);
  const [sales, setSales] = useState(saved?.sales || initialSales);
  const [movements, setMovements] = useState(saved?.movements || initialMovements);
  const [cart, setCart] = useState([]);
  const [toast, setToast] = useState("");
  const [usingDatabase, setUsingDatabase] = useState(false);
  const [lastReceipt, setLastReceipt] = useState(null);
  const loggedUserName = "Administrador";

  const showToast = (message) => {
    setToast(message);
    window.clearTimeout(showToast.timeoutId);
    showToast.timeoutId = window.setTimeout(() => setToast(""), 2800);
  };

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify({ products, customers, suppliers, sales, movements, companySettings }));
  }, [products, customers, suppliers, sales, movements, companySettings]);

  useEffect(() => {
    async function carregarDadosDoBanco() {
      try {
        const [produtosResposta, clientesResposta, vendasResposta, itensResposta, movimentosResposta] = await Promise.all([
          supabase.from("produtos").select("*").order("id", { ascending: true }),
          supabase.from("clientes").select("*").order("id", { ascending: true }),
          supabase.from("vendas").select("*").order("id", { ascending: false }),
          supabase.from("itens_venda").select("*"),
          supabase.from("movimentacoes_estoque").select("*").order("id", { ascending: false }),
        ]);

        if (produtosResposta.error) throw produtosResposta.error;
        if (clientesResposta.error) throw clientesResposta.error;
        if (vendasResposta.error) throw vendasResposta.error;
        if (itensResposta.error) throw itensResposta.error;
        if (movimentosResposta.error) throw movimentosResposta.error;

        if (produtosResposta.data?.length) setProducts(produtosResposta.data.map(produtoDoBanco));
        if (clientesResposta.data?.length) setCustomers(clientesResposta.data.map(clienteDoBanco));
        setSales((vendasResposta.data || []).map((venda) => vendaDoBanco(venda, (itensResposta.data || []).filter((item) => item.venda_id === venda.id))));
        setMovements((movimentosResposta.data || []).map(movimentoDoBanco));
        setUsingDatabase(true);
        showToast("Dados carregados do banco Supabase.");
      } catch {
        setUsingDatabase(false);
        showToast("Banco não conectado. Usando dados locais do navegador.");
      }
    }
    carregarDadosDoBanco();
  }, []);

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

  const cartTotal = useMemo(() => cart.reduce((sum, item) => sum + Number(item.qty) * Number(item.price), 0), [cart]);

  const resetData = () => {
    localStorage.removeItem(storageKey);
    setProducts(initialProducts);
    setCustomers(initialCustomers);
    setSuppliers(initialSuppliers);
    setCompanySettings(defaultCompanySettings);
    setSales(initialSales);
    setMovements(initialMovements);
    setCart([]);
    showToast("Dados restaurados para o estado inicial.");
  };

  const saveProduct = async (form) => {
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

    try {
      if (usingDatabase) {
        if (form.id) {
          const { data, error } = await supabase.from("produtos").update(produtoParaBanco(product)).eq("id", form.id).select().single();
          if (error) throw error;
          setProducts((current) => current.map((item) => item.id === form.id ? produtoDoBanco(data) : item));
        } else {
          const { data, error } = await supabase.from("produtos").insert(produtoParaBanco(product)).select().single();
          if (error) throw error;
          setProducts((current) => [...current, produtoDoBanco(data)]);
        }
      } else {
        setProducts((current) => form.id ? current.map((item) => item.id === form.id ? product : item) : [...current, product]);
      }
      showToast(form.id ? "Produto atualizado com sucesso." : "Produto cadastrado com sucesso.");
      return true;
    } catch {
      showToast("Não foi possível salvar o produto no banco.");
      return false;
    }
  };

  const deleteProduct = async (productId) => {
    const productInCart = cart.some((item) => item.productId === productId);
    const productInSales = sales.some((sale) => sale.items.some((item) => item.productId === productId));
    const markInactive = productInCart || productInSales;

    try {
      if (usingDatabase) {
        if (markInactive) {
          const { error } = await supabase.from("produtos").update({ status: "Inativo" }).eq("id", productId);
          if (error) throw error;
          setProducts((current) => current.map((product) => product.id === productId ? { ...product, status: "Inativo" } : product));
          showToast("Produto vinculado a vendas foi marcado como inativo.");
          return;
        }
        const { error } = await supabase.from("produtos").delete().eq("id", productId);
        if (error) throw error;
      }

      if (markInactive) {
        setProducts((current) => current.map((product) => product.id === productId ? { ...product, status: "Inativo" } : product));
        showToast("Produto vinculado a vendas foi marcado como inativo.");
        return;
      }
      setProducts((current) => current.filter((product) => product.id !== productId));
      showToast("Produto removido com sucesso.");
    } catch {
      showToast("Não foi possível alterar o produto no banco.");
    }
  };

  const saveCustomer = async (form) => {
    if (!form.name || !form.phone) {
      showToast("Preencha nome e telefone do cliente.");
      return false;
    }

    const customer = { ...form, id: form.id || getNextId(customers), status: form.status || "Novo" };

    try {
      if (usingDatabase) {
        if (form.id) {
          const { data, error } = await supabase.from("clientes").update(clienteParaBanco(customer)).eq("id", form.id).select().single();
          if (error) throw error;
          setCustomers((current) => current.map((item) => item.id === form.id ? clienteDoBanco(data) : item));
        } else {
          const { data, error } = await supabase.from("clientes").insert(clienteParaBanco(customer)).select().single();
          if (error) throw error;
          setCustomers((current) => [...current, clienteDoBanco(data)]);
        }
      } else {
        setCustomers((current) => form.id ? current.map((item) => item.id === form.id ? customer : item) : [...current, customer]);
      }
      showToast(form.id ? "Cliente atualizado com sucesso." : "Cliente cadastrado com sucesso.");
      return true;
    } catch {
      showToast("Não foi possível salvar o cliente no banco.");
      return false;
    }
  };

  const deleteCustomer = async (customerId) => {
    const customerHasSales = sales.some((sale) => sale.customerId === customerId);

    try {
      if (usingDatabase) {
        if (customerHasSales) {
          const { error } = await supabase.from("clientes").update({ status: "Inativo" }).eq("id", customerId);
          if (error) throw error;
          setCustomers((current) => current.map((customer) => customer.id === customerId ? { ...customer, status: "Inativo" } : customer));
          showToast("Cliente vinculado a vendas foi marcado como inativo.");
          return;
        }
        const { error } = await supabase.from("clientes").delete().eq("id", customerId);
        if (error) throw error;
      }

      if (customerHasSales) {
        setCustomers((current) => current.map((customer) => customer.id === customerId ? { ...customer, status: "Inativo" } : customer));
        showToast("Cliente vinculado a vendas foi marcado como inativo.");
        return;
      }
      setCustomers((current) => current.filter((customer) => customer.id !== customerId));
      showToast("Cliente removido com sucesso.");
    } catch {
      showToast("Não foi possível alterar o cliente no banco.");
    }
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

  const finishSale = async ({ customerId, payment, discount, amountPaid, change }) => {
    if (!cart.length) return showToast("Adicione produtos ao carrinho antes de finalizar.");
    const hasStockError = cart.some((item) => {
      const product = products.find((currentProduct) => currentProduct.id === item.productId);
      return !product || product.status !== "Ativo" || product.stock < item.qty;
    });
    if (hasStockError) return showToast("Existe produto inativo ou com estoque insuficiente no carrinho.");

    const subtotal = cart.reduce((sum, item) => sum + Number(item.qty) * Number(item.price), 0);
    const finalTotal = Math.max(subtotal - (Number(discount) || 0), 0);
    const paidValue = Number(amountPaid) || 0;
    if (payment === "Dinheiro" && paidValue < finalTotal) return showToast("Valor recebido em dinheiro é menor que o total da venda.");

    const customer = customers.find((item) => item.id === Number(customerId));
    let newSale = {
      id: getNextId(sales, 1001),
      date: today,
      customerId: customer?.id || null,
      customerName: customer?.name || "Cliente não informado",
      payment: payment || "PIX",
      discount: Number(discount) || 0,
      amountPaid: payment === "Dinheiro" ? paidValue : finalTotal,
      change: payment === "Dinheiro" ? Math.max(Number(change) || 0, 0) : 0,
      status: "Concluída",
      items: cart.map((item) => ({ ...item })),
    };

    const newMovements = cart.map((item, index) => ({
      id: getNextId(movements) + index,
      date: today,
      productName: item.name,
      type: "Venda",
      qty: -item.qty,
      user: "Administrador",
    }));

    try {
      if (usingDatabase) {
        const { data: vendaCriada, error: vendaError } = await supabase.from("vendas").insert(vendaParaBanco(newSale)).select().single();
        if (vendaError) throw vendaError;

        const itensBanco = cart.map((item) => itemVendaParaBanco(item, vendaCriada.id));
        const { data: itensCriados, error: itensError } = await supabase.from("itens_venda").insert(itensBanco).select();
        if (itensError) throw itensError;

        const movimentosBanco = cart.map((item) => movimentoParaBanco({ productName: item.name, type: "Venda", qty: -item.qty, user: "Administrador" }, item.productId));
        const { data: movimentosCriados, error: movimentosError } = await supabase.from("movimentacoes_estoque").insert(movimentosBanco).select();
        if (movimentosError) throw movimentosError;

        await Promise.all(cart.map((item) => {
          const product = products.find((currentProduct) => currentProduct.id === item.productId);
          return supabase.from("produtos").update({ estoque: Number(product.stock) - Number(item.qty) }).eq("id", item.productId);
        }));

        newSale = vendaDoBanco(vendaCriada, itensCriados || []);
        newMovements.splice(0, newMovements.length, ...(movimentosCriados || []).map(movimentoDoBanco));
      }

      setSales((current) => [newSale, ...current]);
      setProducts((current) => current.map((product) => {
        const sold = cart.find((item) => item.productId === product.id);
        return sold ? { ...product, stock: product.stock - sold.qty } : product;
      }));
      setMovements((current) => [...newMovements, ...current]);
      setCart([]);
      setLastReceipt(newSale);
      showToast("Venda finalizada e estoque atualizado automaticamente.");
    } catch {
      showToast("Não foi possível salvar a venda no Supabase.");
    }
  };

  const cancelSale = async (sale) => {
    if (sale.status === "Cancelada") return;

    const canceledAt = new Date().toISOString();
    const canceledBy = loggedUserName;

    const newMovements = sale.items.map((item, index) => ({
      id: getNextId(movements) + index,
      date: today,
      productName: item.name,
      type: "Cancelamento",
      qty: item.qty,
      user: canceledBy,
    }));

    try {
      if (usingDatabase) {
        const { error: vendaError } = await supabase.from("vendas").update({
          status: "Cancelada",
          cancelado_por: canceledBy,
          cancelado_em: canceledAt,
        }).eq("id", sale.id);
        if (vendaError) throw vendaError;

        const movimentosBanco = sale.items.map((item) => movimentoParaBanco({ productName: item.name, type: "Cancelamento", qty: item.qty, user: canceledBy }, item.productId));
        const { data: movimentosCriados, error: movimentosError } = await supabase.from("movimentacoes_estoque").insert(movimentosBanco).select();
        if (movimentosError) throw movimentosError;

        await Promise.all(sale.items.map((item) => {
          const product = products.find((currentProduct) => currentProduct.id === item.productId);
          return supabase.from("produtos").update({ estoque: Number(product?.stock || 0) + Number(item.qty) }).eq("id", item.productId);
        }));

        newMovements.splice(0, newMovements.length, ...(movimentosCriados || []).map(movimentoDoBanco));
      }

      setSales((current) => current.map((currentSale) => currentSale.id === sale.id ? { ...currentSale, status: "Cancelada", canceledBy, canceledAt } : currentSale));
      setProducts((current) => current.map((product) => {
        const item = sale.items.find((saleItem) => saleItem.productId === product.id);
        return item ? { ...product, stock: product.stock + item.qty } : product;
      }));
      setMovements((current) => [...newMovements, ...current]);
      showToast(`Venda cancelada por ${canceledBy}. Itens devolvidos ao estoque.`);
    } catch {
      showToast("Não foi possível cancelar a venda no Supabase.");
    }
  };

  const addStock = async (product, amount = 5) => {
    const qty = Number(amount) || 0;
    if (qty <= 0) return showToast("Informe uma quantidade válida.");
    const movement = { id: getNextId(movements), date: today, productName: product.name, type: "Entrada", qty, user: "Administrador" };

    try {
      if (usingDatabase) {
        const { error: produtoError } = await supabase.from("produtos").update({ estoque: Number(product.stock) + qty }).eq("id", product.id);
        if (produtoError) throw produtoError;

        const { data: movimentoCriado, error: movimentoError } = await supabase.from("movimentacoes_estoque").insert(movimentoParaBanco(movement, product.id)).select().single();
        if (movimentoError) throw movimentoError;
        movement.id = movimentoCriado.id;
        movement.date = movimentoCriado.criado_em ? movimentoCriado.criado_em.slice(0, 10) : today;
      }

      setProducts((current) => current.map((currentProduct) => currentProduct.id === product.id ? { ...currentProduct, stock: currentProduct.stock + qty } : currentProduct));
      setMovements((current) => [movement, ...current]);
      showToast(`Entrada de ${qty} unidades registrada.`);
    } catch {
      showToast("Não foi possível registrar a entrada no Supabase.");
    }
  };

  const exportProducts = () => {
    baixarExcelXml("produtos-gestao-comercial.xml", "Produtos", [
      { key: "name", label: "Nome" },
      { key: "sku", label: "SKU" },
      { key: "category", label: "Categoria" },
      { key: "description", label: "Descricao" },
      { key: "cost", label: "Preco Custo" },
      { key: "price", label: "Preco Venda" },
      { key: "stock", label: "Estoque" },
      { key: "minStock", label: "Estoque Minimo" },
      { key: "status", label: "Status" },
    ], products);
    showToast("Arquivo Excel XML de produtos exportado com sucesso.");
  };

  const exportCustomers = () => {
    baixarExcelXml("clientes-gestao-comercial.xml", "Clientes", [
      { key: "name", label: "Nome" },
      { key: "document", label: "Documento" },
      { key: "phone", label: "Telefone" },
      { key: "email", label: "Email" },
      { key: "address", label: "Endereco" },
      { key: "birthday", label: "Data Nascimento" },
      { key: "notes", label: "Observacoes" },
      { key: "status", label: "Status" },
    ], customers);
    showToast("Arquivo Excel XML de clientes exportado com sucesso.");
  };

  const importProducts = async (file) => {
    if (!file) return;
    try {
      const lista = await lerArquivoExcelXml(file);
      if (!lista.length) return showToast("Nenhum produto encontrado no arquivo.");
      const produtosImportados = lista.map(normalizarProdutoImportado);

      if (usingDatabase) {
        const { data, error } = await supabase.from("produtos").insert(produtosImportados.map(produtoParaBanco)).select();
        if (error) throw error;
        setProducts((current) => [...current, ...data.map(produtoDoBanco)]);
      } else {
        setProducts((current) => [...current, ...produtosImportados]);
      }

      showToast(`${produtosImportados.length} produto(s) importado(s) com sucesso.`);
    } catch {
      showToast("Não foi possível importar produtos. Use um arquivo Excel XML válido.");
    }
  };

  const importCustomers = async (file) => {
    if (!file) return;
    try {
      const lista = await lerArquivoExcelXml(file);
      if (!lista.length) return showToast("Nenhum cliente encontrado no arquivo.");
      const clientesImportados = lista.map(normalizarClienteImportado);

      if (usingDatabase) {
        const { data, error } = await supabase.from("clientes").insert(clientesImportados.map(clienteParaBanco)).select();
        if (error) throw error;
        setCustomers((current) => [...current, ...data.map(clienteDoBanco)]);
      } else {
        setCustomers((current) => [...current, ...clientesImportados]);
      }

      showToast(`${clientesImportados.length} cliente(s) importado(s) com sucesso.`);
    } catch {
      showToast("Não foi possível importar clientes. Use um arquivo Excel XML válido.");
    }
  };

  const saveSupplier = async (form) => {
    if (!form.name || !form.phone) {
      showToast("Preencha nome e telefone do fornecedor.");
      return false;
    }
    const supplier = { ...form, id: form.id || getNextId(suppliers), status: form.status || "Ativo" };
    setSuppliers((current) => form.id ? current.map((item) => item.id === form.id ? supplier : item) : [...current, supplier]);
    showToast(form.id ? "Fornecedor atualizado com sucesso." : "Fornecedor cadastrado com sucesso.");
    return true;
  };

  const deleteSupplier = (supplierId) => {
    setSuppliers((current) => current.filter((supplier) => supplier.id !== supplierId));
    showToast("Fornecedor removido com sucesso.");
  };

  const exportSuppliers = () => {
    baixarExcelXml("fornecedores-gestao-comercial.xml", "Fornecedores", [
      { key: "name", label: "Nome" },
      { key: "document", label: "CNPJ" },
      { key: "phone", label: "Telefone" },
      { key: "email", label: "Email" },
      { key: "category", label: "Categoria" },
      { key: "suppliedItems", label: "Produtos Servicos Fornecidos" },
      { key: "address", label: "Endereco" },
      { key: "notes", label: "Observacoes" },
      { key: "status", label: "Status" },
    ], suppliers);
    showToast("Arquivo Excel XML de fornecedores exportado com sucesso.");
  };

  const importSuppliers = async (file) => {
    if (!file) return;
    try {
      const lista = await lerArquivoExcelXml(file);
      if (!lista.length) return showToast("Nenhum fornecedor encontrado no arquivo.");
      const fornecedoresImportados = lista.map(normalizarFornecedorImportado);
      setSuppliers((current) => [...current, ...fornecedoresImportados]);
      showToast(`${fornecedoresImportados.length} fornecedor(es) importado(s) com sucesso.`);
    } catch {
      showToast("Não foi possível importar fornecedores. Use um arquivo Excel XML válido.");
    }
  };

  const handleNavigate = (key) => {
    setActive(key);
    setSidebarOpen(false);
  };

  const renderContent = () => {
    if (active === "dashboard") return <Dashboard sales={sales} products={products} customers={customers} lowStock={lowStock} resetData={resetData} />;
    if (active === "products") return <Products products={products} saveProduct={saveProduct} deleteProduct={deleteProduct} exportProducts={exportProducts} importProducts={importProducts} />;
    if (active === "stock") return <Stock products={products} movements={movements} addStock={addStock} />;
    if (active === "pdv") return <PDV products={products} customers={customers} cart={cart} addToCart={addToCart} updateCartQty={updateCartQty} removeFromCart={(id) => setCart((current) => current.filter((item) => item.productId !== id))} finishSale={finishSale} cartTotal={cartTotal} />;
    if (active === "customers") return <Customers customers={customers} saveCustomer={saveCustomer} deleteCustomer={deleteCustomer} sales={sales} exportCustomers={exportCustomers} importCustomers={importCustomers} />;
    if (active === "suppliers") return <Suppliers suppliers={suppliers} saveSupplier={saveSupplier} deleteSupplier={deleteSupplier} exportSuppliers={exportSuppliers} importSuppliers={importSuppliers} />;
    if (active === "settings") return <Settings companySettings={companySettings} setCompanySettings={setCompanySettings} showToast={showToast} />;
    if (active === "crm") return <CRM customers={customers} sales={sales} />;
    if (active === "sales") return <Sales sales={sales} cancelSale={cancelSale} />;
    return null;
  };

  if (!logged) {
    return <LoginScreen onLogin={() => setLogged(true)} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {toast && <div className="fixed right-6 top-6 z-50 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-medium text-white shadow-xl">{toast}</div>}
      <Sidebar active={active} onNavigate={handleNavigate} onLogout={() => setLogged(false)} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="lg:ml-72 min-h-screen bg-[radial-gradient(circle_at_top_left,#dbeafe_0,#f8fafc_34%,#f8fafc_100%)] p-4 md:p-8">
        <div className="mb-6 overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur-xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden rounded-2xl border border-slate-200 bg-white p-3 text-slate-700 shadow-sm"><Menu size={20} /></button>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-700 to-emerald-500 text-white shadow-lg shadow-blue-900/20">
                <BarChart3 size={22} />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">Projeto Integrador — UNIVESP</p>
                <h2 className="text-lg font-black text-slate-950 md:text-xl">Painel administrativo para pequenos negócios</h2>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3"><Badge tone="green">Administrador</Badge><Badge tone={usingDatabase ? "green" : "blue"}>{usingDatabase ? "Banco Supabase conectado" : "Dados salvos localmente"}</Badge></div>
          </div>
        </div>
        {renderContent()}
        {lastReceipt && <ReceiptModal sale={lastReceipt} companySettings={companySettings} operatorName={loggedUserName} onClose={() => setLastReceipt(null)} />}
      </main>
    </div>
  );
}

function LoginScreen({ onLogin }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#2563eb_0,#0f172a_42%,#020617_100%)] p-6 text-white">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-6xl items-center justify-center">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="grid w-full overflow-hidden rounded-[2rem] border border-white/10 bg-white/10 shadow-2xl shadow-slate-950/40 backdrop-blur-2xl md:grid-cols-[1.1fr_0.9fr]">
          <div className="relative overflow-hidden p-8 md:p-12">
            <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-blue-500/30 blur-3xl" />
            <div className="absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl" />
            <div className="relative z-10 flex min-h-[520px] flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 shadow-lg shadow-slate-950/10">
                  <div className="rounded-xl bg-emerald-400 p-2 text-slate-950"><Building2 size={22} /></div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-blue-100">Sistema Web</p>
                    <h1 className="font-black leading-tight">Gestão Comercial Integrada</h1>
                  </div>
                </div>
                <h2 className="mt-10 max-w-xl text-4xl font-black leading-tight md:text-5xl">Controle comercial com PDV, estoque, clientes e relatórios.</h2>
                <p className="mt-5 max-w-lg text-base leading-7 text-blue-100">Projeto Integrador desenvolvido para apoiar pequenos negócios na organização das vendas, cadastro de clientes, controle de estoque e acompanhamento gerencial.</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-3xl border border-white/10 bg-white/10 p-5"><p className="text-sm text-blue-100">Módulo</p><b className="mt-1 block text-lg">PDV com troco</b></div>
                <div className="rounded-3xl border border-white/10 bg-white/10 p-5"><p className="text-sm text-blue-100">Banco</p><b className="mt-1 block text-lg">Supabase</b></div>
                <div className="rounded-3xl border border-white/10 bg-white/10 p-5"><p className="text-sm text-blue-100">Gestão</p><b className="mt-1 block text-lg">Clientes e CRM</b></div>
                <div className="rounded-3xl border border-white/10 bg-white/10 p-5"><p className="text-sm text-blue-100">Análise</p><b className="mt-1 block text-lg">Relatórios</b></div>
              </div>
            </div>
          </div>
          <div className="bg-white p-8 text-slate-950 md:p-12">
            <div className="flex h-full flex-col justify-center">
              <div className="mb-8 inline-flex w-fit items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700"><Wallet size={16} /> Acesso administrativo</div>
              <h2 className="text-3xl font-black tracking-tight">Entrar no sistema</h2>
              <p className="mt-2 text-slate-500">Acesse a versão funcional para apresentação acadêmica.</p>
              <div className="mt-8 space-y-5">
                <Input label="E-mail" defaultValue="admin@demo.com" />
                <Input label="Senha" type="password" defaultValue="123456" />
                <button onClick={onLogin} className="group w-full rounded-2xl bg-gradient-to-r from-blue-700 to-blue-600 px-5 py-4 font-bold text-white shadow-xl shadow-blue-700/20 transition hover:scale-[1.01] hover:shadow-blue-700/30 flex items-center justify-center gap-2"><LogIn size={18} /> Entrar no painel</button>
              </div>
              <p className="mt-6 text-center text-xs text-slate-400">Ambiente de demonstração integrado ao Supabase para produtos e clientes.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function Input({ label, value, onChange, type = "text", defaultValue, placeholder }) {
  return <label className="block"><span className="text-sm font-medium text-slate-700">{label}</span><input type={type} value={value} onChange={onChange} defaultValue={defaultValue} placeholder={placeholder} className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500" /></label>;
}

function Select({ label, value, onChange, children }) {
  return <label className="block"><span className="text-sm font-medium text-slate-700">{label}</span><select value={value} onChange={onChange} className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 bg-white">{children}</select></label>;
}

function Modal({ title, children, onClose }) {
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"><motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-3xl rounded-3xl bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto"><div className="mb-5 flex items-center justify-between"><h2 className="text-xl font-bold text-slate-950">{title}</h2><button onClick={onClose} className="rounded-xl p-2 hover:bg-slate-100"><X size={20} /></button></div>{children}</motion.div></div>;
}

function Badge({ children, tone = "blue" }) {
  const styles = { blue: "bg-blue-50 text-blue-700 ring-blue-100", green: "bg-emerald-50 text-emerald-700 ring-emerald-100", red: "bg-red-50 text-red-700 ring-red-100", amber: "bg-amber-50 text-amber-700 ring-amber-100", slate: "bg-slate-100 text-slate-700 ring-slate-200" };
  return <span className={`inline-flex rounded-full px-3 py-1.5 text-xs font-bold ring-1 ${styles[tone] || styles.blue}`}>{children}</span>;
}

function Sidebar({ active, onNavigate, onLogout, open, onClose }) {
  return (
    <>
      {open && (
        <button
          aria-label="Fechar menu"
          onClick={onClose}
          className="fixed inset-0 z-30 bg-slate-950/50 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-40 h-full w-72 bg-slate-950 text-white p-5 flex flex-col transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#1d4ed8_0,#0f172a_38%,#020617_100%)]" />

        <div className="relative z-10 flex h-full min-h-0 flex-col">
          <div className="flex items-center justify-between border-b border-white/10 pb-5">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-gradient-to-br from-emerald-400 to-blue-500 p-3 text-white shadow-lg shadow-blue-950/40">
                <Building2 size={22} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-blue-200">Sistema Web</p>
                <h2 className="font-black leading-tight">Gestão Comercial Integrada</h2>
              </div>
            </div>
            <button onClick={onClose} className="lg:hidden rounded-xl p-2 hover:bg-white/10">
              <X size={18} />
            </button>
          </div>

          <nav className="mt-7 flex-1 space-y-2 overflow-y-auto pr-1 [scrollbar-color:rgba(255,255,255,0.35)_transparent] [scrollbar-width:thin]">
            {menu.map((item) => {
              const Icon = item.icon;
              const isActive = active === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => onNavigate(item.key)}
                  className={`group w-full flex items-center gap-3 rounded-2xl px-4 py-3 text-left transition ${isActive ? "bg-white text-blue-700 shadow-xl shadow-slate-950/20" : "text-slate-300 hover:bg-white/10 hover:text-white"}`}
                >
                  <span className={`rounded-xl p-2 transition ${isActive ? "bg-blue-50 text-blue-700" : "bg-white/5 text-slate-300 group-hover:bg-white/10 group-hover:text-white"}`}>
                    <Icon size={17} />
                  </span>
                  <span className="font-semibold">{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="rounded-3xl border border-white/10 bg-white/10 p-4">
            <p className="text-xs text-blue-100">Status do projeto</p>
            <p className="mt-1 text-sm font-bold">Versão estável para apresentação</p>
          </div>

          <button onClick={onLogout} className="mt-4 flex items-center gap-3 rounded-2xl px-4 py-3 text-slate-300 hover:bg-white/10">
            <LogOut size={18} /> Sair
          </button>
        </div>
      </aside>
    </>
  );
}

function SectionTitle({ title, subtitle, actions }) {
  return <div className="mb-7 flex flex-col gap-4 md:flex-row md:items-start md:justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.24em] text-blue-700">Gestão Comercial</p><h1 className="mt-1 text-3xl font-black tracking-tight text-slate-950">{title}</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">{subtitle}</p></div>{actions}</div>;
}

function StatCard({ title, value, icon: Icon, caption }) {
  return <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="group rounded-[1.75rem] border border-white/70 bg-white/90 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.07)] backdrop-blur transition hover:-translate-y-1 hover:shadow-[0_30px_80px_rgba(15,23,42,0.1)]"><div className="flex items-start justify-between gap-4"><div><p className="text-sm font-semibold text-slate-500">{title}</p><h3 className="mt-2 text-3xl font-black tracking-tight text-slate-950">{value}</h3>{caption && <p className="mt-2 text-xs font-medium text-slate-400">{caption}</p>}</div><div className="rounded-2xl bg-gradient-to-br from-blue-600 to-emerald-500 p-3 text-white shadow-lg shadow-blue-700/20 transition group-hover:scale-110"><Icon size={22} /></div></div></motion.div>;
}

function ChartCard({ title, children }) {
  return <div className="rounded-[1.75rem] border border-white/70 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.07)] backdrop-blur"><div className="mb-5 flex items-center justify-between"><h3 className="font-black text-slate-950">{title}</h3><span className="h-2 w-2 rounded-full bg-emerald-500" /></div>{children}</div>;
}

function Dashboard({ sales, products, customers, lowStock, resetData }) {
  const [period, setPeriod] = useState("all");

  const filteredSales = useMemo(() => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const sevenDaysAgo = new Date(startOfToday);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    return sales.filter((sale) => {
      const saleDate = new Date(`${sale.date}T00:00:00`);
      if (period === "today") return saleDate >= startOfToday;
      if (period === "7days") return saleDate >= sevenDaysAgo;
      if (period === "month") return saleDate >= startOfMonth;
      return true;
    });
  }, [sales, period]);

  const completedSales = filteredSales.filter((sale) => sale.status === "Concluída");
  const canceledSales = filteredSales.filter((sale) => sale.status === "Cancelada");
  const total = completedSales.reduce((sum, sale) => sum + getSaleTotal(sale), 0);
  const totalToday = sales.filter((sale) => sale.date === today && sale.status === "Concluída").reduce((sum, sale) => sum + getSaleTotal(sale), 0);
  const totalMonth = sales.filter((sale) => sale.status === "Concluída").reduce((sum, sale) => sum + getSaleTotal(sale), 0);
  const ticketMedio = completedSales.length ? total / completedSales.length : 0;
  const valorEmEstoque = products.reduce((sum, product) => sum + product.stock * product.cost, 0);

  const productMap = {};
  completedSales.forEach((sale) => {
    sale.items.forEach((item) => {
      productMap[item.name] = (productMap[item.name] || 0) + Number(item.qty);
    });
  });
  const produtoMaisVendido = Object.entries(productMap).sort((a, b) => b[1] - a[1])[0];

  const customerMap = {};
  completedSales.forEach((sale) => {
    const name = sale.customerName || "Cliente não informado";
    customerMap[name] = (customerMap[name] || 0) + getSaleTotal(sale);
  });
  const clienteMaisComprou = Object.entries(customerMap).sort((a, b) => b[1] - a[1])[0];

  const salesByDay = useMemo(() => {
    const dayMap = {};
    completedSales.forEach((sale) => {
      dayMap[sale.date.slice(5)] = (dayMap[sale.date.slice(5)] || 0) + getSaleTotal(sale);
    });
    return Object.entries(dayMap).map(([date, total]) => ({ date, total })).sort((a, b) => a.date.localeCompare(b.date));
  }, [completedSales]);

  const productSales = useMemo(() => {
    return Object.entries(productMap).map(([name, qty]) => ({ name, qty })).sort((a, b) => b.qty - a.qty).slice(0, 6);
  }, [completedSales]);

  const paymentData = useMemo(() => {
    const paymentMap = {};
    completedSales.forEach((sale) => {
      paymentMap[sale.payment] = (paymentMap[sale.payment] || 0) + getSaleTotal(sale);
    });
    return Object.entries(paymentMap).map(([name, value]) => ({ name, value }));
  }, [completedSales]);

  const produtosComMargem = products.map((product) => {
    const lucro = Number(product.price) - Number(product.cost);
    const margem = Number(product.price) > 0 ? (lucro / Number(product.price)) * 100 : 0;
    return { ...product, lucro, margem };
  }).sort((a, b) => b.margem - a.margem).slice(0, 5);

  return <div><SectionTitle title="Dashboard Gerencial" subtitle="Centralização dos principais indicadores de vendas, estoque, clientes, pagamentos, ticket médio e margem de lucro." actions={<div className="flex flex-col gap-3 sm:flex-row"><Select label="Período" value={period} onChange={(e) => setPeriod(e.target.value)}><option value="all">Todas as vendas</option><option value="today">Hoje</option><option value="7days">Últimos 7 dias</option><option value="month">Este mês</option></Select><button onClick={resetData} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50 flex items-center justify-center gap-2"><RotateCcw size={16} /> Restaurar dados</button></div>} /><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"><StatCard title="Receita filtrada" value={currency(total)} icon={Wallet} caption="Vendas concluídas no período" /><StatCard title="Vendas do dia" value={currency(totalToday)} icon={CreditCard} caption="Indicador operacional diário" /><StatCard title="Vendas do mês" value={currency(totalMonth)} icon={BarChart3} caption="Total geral concluído" /><StatCard title="Ticket médio" value={currency(ticketMedio)} icon={Receipt} caption="Receita ÷ vendas concluídas" /></div><div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4"><StatCard title="Vendas concluídas" value={completedSales.length} icon={Receipt} caption="No período selecionado" /><StatCard title="Vendas canceladas" value={canceledSales.length} icon={X} caption="Controle operacional" /><StatCard title="Produtos cadastrados" value={products.length} icon={Package} caption="Produtos ativos e inativos" /><StatCard title="Clientes cadastrados" value={customers.length} icon={Users} caption="Base de relacionamento" /></div><div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4"><StatCard title="Baixo estoque" value={lowStock.length} icon={Boxes} caption="Itens abaixo do mínimo" /><StatCard title="Valor em estoque" value={currency(valorEmEstoque)} icon={BarChart3} caption="Custo estimado" /><StatCard title="Produto destaque" value={produtoMaisVendido ? produtoMaisVendido[0] : "Sem vendas"} icon={Package} caption={produtoMaisVendido ? `${produtoMaisVendido[1]} unidade(s)` : "Nenhum produto vendido"} /><StatCard title="Cliente destaque" value={clienteMaisComprou ? clienteMaisComprou[0] : "Sem cliente"} icon={UserRound} caption={clienteMaisComprou ? currency(clienteMaisComprou[1]) : "Nenhuma compra"} /></div><div className="mt-6 grid gap-5 xl:grid-cols-2"><ChartCard title="Vendas por período"><ResponsiveContainer width="100%" height={270}><BarChart data={salesByDay}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="date" /><YAxis /><Tooltip formatter={(value) => currency(value)} /><Bar dataKey="total" fill="#2563eb" radius={[10, 10, 0, 0]} /></BarChart></ResponsiveContainer></ChartCard><ChartCard title="Produtos mais vendidos"><ResponsiveContainer width="100%" height={270}><BarChart data={productSales}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis /><Tooltip /><Bar dataKey="qty" fill="#059669" radius={[10, 10, 0, 0]} /></BarChart></ResponsiveContainer></ChartCard></div><div className="mt-6 grid gap-5 xl:grid-cols-2"><ChartCard title="Formas de pagamento"><ResponsiveContainer width="100%" height={260}><PieChart><Pie data={paymentData} dataKey="value" nameKey="name" outerRadius={90} label>{paymentData.map((entry, index) => <Cell key={entry.name} fill={chartColors[index % chartColors.length]} />)}</Pie><Tooltip formatter={(value) => currency(value)} /></PieChart></ResponsiveContainer></ChartCard><div className="rounded-[1.75rem] border border-white/70 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.07)] backdrop-blur"><h3 className="mb-4 font-black text-slate-950">Alertas de estoque</h3><div className="space-y-3">{lowStock.length === 0 && <p className="text-sm text-slate-400">Nenhum produto abaixo do estoque mínimo.</p>}{lowStock.map((product) => <div key={product.id} className="flex items-center justify-between rounded-2xl bg-amber-50 p-4"><span>{product.name}</span><Badge tone="amber">{product.stock} un.</Badge></div>)}</div></div></div><div className="mt-6 grid gap-5 xl:grid-cols-2"><div className="rounded-[1.75rem] border border-white/70 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.07)]"><h3 className="mb-4 font-black text-slate-950">Margem de lucro dos produtos</h3><div className="space-y-3">{produtosComMargem.map((product) => <div key={product.id} className="flex items-center justify-between rounded-2xl bg-slate-50 p-4"><div><b>{product.name}</b><p className="text-xs text-slate-500">Custo {currency(product.cost)} • Venda {currency(product.price)}</p></div><Badge tone={product.lucro >= 0 ? "green" : "red"}>{currency(product.lucro)} • {product.margem.toFixed(1)}%</Badge></div>)}</div></div><div className="rounded-[1.75rem] border border-white/70 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.07)]"><h3 className="font-black mb-4 text-slate-950">Resumo por pagamento</h3><div className="grid gap-3 md:grid-cols-2">{paymentData.map((payment) => <div key={payment.name} className="rounded-2xl bg-slate-50 p-4"><p className="text-sm text-slate-500">{payment.name}</p><b>{currency(payment.value)}</b></div>)}{paymentData.length === 0 && <p className="text-sm text-slate-400">Nenhuma venda concluída no período selecionado.</p>}</div></div></div></div>;
}

function Toolbar({ query, setQuery, placeholder, button, onClick }) {
  return <div className="mb-5 flex flex-col md:flex-row gap-3 md:items-center md:justify-between"><div className="relative flex-1"><Search className="absolute left-4 top-3.5 text-slate-400" size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={placeholder} className="w-full rounded-2xl border border-slate-200 py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-blue-500" /></div><button onClick={onClick} className="rounded-2xl bg-gradient-to-r from-blue-700 to-blue-600 px-5 py-3 font-bold text-white shadow-lg shadow-blue-700/20 transition hover:scale-[1.01] hover:shadow-blue-700/30 flex items-center justify-center gap-2"><Plus size={18} /> {button}</button></div>;
}

function DataTable({ headers, children }) {
  return <div className="overflow-hidden rounded-[1.75rem] border border-white/70 bg-white/90 shadow-[0_20px_60px_rgba(15,23,42,0.07)] backdrop-blur"><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-slate-950 text-slate-100"><tr>{headers.map((header) => <th key={header} className="p-4 text-xs font-black uppercase tracking-[0.16em] whitespace-nowrap">{header}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{children}</tbody></table></div></div>;
}

function Products({ products, saveProduct, deleteProduct, exportProducts, importProducts }) {
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(emptyProduct);
  const filtered = products.filter((product) => `${product.name} ${product.sku} ${product.category}`.toLowerCase().includes(query.toLowerCase()));
  const openForm = (product) => { setForm(product ? { ...product } : emptyProduct); setModal(true); };
  const submit = async () => { if (await saveProduct(form)) setModal(false); };

  return <div><SectionTitle title="Produtos" subtitle="Cadastro real, edição, pesquisa, importação, exportação, estoque e margem de lucro." actions={<div className="flex flex-wrap gap-2"><button onClick={exportProducts} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50 flex items-center gap-2"><Download size={16} /> Exportar</button><label className="cursor-pointer rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50 flex items-center gap-2"><Upload size={16} /> Importar<input type="file" accept=".xml,application/xml,text/xml" className="hidden" onChange={(e) => { importProducts(e.target.files?.[0]); e.target.value = ""; }} /></label></div>} /><Toolbar query={query} setQuery={setQuery} placeholder="Pesquisar produto, SKU ou categoria..." button="Novo produto" onClick={() => openForm()} /><DataTable headers={["Produto", "SKU", "Categoria", "Preço", "Margem", "Estoque", "Status", "Ações"]}>{filtered.map((product) => { const lucro = Number(product.price) - Number(product.cost); const margem = Number(product.price) > 0 ? (lucro / Number(product.price)) * 100 : 0; return <tr key={product.id} className="border-t border-slate-100 hover:bg-slate-50/70"><td className="p-4"><b>{product.name}</b><p className="text-xs text-slate-500">{product.description}</p></td><td className="p-4">{product.sku}</td><td className="p-4">{product.category}</td><td className="p-4">{currency(product.price)}</td><td className="p-4"><div className="text-sm"><b className={lucro >= 0 ? "text-emerald-700" : "text-red-700"}>{currency(lucro)}</b><p className="text-xs text-slate-500">{margem.toFixed(1)}%</p></div></td><td className="p-4">{product.stock <= product.minStock ? <Badge tone="amber">{product.stock} baixo</Badge> : `${product.stock} un.`}</td><td className="p-4"><Badge tone={product.status === "Ativo" ? "green" : "slate"}>{product.status}</Badge></td><td className="p-4"><div className="flex gap-3"><button onClick={() => openForm(product)} className="rounded-xl bg-blue-50 p-2 text-blue-700 hover:bg-blue-100"><Edit3 size={18} /></button><button onClick={() => deleteProduct(product.id)} className="rounded-xl bg-red-50 p-2 text-red-600 hover:bg-red-100"><Trash2 size={18} /></button></div></td></tr>; })}</DataTable>{modal && <Modal title={form.id ? "Editar produto" : "Cadastrar produto"} onClose={() => setModal(false)}><ProductForm form={form} setForm={setForm} onSubmit={submit} /></Modal>}</div>;
}

function ProductForm({ form, setForm, onSubmit }) {
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const lucro = Number(form.price || 0) - Number(form.cost || 0);
  const margem = Number(form.price || 0) > 0 ? (lucro / Number(form.price || 0)) * 100 : 0;

  return <div className="grid gap-4 md:grid-cols-2"><Input label="Nome do produto" value={form.name} onChange={(e) => update("name", e.target.value)} /><Input label="SKU/Código" value={form.sku} onChange={(e) => update("sku", e.target.value)} /><Input label="Categoria" value={form.category} onChange={(e) => update("category", e.target.value)} /><Input label="Descrição" value={form.description} onChange={(e) => update("description", e.target.value)} /><Input label="Preço de custo" type="number" value={form.cost} onChange={(e) => update("cost", e.target.value)} /><Input label="Preço de venda" type="number" value={form.price} onChange={(e) => update("price", e.target.value)} /><div className="rounded-2xl bg-emerald-50 p-4 text-emerald-800"><p className="text-xs font-bold uppercase tracking-[0.16em]">Lucro por unidade</p><b className="mt-1 block text-xl">{currency(lucro)}</b></div><div className="rounded-2xl bg-blue-50 p-4 text-blue-800"><p className="text-xs font-bold uppercase tracking-[0.16em]">Margem de lucro</p><b className="mt-1 block text-xl">{margem.toFixed(1)}%</b></div><Input label="Estoque atual" type="number" value={form.stock} onChange={(e) => update("stock", e.target.value)} /><Input label="Estoque mínimo" type="number" value={form.minStock} onChange={(e) => update("minStock", e.target.value)} /><Select label="Status" value={form.status} onChange={(e) => update("status", e.target.value)}><option>Ativo</option><option>Inativo</option></Select><div className="md:col-span-2 flex justify-end"><button onClick={onSubmit} className="rounded-2xl bg-gradient-to-r from-blue-700 to-blue-600 px-5 py-3 font-bold text-white shadow-lg shadow-blue-700/20 transition hover:scale-[1.01] hover:shadow-blue-700/30 flex items-center gap-2"><Save size={18} /> Salvar produto</button></div></div>;
}

function Stock({ products, movements, addStock }) {
  const [amounts, setAmounts] = useState({});
  return <div><SectionTitle title="Estoque" subtitle="Controle de entrada, movimentações e produtos com baixo estoque." /><div className="grid gap-5 xl:grid-cols-2"><div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100"><h3 className="font-bold mb-4">Produtos em estoque</h3><div className="space-y-3">{products.map((product) => <div key={product.id} className="rounded-2xl border border-slate-100 p-4"><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><b>{product.name}</b><p className="text-xs text-slate-500">Mínimo: {product.minStock} un. • {product.status}</p></div><Badge tone={product.stock <= product.minStock ? "amber" : "green"}>{product.stock} un.</Badge></div><div className="mt-3 flex gap-2"><input type="number" min="1" value={amounts[product.id] || 5} onChange={(e) => setAmounts((current) => ({ ...current, [product.id]: e.target.value }))} className="w-28 rounded-xl border border-slate-200 px-3 py-2" /><button onClick={() => addStock(product, amounts[product.id] || 5)} className="rounded-xl bg-gradient-to-r from-blue-700 to-blue-600 px-3 py-2 text-sm font-bold text-white shadow-lg shadow-blue-700/20">Registrar entrada</button></div></div>)}</div></div><div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100"><h3 className="font-bold mb-4">Histórico de movimentações</h3><div className="space-y-3">{movements.map((movement) => <div key={movement.id} className="rounded-2xl bg-slate-50 p-4"><div className="flex justify-between gap-3"><b>{movement.productName}</b><Badge tone={movement.qty < 0 ? "red" : "green"}>{movement.qty > 0 ? "+" : ""}{movement.qty}</Badge></div><p className="text-xs text-slate-500">{movement.type} • {movement.date} • {movement.user}</p></div>)}</div></div></div></div>;
}

function PDV({ products, customers, cart, addToCart, updateCartQty, removeFromCart, finishSale, cartTotal }) {
  const [query, setQuery] = useState("");
  const [customerId, setCustomerId] = useState(customers[0]?.id || "");
  const [payment, setPayment] = useState("PIX");
  const [discount, setDiscount] = useState(0);
  const [amountPaid, setAmountPaid] = useState(0);
  const filtered = products.filter((product) => product.status === "Ativo" && `${product.name} ${product.sku}`.toLowerCase().includes(query.toLowerCase()));
  const finalTotal = Math.max(cartTotal - (Number(discount) || 0), 0);
  const change = payment === "Dinheiro" ? Math.max((Number(amountPaid) || 0) - finalTotal, 0) : 0;
  const insufficientCash = payment === "Dinheiro" && cart.length > 0 && (Number(amountPaid) || 0) < finalTotal;
  return <div><SectionTitle title="PDV / Frente de Caixa" subtitle="Venda com cliente, desconto, forma de pagamento, dinheiro e cálculo automático de troco." /><div className="grid gap-5 xl:grid-cols-[1.4fr_0.8fr]"><div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100"><div className="relative mb-4"><Search className="absolute left-4 top-3.5 text-slate-400" size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar produto por nome ou SKU..." className="w-full rounded-2xl border border-slate-200 py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-blue-500" /></div><div className="grid gap-3 md:grid-cols-2">{filtered.map((product) => <button key={product.id} onClick={() => addToCart(product)} className="text-left rounded-2xl border border-slate-100 p-4 hover:border-blue-300 hover:bg-blue-50"><div className="flex justify-between gap-3"><b>{product.name}</b><span className="font-bold text-blue-700">{currency(product.price)}</span></div><p className="text-xs text-slate-500">SKU {product.sku} • estoque {product.stock}</p></button>)}</div></div><div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100"><h3 className="font-bold flex items-center gap-2"><ShoppingCart size={18} /> Carrinho</h3><div className="mt-4 space-y-3 min-h-[170px]">{cart.length === 0 && <p className="text-sm text-slate-400">Nenhum produto adicionado.</p>}{cart.map((item) => <div key={item.productId} className="rounded-2xl bg-slate-50 p-4"><div className="flex justify-between gap-3"><b>{item.name}</b><button onClick={() => removeFromCart(item.productId)} className="text-red-600"><Trash2 size={16} /></button></div><div className="mt-2 flex items-center justify-between gap-3"><input type="number" min="1" value={item.qty} onChange={(e) => updateCartQty(item.productId, e.target.value)} className="w-20 rounded-xl border border-slate-200 px-3 py-2" /><p className="text-sm text-slate-500">{currency(item.qty * item.price)}</p></div></div>)}</div><div className="mt-5 border-t border-slate-100 pt-5 space-y-3"><Select label="Cliente" value={customerId} onChange={(e) => setCustomerId(e.target.value)}><option value="">Cliente não informado</option>{customers.filter((c) => c.status !== "Inativo").map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</Select><Select label="Forma de pagamento" value={payment} onChange={(e) => setPayment(e.target.value)}><option>PIX</option><option>Dinheiro</option><option>Cartão de débito</option><option>Cartão de crédito</option><option>Outros</option></Select><Input label="Desconto" type="number" value={discount} onChange={(e) => setDiscount(e.target.value)} />{payment === "Dinheiro" && <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 space-y-3"><Input label="Valor recebido em dinheiro" type="number" value={amountPaid} onChange={(e) => setAmountPaid(e.target.value)} /><div className="flex justify-between text-sm"><span>Valor recebido</span><b>{currency(amountPaid)}</b></div><div className="flex justify-between text-sm"><span>Troco</span><b className="text-emerald-700">{currency(change)}</b></div>{insufficientCash && <p className="text-sm font-medium text-red-600">Valor recebido menor que o total da venda.</p>}</div>}<div className="flex justify-between text-sm"><span>Subtotal</span><b>{currency(cartTotal)}</b></div><div className="flex justify-between text-sm"><span>Desconto</span><b>{currency(discount)}</b></div><div className="flex justify-between text-lg font-bold"><span>Total</span><span>{currency(finalTotal)}</span></div><button onClick={() => finishSale({ customerId, payment, discount, amountPaid, change })} disabled={insufficientCash} className="w-full rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 px-4 py-3 font-bold text-white shadow-lg shadow-emerald-700/20 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50">Finalizar venda</button></div></div></div></div>;
}

function Customers({ customers, saveCustomer, deleteCustomer, sales, exportCustomers, importCustomers }) {
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(emptyCustomer);
  const filtered = customers.filter((customer) => `${customer.name} ${customer.phone} ${customer.email}`.toLowerCase().includes(query.toLowerCase()));
  const openForm = (customer) => { setForm(customer ? { ...customer } : emptyCustomer); setModal(true); };
  const submit = async () => { if (await saveCustomer(form)) setModal(false); };

  return <div><SectionTitle title="Clientes" subtitle="Cadastro real, pesquisa, importação, exportação e histórico de relacionamento do cliente." actions={<div className="flex flex-wrap gap-2"><button onClick={exportCustomers} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50 flex items-center gap-2"><Download size={16} /> Exportar</button><label className="cursor-pointer rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50 flex items-center gap-2"><Upload size={16} /> Importar<input type="file" accept=".xml,application/xml,text/xml" className="hidden" onChange={(e) => { importCustomers(e.target.files?.[0]); e.target.value = ""; }} /></label></div>} /><Toolbar query={query} setQuery={setQuery} placeholder="Pesquisar cliente..." button="Novo cliente" onClick={() => openForm()} /><DataTable headers={["Cliente", "Contato", "Endereço", "Status", "Compras", "Ações"]}>{filtered.map((customer) => <tr key={customer.id} className="border-t border-slate-100 hover:bg-slate-50/70"><td className="p-4"><b>{customer.name}</b><p className="text-xs text-slate-500">{customer.email}</p></td><td className="p-4">{customer.phone}</td><td className="p-4">{customer.address}</td><td className="p-4"><Badge tone={customer.status === "Inativo" ? "slate" : "blue"}>{customer.status}</Badge></td><td className="p-4">{sales.filter((sale) => sale.customerId === customer.id).length}</td><td className="p-4"><div className="flex gap-3"><button onClick={() => openForm(customer)} className="rounded-xl bg-blue-50 p-2 text-blue-700 hover:bg-blue-100"><Edit3 size={18} /></button><button onClick={() => deleteCustomer(customer.id)} className="rounded-xl bg-red-50 p-2 text-red-600 hover:bg-red-100"><Trash2 size={18} /></button></div></td></tr>)}</DataTable>{modal && <Modal title={form.id ? "Editar cliente" : "Cadastrar cliente"} onClose={() => setModal(false)}><CustomerForm form={form} setForm={setForm} onSubmit={submit} /></Modal>}</div>;
}

function CustomerForm({ form, setForm, onSubmit }) {
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  return <div className="grid gap-4 md:grid-cols-2"><Input label="Nome completo" value={form.name} onChange={(e) => update("name", e.target.value)} /><Input label="CPF/CNPJ" value={form.document} onChange={(e) => update("document", e.target.value)} /><Input label="Telefone" value={form.phone} onChange={(e) => update("phone", e.target.value)} /><Input label="E-mail" value={form.email} onChange={(e) => update("email", e.target.value)} /><Input label="Endereço" value={form.address} onChange={(e) => update("address", e.target.value)} /><Input label="Data de nascimento" type="date" value={form.birthday} onChange={(e) => update("birthday", e.target.value)} /><Select label="Status" value={form.status} onChange={(e) => update("status", e.target.value)}><option>Novo</option><option>Ativo</option><option>Recorrente</option><option>Inativo</option></Select><Input label="Observações" value={form.notes} onChange={(e) => update("notes", e.target.value)} /><div className="md:col-span-2 flex justify-end"><button onClick={onSubmit} className="rounded-2xl bg-gradient-to-r from-blue-700 to-blue-600 px-5 py-3 font-bold text-white shadow-lg shadow-blue-700/20 transition hover:scale-[1.01] hover:shadow-blue-700/30 flex items-center gap-2"><Save size={18} /> Salvar cliente</button></div></div>;
}

function Suppliers({ suppliers, saveSupplier, deleteSupplier, exportSuppliers, importSuppliers }) {
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(emptySupplier);
  const filtered = suppliers.filter((supplier) => `${supplier.name} ${supplier.document} ${supplier.category} ${supplier.suppliedItems}`.toLowerCase().includes(query.toLowerCase()));
  const openForm = (supplier) => { setForm(supplier ? { ...supplier } : emptySupplier); setModal(true); };
  const submit = async () => { if (await saveSupplier(form)) setModal(false); };

  return <div><SectionTitle title="Fornecedores" subtitle="Cadastro de fornecedores, contatos comerciais, produtos fornecidos, importação e exportação." actions={<div className="flex flex-wrap gap-2"><button onClick={exportSuppliers} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50 flex items-center gap-2"><Download size={16} /> Exportar</button><label className="cursor-pointer rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50 flex items-center gap-2"><Upload size={16} /> Importar<input type="file" accept=".xml,application/xml,text/xml" className="hidden" onChange={(e) => { importSuppliers(e.target.files?.[0]); e.target.value = ""; }} /></label></div>} /><Toolbar query={query} setQuery={setQuery} placeholder="Pesquisar fornecedor, CNPJ, categoria ou item fornecido..." button="Novo fornecedor" onClick={() => openForm()} /><DataTable headers={["Fornecedor", "CNPJ", "Contato", "Categoria", "Fornece", "Status", "Ações"]}>{filtered.map((supplier) => <tr key={supplier.id} className="border-t border-slate-100 hover:bg-slate-50/70"><td className="p-4"><b>{supplier.name}</b><p className="text-xs text-slate-500">{supplier.email}</p></td><td className="p-4">{supplier.document}</td><td className="p-4">{supplier.phone}</td><td className="p-4">{supplier.category}</td><td className="p-4 text-sm text-slate-600">{supplier.suppliedItems}</td><td className="p-4"><Badge tone={supplier.status === "Ativo" ? "green" : "slate"}>{supplier.status}</Badge></td><td className="p-4"><div className="flex gap-3"><button onClick={() => openForm(supplier)} className="rounded-xl bg-blue-50 p-2 text-blue-700 hover:bg-blue-100"><Edit3 size={18} /></button><button onClick={() => deleteSupplier(supplier.id)} className="rounded-xl bg-red-50 p-2 text-red-600 hover:bg-red-100"><Trash2 size={18} /></button></div></td></tr>)}</DataTable>{modal && <Modal title={form.id ? "Editar fornecedor" : "Cadastrar fornecedor"} onClose={() => setModal(false)}><SupplierForm form={form} setForm={setForm} onSubmit={submit} /></Modal>}</div>;
}

function SupplierForm({ form, setForm, onSubmit }) {
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  return <div className="grid gap-4 md:grid-cols-2"><Input label="Nome do fornecedor" value={form.name} onChange={(e) => update("name", e.target.value)} /><Input label="CNPJ/Documento" value={form.document} onChange={(e) => update("document", e.target.value)} /><Input label="Telefone" value={form.phone} onChange={(e) => update("phone", e.target.value)} /><Input label="E-mail" value={form.email} onChange={(e) => update("email", e.target.value)} /><Input label="Categoria" value={form.category} onChange={(e) => update("category", e.target.value)} /><Input label="Produtos/serviços fornecidos" value={form.suppliedItems} onChange={(e) => update("suppliedItems", e.target.value)} /><Input label="Endereço" value={form.address} onChange={(e) => update("address", e.target.value)} /><Select label="Status" value={form.status} onChange={(e) => update("status", e.target.value)}><option>Ativo</option><option>Inativo</option><option>Em avaliação</option></Select><div className="md:col-span-2"><Input label="Observações" value={form.notes} onChange={(e) => update("notes", e.target.value)} /></div><div className="md:col-span-2 flex justify-end"><button onClick={onSubmit} className="rounded-2xl bg-gradient-to-r from-blue-700 to-blue-600 px-5 py-3 font-bold text-white shadow-lg shadow-blue-700/20 transition hover:scale-[1.01] hover:shadow-blue-700/30 flex items-center gap-2"><Save size={18} /> Salvar fornecedor</button></div></div>;
}

function Settings({ companySettings, setCompanySettings, showToast }) {
  const [form, setForm] = useState(companySettings);
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const saveSettings = () => {
    setCompanySettings(form);
    showToast("Configurações da empresa salvas com sucesso.");
  };

  return <div><SectionTitle title="Configurações da Empresa" subtitle="Personalize os dados da empresa que aparecem no comprovante e na apresentação do sistema." /><div className="rounded-[1.75rem] border border-white/70 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.07)] backdrop-blur"><div className="grid gap-4 md:grid-cols-2"><Input label="Nome da empresa" value={form.companyName} onChange={(e) => update("companyName", e.target.value)} /><Input label="Nome fantasia" value={form.fantasyName} onChange={(e) => update("fantasyName", e.target.value)} /><Input label="CNPJ" value={form.document} onChange={(e) => update("document", e.target.value)} /><Input label="Telefone" value={form.phone} onChange={(e) => update("phone", e.target.value)} /><Input label="E-mail" value={form.email} onChange={(e) => update("email", e.target.value)} /><Input label="Cidade/UF" value={form.cityState} onChange={(e) => update("cityState", e.target.value)} /><div className="md:col-span-2"><Input label="Endereço" value={form.address} onChange={(e) => update("address", e.target.value)} /></div><div className="md:col-span-2"><Input label="Texto do rodapé do comprovante" value={form.receiptFooter} onChange={(e) => update("receiptFooter", e.target.value)} /></div></div><div className="mt-6 flex justify-end"><button onClick={saveSettings} className="rounded-2xl bg-gradient-to-r from-blue-700 to-blue-600 px-5 py-3 font-bold text-white shadow-lg shadow-blue-700/20 transition hover:scale-[1.01] hover:shadow-blue-700/30 flex items-center gap-2"><Save size={18} /> Salvar configurações</button></div></div><div className="mt-6 rounded-[1.75rem] border border-blue-100 bg-blue-50 p-6 text-blue-900"><p className="text-sm font-semibold">Prévia dos dados no comprovante</p><h3 className="mt-2 text-2xl font-black">{form.companyName}</h3><p className="text-sm">{form.fantasyName}</p><p className="mt-2 text-sm">CNPJ: {form.document}</p><p className="text-sm">Telefone: {form.phone} • E-mail: {form.email}</p><p className="text-sm">{form.address} — {form.cityState}</p><p className="mt-3 text-sm font-semibold">{form.receiptFooter}</p></div></div>;
}

function CRM({ customers, sales }) {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const selectedSales = selectedCustomer ? sales.filter((sale) => sale.customerId === selectedCustomer.id) : [];

  return <div><SectionTitle title="CRM" subtitle="Análise do relacionamento, frequência, oportunidades e histórico de compras dos clientes." /><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{customers.map((customer) => { const customerSales = sales.filter((sale) => sale.customerId === customer.id && sale.status === "Concluída"); const total = customerSales.reduce((sum, sale) => sum + getSaleTotal(sale), 0); return <div key={customer.id} className="rounded-[1.75rem] border border-white/70 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.07)] backdrop-blur transition hover:-translate-y-1"><div className="flex items-start justify-between gap-3"><div><h3 className="font-black text-slate-950">{customer.name}</h3><p className="text-sm text-slate-500">{customer.phone}</p></div><Badge tone={customer.status === "Recorrente" ? "green" : customer.status === "Inativo" ? "slate" : "blue"}>{customer.status}</Badge></div><div className="mt-5 grid grid-cols-2 gap-3"><div className="rounded-2xl bg-slate-50 p-3"><p className="text-xs text-slate-500">Compras</p><b>{customerSales.length}</b></div><div className="rounded-2xl bg-slate-50 p-3"><p className="text-xs text-slate-500">Total</p><b>{currency(total)}</b></div></div><p className="mt-4 text-sm text-slate-500">{customer.notes || "Sem observações."}</p>{customerSales.length === 0 ? <p className="mt-3 text-sm font-semibold text-amber-600">Oportunidade: cliente sem compra recente.</p> : <p className="mt-3 text-sm font-semibold text-emerald-600">Cliente com histórico de compra.</p>}<button onClick={() => setSelectedCustomer(customer)} className="mt-5 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50 flex items-center justify-center gap-2"><Eye size={16} /> Visualizar histórico de compras</button></div>; })}</div>{selectedCustomer && <Modal title={`Histórico de compras — ${selectedCustomer.name}`} onClose={() => setSelectedCustomer(null)}>{selectedSales.length === 0 ? <div className="rounded-2xl bg-amber-50 p-5 text-sm font-semibold text-amber-700">Este cliente ainda não possui compras registradas.</div> : <div className="space-y-3">{selectedSales.map((sale) => <div key={sale.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4"><div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between"><div><b className="text-slate-950">Venda #{sale.id}</b><p className="text-xs text-slate-500">{sale.date} • {sale.payment} • {sale.status}</p></div><Badge tone={sale.status === "Concluída" ? "green" : "red"}>{currency(getSaleTotal(sale))}</Badge></div><div className="mt-3 text-sm text-slate-600">{sale.items.map((item) => <p key={`${sale.id}-${item.productId}`}>{item.qty}x {item.name} — {currency(item.price)}</p>)}</div>{sale.payment === "Dinheiro" && <div className="mt-3 rounded-xl bg-white p-3 text-sm text-slate-600"><p>Recebido: <b>{currency(sale.amountPaid)}</b></p><p>Troco: <b>{currency(sale.change)}</b></p></div>}</div>)}</div>}</Modal>}</div>;
}

function formatDateTime(value) {
  if (!value) return "—";
  return new Date(value).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}

function Sales({ sales, cancelSale }) {
  const [selectedSale, setSelectedSale] = useState(null);
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [paymentFilter, setPaymentFilter] = useState("Todas");
  const [customerFilter, setCustomerFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const filteredSales = sales.filter((sale) => {
    const statusOk = statusFilter === "Todos" || sale.status === statusFilter;
    const paymentOk = paymentFilter === "Todas" || sale.payment === paymentFilter;
    const customerOk = !customerFilter || (sale.customerName || "").toLowerCase().includes(customerFilter.toLowerCase());
    const dateOk = !dateFilter || sale.date === dateFilter;
    return statusOk && paymentOk && customerOk && dateOk;
  });

  const clearFilters = () => {
    setStatusFilter("Todos");
    setPaymentFilter("Todas");
    setCustomerFilter("");
    setDateFilter("");
  };

  return <div><SectionTitle title="Histórico de Vendas" subtitle="Consulta de vendas com filtros por status, forma de pagamento, cliente, data e auditoria de cancelamento." actions={<button onClick={clearFilters} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50">Limpar filtros</button>} /><div className="mb-5 grid gap-3 rounded-[1.75rem] border border-white/70 bg-white/90 p-4 shadow-[0_20px_60px_rgba(15,23,42,0.07)] backdrop-blur md:grid-cols-4"><Select label="Status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}><option>Todos</option><option>Concluída</option><option>Cancelada</option></Select><Select label="Pagamento" value={paymentFilter} onChange={(e) => setPaymentFilter(e.target.value)}><option>Todas</option><option>PIX</option><option>Dinheiro</option><option>Cartão de débito</option><option>Cartão de crédito</option><option>Outros</option></Select><Input label="Cliente" value={customerFilter} onChange={(e) => setCustomerFilter(e.target.value)} placeholder="Buscar por cliente" /><Input label="Data" type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} /></div><DataTable headers={["Venda", "Data", "Cliente", "Itens", "Pagamento", "Recebido", "Troco", "Desconto", "Total", "Status", "Cancelamento", "Ações"]}>{filteredSales.map((sale) => <tr key={sale.id} className="border-t border-slate-100 hover:bg-slate-50/70"><td className="p-4 font-bold">#{sale.id}</td><td className="p-4">{sale.date}</td><td className="p-4">{sale.customerName || "Não informado"}</td><td className="p-4 text-sm">{sale.items.map((item) => `${item.qty}x ${item.name}`).join(", ")}</td><td className="p-4">{sale.payment}</td><td className="p-4">{sale.payment === "Dinheiro" ? currency(sale.amountPaid) : "—"}</td><td className="p-4">{sale.payment === "Dinheiro" ? currency(sale.change) : "—"}</td><td className="p-4">{currency(sale.discount)}</td><td className="p-4 font-bold">{currency(getSaleTotal(sale))}</td><td className="p-4"><Badge tone={sale.status === "Concluída" ? "green" : "red"}>{sale.status}</Badge></td><td className="p-4 text-xs text-slate-500">{sale.status === "Cancelada" ? <div><b className="text-slate-700">{sale.canceledBy || "Administrador"}</b><p>{formatDateTime(sale.canceledAt)}</p></div> : "—"}</td><td className="p-4"><div className="flex gap-2"><button onClick={() => setSelectedSale(sale)} className="rounded-xl bg-blue-50 p-2 text-blue-700 hover:bg-blue-100" title="Ver detalhes"><Eye size={18} /></button><button disabled={sale.status === "Cancelada"} onClick={() => cancelSale(sale)} className="rounded-xl bg-red-50 px-3 py-2 text-sm font-bold text-red-700 disabled:opacity-40">Cancelar</button></div></td></tr>)}</DataTable>{filteredSales.length === 0 && <div className="mt-4 rounded-2xl bg-amber-50 p-4 text-sm font-semibold text-amber-700">Nenhuma venda encontrada com os filtros selecionados.</div>}{selectedSale && <SaleDetailsModal sale={selectedSale} onClose={() => setSelectedSale(null)} />}</div>;
}

function SaleDetailsModal({ sale, onClose }) {
  const subtotal = sale.items.reduce((sum, item) => sum + Number(item.qty) * Number(item.price), 0);

  return (
    <Modal title={`Detalhes da venda #${sale.id}`} onClose={onClose}>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Cliente</p>
          <h3 className="mt-1 font-black text-slate-950">{sale.customerName || "Cliente não informado"}</h3>
          <p className="mt-1 text-sm text-slate-500">Data da venda: {sale.date}</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Status</p>
          <div className="mt-2 flex items-center gap-2"><Badge tone={sale.status === "Concluída" ? "green" : "red"}>{sale.status}</Badge><Badge tone="blue">{sale.payment}</Badge></div>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-slate-100 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-950 text-white"><tr><th className="p-3">Item</th><th className="p-3">Qtd.</th><th className="p-3">Valor</th><th className="p-3">Subtotal</th></tr></thead>
          <tbody className="divide-y divide-slate-100">
            {sale.items.map((item) => <tr key={`${sale.id}-${item.productId}`}><td className="p-3 font-semibold">{item.name}</td><td className="p-3">{item.qty}</td><td className="p-3">{currency(item.price)}</td><td className="p-3 font-bold">{currency(item.qty * item.price)}</td></tr>)}
          </tbody>
        </table>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl bg-blue-50 p-4 text-blue-800"><p className="text-sm">Subtotal</p><b className="text-xl">{currency(subtotal)}</b></div>
        <div className="rounded-2xl bg-amber-50 p-4 text-amber-800"><p className="text-sm">Desconto</p><b className="text-xl">{currency(sale.discount)}</b></div>
        <div className="rounded-2xl bg-emerald-50 p-4 text-emerald-800"><p className="text-sm">Total</p><b className="text-xl">{currency(getSaleTotal(sale))}</b></div>
        <div className="rounded-2xl bg-slate-50 p-4 text-slate-700"><p className="text-sm">Recebido / Troco</p><b className="text-xl">{sale.payment === "Dinheiro" ? `${currency(sale.amountPaid)} / ${currency(sale.change)}` : "—"}</b></div>
      </div>

      {sale.status === "Cancelada" && <div className="mt-5 rounded-2xl bg-red-50 p-4 text-red-800"><p className="text-sm font-semibold">Registro de cancelamento</p><p className="mt-1 text-sm">Cancelado por: <b>{sale.canceledBy || "Administrador"}</b></p><p className="text-sm">Data e hora: <b>{formatDateTime(sale.canceledAt)}</b></p></div>}
    </Modal>
  );
}

function ReceiptModal({ sale, companySettings, operatorName, onClose }) {
  const subtotal = sale.items.reduce((sum, item) => sum + Number(item.qty) * Number(item.price), 0);

  const getReceiptHtml = () => `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Comprovante Venda ${sale.id}</title>
        <style>
          * { box-sizing: border-box; }
          body { font-family: Arial, sans-serif; margin: 0; padding: 24px; color: #0f172a; background: #f8fafc; }
          .receipt { max-width: 760px; margin: 0 auto; background: white; border-radius: 24px; padding: 32px; border: 1px solid #e2e8f0; }
          .header { display: flex; justify-content: space-between; gap: 24px; border-bottom: 1px solid #e2e8f0; padding-bottom: 20px; }
          .tag { color: #1d4ed8; font-size: 11px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; }
          h1 { margin: 6px 0 4px; font-size: 26px; }
          .muted { color: #64748b; font-size: 13px; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 20px; }
          .box { background: #f8fafc; border-radius: 16px; padding: 14px; border: 1px solid #eef2f7; }
          .box span { display: block; color: #64748b; font-size: 12px; margin-bottom: 4px; }
          table { width: 100%; border-collapse: collapse; margin-top: 22px; overflow: hidden; border-radius: 14px; }
          th { background: #0f172a; color: white; text-align: left; padding: 12px; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; }
          td { padding: 12px; border-bottom: 1px solid #e2e8f0; font-size: 14px; }
          .totals { margin-top: 22px; background: #0f172a; color: white; border-radius: 18px; padding: 18px; }
          .row { display: flex; justify-content: space-between; margin: 8px 0; color: #cbd5e1; }
          .total { display: flex; justify-content: space-between; border-top: 1px solid rgba(255,255,255,.15); margin-top: 14px; padding-top: 14px; font-size: 24px; font-weight: 900; color: white; }
          .thanks { text-align: center; color: #64748b; margin-top: 18px; font-size: 12px; }
          @media print { body { background: white; padding: 0; } .receipt { border: none; box-shadow: none; } }
        </style>
      </head>
      <body>
        <section class="receipt">
          <div class="header">
            <div>
              <div class="tag">Comprovante de venda</div>
              <h1>${escaparXml(companySettings.companyName)}</h1>
              <div class="muted">${escaparXml(companySettings.fantasyName)} • CNPJ: ${escaparXml(companySettings.document)}</div>
              <div class="muted">${escaparXml(companySettings.phone)} • ${escaparXml(companySettings.email)}</div>
              <div class="muted">${escaparXml(companySettings.address)} — ${escaparXml(companySettings.cityState)}</div>
            </div>
            <div style="text-align:right">
              <strong>Venda #${sale.id}</strong><br />
              <span class="muted">${sale.date}</span>
            </div>
          </div>
          <div class="grid">
            <div class="box"><span>Cliente</span><strong>${sale.customerName || "Cliente não informado"}</strong></div>
            <div class="box"><span>Forma de pagamento</span><strong>${sale.payment}</strong></div>
            <div class="box"><span>Operador</span><strong>${escaparXml(operatorName)}</strong></div>
          </div>
          <table>
            <thead><tr><th>Item</th><th>Qtd.</th><th>Valor</th><th>Subtotal</th></tr></thead>
            <tbody>
              ${sale.items.map((item) => `<tr><td>${item.name}</td><td>${item.qty}</td><td>${currency(item.price)}</td><td><strong>${currency(item.qty * item.price)}</strong></td></tr>`).join("")}
            </tbody>
          </table>
          <div class="totals">
            <div class="row"><span>Subtotal</span><span>${currency(subtotal)}</span></div>
            <div class="row"><span>Desconto</span><span>${currency(sale.discount)}</span></div>
            ${sale.payment === "Dinheiro" ? `<div class="row"><span>Valor recebido</span><span>${currency(sale.amountPaid)}</span></div><div class="row"><span>Troco</span><span>${currency(sale.change)}</span></div>` : ""}
            <div class="total"><span>Total</span><span>${currency(getSaleTotal(sale))}</span></div>
          </div>
          <p class="thanks">${escaparXml(companySettings.receiptFooter)}</p>
        </section>
        <script>window.onload = () => window.print();</script>
      </body>
    </html>
  `;

  const printReceipt = () => {
    const printWindow = window.open("", "_blank", "width=900,height=700");
    if (!printWindow) return;
    printWindow.document.open();
    printWindow.document.write(getReceiptHtml());
    printWindow.document.close();
  };

  return (
    <Modal title={`Comprovante da venda #${sale.id}`} onClose={onClose}>
      <div className="print:bg-white" id="comprovante-venda">
        <div className="rounded-[1.75rem] border border-slate-100 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-700">Comprovante</p>
              <h2 className="mt-1 text-2xl font-black text-slate-950">{companySettings.companyName}</h2>
              <p className="mt-1 text-sm text-slate-500">{companySettings.fantasyName} • CNPJ: {companySettings.document}</p>
              <p className="text-sm text-slate-500">{companySettings.phone} • {companySettings.email}</p>
              <p className="text-sm text-slate-500">{companySettings.address} — {companySettings.cityState}</p>
            </div>
            <div className="text-right text-sm text-slate-500"><p>Venda #{sale.id}</p><p>{sale.date}</p></div>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-3"><div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs text-slate-400">Cliente</p><b>{sale.customerName || "Cliente não informado"}</b></div><div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs text-slate-400">Pagamento</p><b>{sale.payment}</b></div><div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs text-slate-400">Operador</p><b>{operatorName}</b></div></div>
          <div className="mt-5 space-y-3">{sale.items.map((item) => <div key={`${sale.id}-recibo-${item.productId}`} className="flex items-center justify-between rounded-2xl border border-slate-100 p-4"><div><b>{item.name}</b><p className="text-xs text-slate-500">{item.qty} x {currency(item.price)}</p></div><b>{currency(item.qty * item.price)}</b></div>)}</div>
          <div className="mt-5 rounded-2xl bg-slate-950 p-5 text-white"><div className="flex justify-between text-sm text-slate-300"><span>Subtotal</span><span>{currency(subtotal)}</span></div><div className="mt-2 flex justify-between text-sm text-slate-300"><span>Desconto</span><span>{currency(sale.discount)}</span></div>{sale.payment === "Dinheiro" && <><div className="mt-2 flex justify-between text-sm text-slate-300"><span>Valor recebido</span><span>{currency(sale.amountPaid)}</span></div><div className="mt-2 flex justify-between text-sm text-slate-300"><span>Troco</span><span>{currency(sale.change)}</span></div></>}<div className="mt-4 flex justify-between border-t border-white/10 pt-4 text-2xl font-black"><span>Total</span><span>{currency(getSaleTotal(sale))}</span></div></div>
          <p className="mt-5 text-center text-xs text-slate-400">{companySettings.receiptFooter}</p>
        </div>
      </div>
      <div className="mt-6 flex flex-col gap-3 md:flex-row md:justify-end"><button onClick={printReceipt} className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50 flex items-center justify-center gap-2"><Printer size={16} /> Imprimir comprovante</button><button onClick={printReceipt} className="rounded-2xl border border-blue-200 bg-blue-50 px-5 py-3 text-sm font-bold text-blue-700 shadow-sm hover:bg-blue-100 flex items-center justify-center gap-2"><Download size={16} /> Baixar PDF</button><button onClick={onClose} className="rounded-2xl bg-gradient-to-r from-blue-700 to-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-700/20">Nova venda</button></div>
    </Modal>
  );
}

function Reports({ sales, products, customers, productSales, paymentData, salesByDay }) {
  const [period, setPeriod] = useState("all");

  const filteredSales = useMemo(() => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const sevenDaysAgo = new Date(startOfToday);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    return sales.filter((sale) => {
      const saleDate = new Date(`${sale.date}T00:00:00`);
      if (period === "today") return saleDate >= startOfToday;
      if (period === "7days") return saleDate >= sevenDaysAgo;
      if (period === "month") return saleDate >= startOfMonth;
      return true;
    });
  }, [sales, period]);

  const completedSales = filteredSales.filter((sale) => sale.status === "Concluída");
  const canceledSales = filteredSales.filter((sale) => sale.status === "Cancelada");
  const total = completedSales.reduce((sum, sale) => sum + getSaleTotal(sale), 0);
  const ticketMedio = completedSales.length ? total / completedSales.length : 0;

  const productMap = {};
  completedSales.forEach((sale) => sale.items.forEach((item) => { productMap[item.name] = (productMap[item.name] || 0) + Number(item.qty); }));
  const produtoMaisVendido = Object.entries(productMap).sort((a, b) => b[1] - a[1])[0];

  const customerMap = {};
  completedSales.forEach((sale) => {
    const name = sale.customerName || "Cliente não informado";
    customerMap[name] = (customerMap[name] || 0) + getSaleTotal(sale);
  });
  const clienteMaisComprou = Object.entries(customerMap).sort((a, b) => b[1] - a[1])[0];

  const filteredSalesByDay = useMemo(() => {
    const dayMap = {};
    completedSales.forEach((sale) => { dayMap[sale.date.slice(5)] = (dayMap[sale.date.slice(5)] || 0) + getSaleTotal(sale); });
    return Object.entries(dayMap).map(([date, total]) => ({ date, total })).sort((a, b) => a.date.localeCompare(b.date));
  }, [completedSales]);

  const filteredProductSales = useMemo(() => Object.entries(productMap).map(([name, qty]) => ({ name, qty })).sort((a, b) => b.qty - a.qty).slice(0, 6), [completedSales]);

  const filteredPaymentData = useMemo(() => {
    const paymentMap = {};
    completedSales.forEach((sale) => { paymentMap[sale.payment] = (paymentMap[sale.payment] || 0) + getSaleTotal(sale); });
    return Object.entries(paymentMap).map(([name, value]) => ({ name, value }));
  }, [completedSales]);

  const produtosComMargem = products.map((product) => {
    const lucro = Number(product.price) - Number(product.cost);
    const margem = Number(product.price) > 0 ? (lucro / Number(product.price)) * 100 : 0;
    return { ...product, lucro, margem };
  }).sort((a, b) => b.margem - a.margem).slice(0, 5);

  return <div><SectionTitle title="Relatórios Avançados" subtitle="Indicadores gerenciais com filtro por período, ticket médio, rankings e análise de margem de lucro." actions={<Select label="Período" value={period} onChange={(e) => setPeriod(e.target.value)}><option value="all">Todas as vendas</option><option value="today">Hoje</option><option value="7days">Últimos 7 dias</option><option value="month">Este mês</option></Select>} /><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"><StatCard title="Receita filtrada" value={currency(total)} icon={Wallet} caption="Somente vendas concluídas" /><StatCard title="Ticket médio" value={currency(ticketMedio)} icon={Receipt} caption="Receita ÷ vendas concluídas" /><StatCard title="Vendas concluídas" value={completedSales.length} icon={CreditCard} caption="No período selecionado" /><StatCard title="Vendas canceladas" value={canceledSales.length} icon={Boxes} caption="Controle operacional" /></div><div className="mt-5 grid gap-4 md:grid-cols-2"><div className="rounded-[1.75rem] border border-white/70 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.07)]"><p className="text-sm font-semibold text-slate-500">Produto mais vendido</p><h3 className="mt-2 text-2xl font-black text-slate-950">{produtoMaisVendido ? produtoMaisVendido[0] : "Sem vendas"}</h3><p className="mt-1 text-sm text-slate-500">{produtoMaisVendido ? `${produtoMaisVendido[1]} unidade(s) vendida(s)` : "Nenhum produto vendido no período"}</p></div><div className="rounded-[1.75rem] border border-white/70 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.07)]"><p className="text-sm font-semibold text-slate-500">Cliente que mais comprou</p><h3 className="mt-2 text-2xl font-black text-slate-950">{clienteMaisComprou ? clienteMaisComprou[0] : "Sem cliente"}</h3><p className="mt-1 text-sm text-slate-500">{clienteMaisComprou ? currency(clienteMaisComprou[1]) : "Nenhuma compra no período"}</p></div></div><div className="mt-6 grid gap-5 xl:grid-cols-2"><ChartCard title="Vendas por período"><ResponsiveContainer width="100%" height={270}><BarChart data={filteredSalesByDay}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="date" /><YAxis /><Tooltip formatter={(value) => currency(value)} /><Bar dataKey="total" fill="#2563eb" radius={[10, 10, 0, 0]} /></BarChart></ResponsiveContainer></ChartCard><ChartCard title="Produtos mais vendidos"><ResponsiveContainer width="100%" height={270}><BarChart data={filteredProductSales}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis /><Tooltip /><Bar dataKey="qty" fill="#059669" radius={[10, 10, 0, 0]} /></BarChart></ResponsiveContainer></ChartCard></div><div className="mt-6 grid gap-5 xl:grid-cols-2"><div className="rounded-[1.75rem] border border-white/70 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.07)]"><h3 className="mb-4 font-black text-slate-950">Margem de lucro dos produtos</h3><div className="space-y-3">{produtosComMargem.map((product) => <div key={product.id} className="flex items-center justify-between rounded-2xl bg-slate-50 p-4"><div><b>{product.name}</b><p className="text-xs text-slate-500">Custo {currency(product.cost)} • Venda {currency(product.price)}</p></div><Badge tone={product.lucro >= 0 ? "green" : "red"}>{currency(product.lucro)} • {product.margem.toFixed(1)}%</Badge></div>)}</div></div><div className="rounded-[1.75rem] border border-white/70 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.07)]"><h3 className="font-black mb-4 text-slate-950">Vendas por forma de pagamento</h3><div className="grid gap-3 md:grid-cols-2">{filteredPaymentData.map((payment) => <div key={payment.name} className="rounded-2xl bg-slate-50 p-4"><p className="text-sm text-slate-500">{payment.name}</p><b>{currency(payment.value)}</b></div>)}{filteredPaymentData.length === 0 && <p className="text-sm text-slate-400">Nenhuma venda concluída no período selecionado.</p>}</div></div></div></div>;
}

export default App;

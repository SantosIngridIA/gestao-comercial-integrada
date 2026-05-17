# 📊 Gestão Comercial Integrada

Sistema Web Integrado de Gestão Comercial desenvolvido para auxiliar pequenos negócios no controle de produtos, clientes, fornecedores, vendas, estoque, CRM, relatórios gerenciais e emissão de comprovantes.

Projeto desenvolvido como parte do **Projeto Integrador da UNIVESP**, utilizando tecnologias modernas de desenvolvimento web e integração com banco de dados online.

🔗 **Acesse o sistema publicado:**  
https://santosingridia.github.io/gestao-comercial-integrada/

---

## 📌 Sobre o Projeto

O **Gestão Comercial Integrada** é uma aplicação web criada para centralizar processos comerciais comuns em pequenos negócios.

O sistema reúne em uma única plataforma funcionalidades como cadastro de produtos, clientes e fornecedores, controle de estoque, PDV com cálculo de troco, histórico de vendas, CRM, emissão de comprovante personalizado, importação/exportação em Excel XML e dashboard gerencial com indicadores estratégicos.

A aplicação também possui integração com **Supabase/PostgreSQL**, permitindo persistência online de produtos, clientes, vendas, itens da venda e movimentações de estoque.

---

## 🎯 Objetivo

O objetivo do projeto é oferecer uma solução simples, funcional e integrada para pequenos empreendedores que precisam organizar suas rotinas comerciais.

O sistema busca reduzir controles manuais e descentralizados, como planilhas separadas ou anotações em papel, oferecendo uma plataforma única para:

- Controle de produtos;
- Controle de clientes;
- Controle de fornecedores;
- Registro de vendas;
- Baixa automática no estoque;
- Consulta de histórico de vendas;
- Acompanhamento de clientes por CRM;
- Emissão de comprovantes;
- Análise de indicadores comerciais;
- Importação e exportação de dados.

---

## 🧩 Funcionalidades

### 🔐 Login de Acesso

- Tela inicial com visual moderno;
- Acesso administrativo ao painel;
- Login visual para apresentação acadêmica.

---

### 📊 Dashboard Gerencial Unificado

O Dashboard Gerencial centraliza os principais indicadores do sistema.

Funcionalidades:

- Receita filtrada;
- Vendas do dia;
- Vendas do mês;
- Ticket médio;
- Vendas concluídas;
- Vendas canceladas;
- Produtos cadastrados;
- Clientes cadastrados;
- Produtos com baixo estoque;
- Valor em estoque;
- Produto destaque;
- Cliente destaque;
- Filtro por período:
  - Todas as vendas;
  - Hoje;
  - Últimos 7 dias;
  - Este mês;
- Gráfico de vendas por período;
- Gráfico de produtos mais vendidos;
- Gráfico por forma de pagamento;
- Análise de margem de lucro dos produtos.

---

### 📦 Cadastro de Produtos

A seção de produtos permite o gerenciamento completo dos itens comercializados.

Funcionalidades:

- Cadastro de produtos;
- Edição de produtos;
- Pesquisa por nome, SKU ou categoria;
- Cadastro de SKU/código;
- Categoria;
- Descrição;
- Preço de custo;
- Preço de venda;
- Estoque atual;
- Estoque mínimo;
- Status: Ativo ou Inativo;
- Cálculo automático de lucro por unidade;
- Cálculo automático da margem de lucro;
- Alerta de estoque baixo;
- Importação em Excel XML;
- Exportação em Excel XML;
- Integração com Supabase.

---

### 👥 Cadastro de Clientes

A seção de clientes permite organizar a base de relacionamento do negócio.

Funcionalidades:

- Cadastro de clientes;
- Edição de clientes;
- Pesquisa por nome, telefone ou e-mail;
- CPF/CNPJ;
- Telefone;
- E-mail;
- Endereço;
- Data de nascimento;
- Observações;
- Status:
  - Novo;
  - Ativo;
  - Recorrente;
  - Inativo;
- Importação em Excel XML;
- Exportação em Excel XML;
- Integração com Supabase.

---

### 🚚 Cadastro de Fornecedores

A seção de fornecedores permite registrar parceiros comerciais e fornecedores de produtos ou serviços.

Funcionalidades:

- Cadastro de fornecedores;
- Edição de fornecedores;
- Exclusão de fornecedores;
- Pesquisa por nome, CNPJ, categoria ou item fornecido;
- CNPJ/documento;
- Telefone;
- E-mail;
- Categoria;
- Produtos/serviços fornecidos;
- Endereço;
- Observações;
- Status:
  - Ativo;
  - Inativo;
  - Em avaliação;
- Importação em Excel XML;
- Exportação em Excel XML.

---

### 🧾 PDV / Frente de Caixa

O módulo de PDV permite registrar vendas de forma prática.

Funcionalidades:

- Pesquisa de produtos;
- Adição de produtos ao carrinho;
- Alteração de quantidade;
- Remoção de itens do carrinho;
- Seleção de cliente;
- Seleção da forma de pagamento;
- Aplicação de desconto;
- Finalização de venda;
- Baixa automática no estoque;
- Registro da venda no histórico;
- Integração da venda com Supabase.

---

### 💵 Pagamento em Dinheiro e Cálculo de Troco

Quando a forma de pagamento selecionada é dinheiro, o sistema calcula automaticamente o troco.

Funcionalidades:

- Campo para valor recebido;
- Cálculo automático do troco;
- Bloqueio da venda quando o valor recebido é menor que o total;
- Registro do valor recebido;
- Registro do troco no histórico da venda;
- Exibição do valor recebido e troco no comprovante.

---

### 🧾 Comprovante Personalizado

Após finalizar uma venda, o sistema gera automaticamente um comprovante.

Funcionalidades:

- Número da venda;
- Data;
- Cliente;
- Operador;
- Forma de pagamento;
- Itens vendidos;
- Quantidade;
- Valor unitário;
- Subtotal;
- Desconto;
- Valor recebido;
- Troco;
- Total;
- Dados personalizados da empresa;
- Texto personalizado no rodapé;
- Impressão do comprovante;
- Opção de salvar como PDF pelo navegador.

---

### ⚙️ Configurações da Empresa

A seção de configurações permite personalizar os dados da empresa utilizados no comprovante.

Campos disponíveis:

- Nome da empresa;
- Nome fantasia;
- CNPJ;
- Telefone;
- E-mail;
- Endereço;
- Cidade/UF;
- Texto do rodapé do comprovante.

Essas informações são salvas localmente e utilizadas no comprovante da venda.

---

### 📦 Controle de Estoque

O módulo de estoque permite acompanhar a movimentação dos produtos.

Funcionalidades:

- Visualização dos produtos em estoque;
- Registro de entrada de estoque;
- Histórico de movimentações;
- Saída automática ao realizar venda;
- Devolução automática ao cancelar venda;
- Alerta de estoque baixo;
- Movimentações integradas ao Supabase.

---

### 🤝 CRM

O CRM permite acompanhar o relacionamento com os clientes.

Funcionalidades:

- Visualização de clientes cadastrados;
- Total de compras por cliente;
- Valor total comprado;
- Identificação de clientes recorrentes;
- Identificação de clientes sem compras recentes;
- Histórico de compras por cliente;
- Visualização dos itens comprados;
- Apoio ao relacionamento e fidelização.

---

### 🧾 Histórico de Vendas

A seção de vendas permite consultar todas as operações realizadas.

Informações exibidas:

- Número da venda;
- Data;
- Cliente;
- Itens vendidos;
- Forma de pagamento;
- Valor recebido;
- Troco;
- Desconto;
- Total;
- Status;
- Informações de cancelamento;
- Ações disponíveis.

---

### 🔎 Filtros Avançados em Vendas

A tela de vendas possui filtros para facilitar a consulta e rastreabilidade.

Filtros disponíveis:

- Status:
  - Todos;
  - Concluída;
  - Cancelada;
- Forma de pagamento;
- Cliente;
- Data.

Também existe a opção de limpar todos os filtros.

---

### ❌ Cancelamento de Venda com Auditoria

O sistema permite cancelar vendas e registrar informações de auditoria.

Ao cancelar uma venda:

- O status da venda muda para Cancelada;
- Os itens retornam automaticamente ao estoque;
- É criada uma movimentação de estoque;
- O sistema registra o usuário responsável pelo cancelamento;
- O sistema registra a data e hora do cancelamento.

Esse recurso melhora a rastreabilidade e o controle administrativo.

---

### 📈 Relatórios e Indicadores Gerenciais

Os indicadores foram centralizados no Dashboard Gerencial.

Indicadores disponíveis:

- Receita filtrada;
- Vendas do dia;
- Vendas do mês;
- Ticket médio;
- Vendas concluídas;
- Vendas canceladas;
- Produtos cadastrados;
- Clientes cadastrados;
- Produtos com baixo estoque;
- Valor em estoque;
- Produto mais vendido;
- Cliente que mais comprou;
- Margem de lucro dos produtos;
- Vendas por forma de pagamento;
- Gráficos gerenciais.

---

### 📥 Importação e Exportação em Excel XML

O sistema possui importação e exportação de dados em formato **Excel XML**.

Módulos com importação/exportação:

- Produtos;
- Clientes;
- Fornecedores.

Esse formato permite abrir os arquivos no Excel e facilita:

- Backup;
- Migração de dados;
- Conferência administrativa;
- Integração com rotinas internas;
- Atualização em massa de cadastros.

---

## 🛠️ Tecnologias Utilizadas

- **React**
- **Vite**
- **JavaScript**
- **Tailwind CSS**
- **Supabase**
- **PostgreSQL**
- **Recharts**
- **Lucide React**
- **Framer Motion**
- **Git**
- **GitHub**
- **GitHub Pages**

---

## 🗄️ Banco de Dados

O sistema utiliza **Supabase** com banco **PostgreSQL** para persistência dos dados.

### Tabelas utilizadas

#### Produtos

```text
produtos
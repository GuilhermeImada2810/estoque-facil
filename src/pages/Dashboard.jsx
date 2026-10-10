import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  Layers,
  DollarSign,
  AlertTriangle,
  XCircle,
  Plus,
  ArrowRight,
  Tag,
  Edit2
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { subscribeUserProducts, createProduct, updateProduct } from '../services/productService';
import { StatCard } from '../components/StatCard';
import { ProductModal } from '../components/ProductModal';

export const Dashboard = () => {
  const { currentUser, isConfigured } = useAuth();
  const { success, error } = useToast();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(() => Boolean(currentUser && isConfigured));
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (!currentUser || !isConfigured) {
      return;
    }

    const unsubscribe = subscribeUserProducts(
      currentUser.uid,
      (items) => {
        setProducts(items);
        setLoading(false);
      },
      (err) => {
        error('Falha ao carregar estoque em tempo real: ' + err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser, isConfigured, error]);

  // Cálculos de métricas
  const totalProducts = products.length;
  const totalUnits = products.reduce((acc, p) => acc + (p.quantidade || 0), 0);
  const totalValue = products.reduce((acc, p) => acc + ((p.quantidade || 0) * (p.preco || 0)), 0);

  const outOfStock = products.filter((p) => (p.quantidade || 0) === 0);
  const lowStock = products.filter(
    (p) => (p.quantidade || 0) > 0 && (p.quantidade || 0) <= (p.estoqueMinimo ?? 5)
  );

  const criticalItems = [...outOfStock, ...lowStock];

  // Resumo por categoria
  const categorySummary = products.reduce((acc, p) => {
    const cat = p.categoria || 'Geral';
    if (!acc[cat]) {
      acc[cat] = { count: 0, units: 0, value: 0 };
    }
    acc[cat].count += 1;
    acc[cat].units += (p.quantidade || 0);
    acc[cat].value += ((p.quantidade || 0) * (p.preco || 0));
    return acc;
  }, {});

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (product) => {
    setEditingProduct(product);
    setModalOpen(true);
  };

  const handleSaveProduct = async (formData) => {
    if (!currentUser) return;
    setActionLoading(true);
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, formData);
        success(`Produto "${formData.nome}" atualizado com sucesso!`);
      } else {
        await createProduct(currentUser.uid, formData);
        success(`Produto "${formData.nome}" adicionado com sucesso!`);
      }
      setModalOpen(false);
      setEditingProduct(null);
    } catch (err) {
      error('Erro ao salvar produto: ' + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const formatCurrency = (val) => {
    return (val || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const userName = currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Gestor';

  return (
    <div className="page-container">
      {/* Cabeçalho da Página */}
      <div className="page-header">
        <div>
          <h2 className="page-title">Painel de Controle</h2>
          <p className="page-subtitle">
            Olá, <strong>{userName}</strong>! Acompanhe o panorama geral do inventário da sua empresa.
          </p>
        </div>
        <div className="page-actions">
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleOpenAdd}
          >
            <Plus size={18} />
            <span>Novo Produto</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading-card">
          <div className="spinner-lg" />
          <p>Buscando métricas do seu estoque...</p>
        </div>
      ) : (
        <>
          {/* Métricas Principais (KPIs) */}
          <div className="stats-grid">
            <StatCard
              title="Tipos de Produtos"
              value={totalProducts}
              subtitle="Produtos distintos no catálogo"
              icon={Package}
              color="blue"
            />
            <StatCard
              title="Total de Unidades"
              value={totalUnits.toLocaleString('pt-BR')}
              subtitle="Itens físicos em estoque"
              icon={Layers}
              color="indigo"
            />
            <StatCard
              title="Valor Total em Estoque"
              value={formatCurrency(totalValue)}
              subtitle="Patrimônio em mercadorias"
              icon={DollarSign}
              color="emerald"
            />
            <StatCard
              title="Estoque Crítico / Baixo"
              value={lowStock.length}
              subtitle="Itens próximos do mínimo"
              icon={AlertTriangle}
              color="amber"
            />
            <StatCard
              title="Produtos Esgotados"
              value={outOfStock.length}
              subtitle="Itens zerados na prateleira"
              icon={XCircle}
              color="rose"
            />
          </div>

          {/* Seção Central: Alertas & Resumo */}
          <div className="dashboard-columns">
            {/* Coluna 1: Produtos que demandam atenção */}
            <div className="content-card dashboard-card">
              <div className="card-header-flex">
                <div className="card-title-group">
                  <div className="badge-icon-wrap warning">
                    <AlertTriangle size={18} />
                  </div>
                  <div>
                    <h3 className="card-heading">Itens em Atenção Imediata</h3>
                    <p className="card-subheading">
                      {criticalItems.length > 0
                        ? `${criticalItems.length} produto(s) precisam de reposição`
                        : 'Nenhum produto em nível crítico no momento.'}
                    </p>
                  </div>
                </div>
                <Link to="/produtos" className="card-link-action">
                  Ver todos <ArrowRight size={16} />
                </Link>
              </div>

              {criticalItems.length === 0 ? (
                <div className="empty-state-compact">
                  <div className="empty-check-icon">✓</div>
                  <p>Todos os produtos estão com níveis saudáveis de estoque!</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Produto</th>
                        <th>Categoria</th>
                        <th>Qtd. Atual</th>
                        <th>Mínimo</th>
                        <th>Status</th>
                        <th className="text-right">Ação</th>
                      </tr>
                    </thead>
                    <tbody>
                      {criticalItems.slice(0, 5).map((prod) => (
                        <tr key={prod.id}>
                          <td className="font-semibold text-main">{prod.nome}</td>
                          <td>
                            <span className="category-pill">{prod.categoria || 'Geral'}</span>
                          </td>
                          <td className="font-bold">
                            <span className={prod.quantidade === 0 ? 'text-danger' : 'text-warning'}>
                              {prod.quantidade} un.
                            </span>
                          </td>
                          <td className="text-muted">{prod.estoqueMinimo ?? 5} un.</td>
                          <td>
                            {prod.quantidade === 0 ? (
                              <span className="badge badge-danger">Esgotado</span>
                            ) : (
                              <span className="badge badge-warning">Estoque Baixo</span>
                            )}
                          </td>
                          <td className="text-right">
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(prod)}
                              className="btn-icon"
                              title="Editar quantidade"
                            >
                              <Edit2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Coluna 2: Distribuição por Categorias & Atalhos */}
            <div className="content-card dashboard-card">
              <div className="card-header-flex">
                <div className="card-title-group">
                  <div className="badge-icon-wrap primary">
                    <Tag size={18} />
                  </div>
                  <div>
                    <h3 className="card-heading">Resumo por Categoria</h3>
                    <p className="card-subheading">Distribuição do estoque por setor</p>
                  </div>
                </div>
              </div>

              {Object.keys(categorySummary).length === 0 ? (
                <div className="empty-state-compact">
                  <p>Cadastre produtos para visualizar a distribuição por setor.</p>
                </div>
              ) : (
                <div className="category-summary-list">
                  {Object.entries(categorySummary).map(([catName, stats]) => (
                    <div key={catName} className="category-summary-item">
                      <div className="cat-item-info">
                        <span className="cat-item-name">{catName}</span>
                        <span className="cat-item-count">
                          {stats.count} {stats.count === 1 ? 'produto' : 'produtos'} ({stats.units} un.)
                        </span>
                      </div>
                      <div className="cat-item-val font-semibold">
                        {formatCurrency(stats.value)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Produtos Recentes Cadastrados */}
          <div className="content-card dashboard-card mt-6">
            <div className="card-header-flex">
              <div className="card-title-group">
                <div className="badge-icon-wrap info">
                  <Package size={18} />
                </div>
                <div>
                  <h3 className="card-heading">Últimos Produtos Atualizados</h3>
                  <p className="card-subheading">Itens modificados mais recentemente</p>
                </div>
              </div>
              <Link to="/produtos" className="btn btn-secondary btn-sm">
                <span>Gerenciar Todo o Estoque</span>
                <ArrowRight size={16} />
              </Link>
            </div>

            {products.length === 0 ? (
              <div className="empty-state-placeholder">
                <Package size={48} className="empty-icon" />
                <h4>Seu estoque ainda está vazio</h4>
                <p>Cadastre o primeiro produto para começar a controlar seus itens.</p>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleOpenAdd}
                >
                  <Plus size={18} />
                  <span>Cadastrar Primeiro Produto</span>
                </button>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Código/SKU</th>
                      <th>Produto</th>
                      <th>Categoria</th>
                      <th>Qtd.</th>
                      <th>Preço Unit.</th>
                      <th>Valor em Estoque</th>
                      <th>Status</th>
                      <th className="text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.slice(0, 6).map((item) => {
                      const totalItemVal = (item.quantidade || 0) * (item.preco || 0);
                      const isZero = (item.quantidade || 0) === 0;
                      const isLow = !isZero && (item.quantidade || 0) <= (item.estoqueMinimo ?? 5);

                      return (
                        <tr key={item.id}>
                          <td className="text-muted font-mono">{item.codigo || '-'}</td>
                          <td className="font-semibold text-main">{item.nome}</td>
                          <td>
                            <span className="category-pill">{item.categoria || 'Geral'}</span>
                          </td>
                          <td className="font-bold">{item.quantidade} un.</td>
                          <td>{formatCurrency(item.preco)}</td>
                          <td className="font-semibold text-main">{formatCurrency(totalItemVal)}</td>
                          <td>
                            {isZero ? (
                              <span className="badge badge-danger">Esgotado</span>
                            ) : isLow ? (
                              <span className="badge badge-warning">Estoque Baixo</span>
                            ) : (
                              <span className="badge badge-success">Disponível</span>
                            )}
                          </td>
                          <td className="text-right">
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(item)}
                              className="btn-icon"
                              title="Editar Produto"
                            >
                              <Edit2 size={16} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {/* Modal de Criação / Edição */}
      <ProductModal
        key={editingProduct?.id || 'create-modal'}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveProduct}
        product={editingProduct}
        loading={actionLoading}
      />
    </div>
  );
};

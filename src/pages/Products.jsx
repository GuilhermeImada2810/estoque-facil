import React, { useState, useEffect, useMemo } from 'react';
import {
  Package,
  Plus,
  Search,
  Trash2,
  Edit2
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import {
  subscribeUserProducts,
  createProduct,
  updateProduct,
  deleteProduct
} from '../services/productService';
import { ProductModal } from '../components/ProductModal';
import { ConfirmModal } from '../components/ConfirmModal';

export const Products = () => {
  const { currentUser, isConfigured } = useAuth();
  const { success, error } = useToast();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(() => Boolean(currentUser && isConfigured));

  // Filtros e busca
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'available', 'low', 'out'
  const [sortBy, setSortBy] = useState('recent'); // 'recent', 'name_asc', 'price_asc', 'price_desc', 'qty_asc', 'qty_desc'

  // Modais
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState(null);
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
        error('Falha ao sincronizar produtos: ' + err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser, isConfigured, error]);

  // Lista única de categorias presentes nos produtos
  const categoriesList = useMemo(() => {
    const set = new Set();
    products.forEach((p) => {
      if (p.categoria) set.add(p.categoria);
    });
    return Array.from(set).sort();
  }, [products]);

  // Filtragem e ordenação dos produtos
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Busca textual (Nome, Código SKU, Descrição)
        const term = searchTerm.toLowerCase().trim();
        const matchesSearch =
          !term ||
          p.nome?.toLowerCase().includes(term) ||
          p.codigo?.toLowerCase().includes(term) ||
          p.descricao?.toLowerCase().includes(term);

        if (!matchesSearch) return false;

        // Filtro por Categoria
        if (selectedCategory !== 'all' && (p.categoria || 'Geral') !== selectedCategory) {
          return false;
        }

        // Filtro por Status de Estoque
        const qty = p.quantidade || 0;
        const minQty = p.estoqueMinimo ?? 5;

        if (statusFilter === 'available') {
          return qty > minQty;
        }
        if (statusFilter === 'low') {
          return qty > 0 && qty <= minQty;
        }
        if (statusFilter === 'out') {
          return qty === 0;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'name_asc') {
          return (a.nome || '').localeCompare(b.nome || '');
        }
        if (sortBy === 'price_asc') {
          return (a.preco || 0) - (b.preco || 0);
        }
        if (sortBy === 'price_desc') {
          return (b.preco || 0) - (a.preco || 0);
        }
        if (sortBy === 'qty_asc') {
          return (a.quantidade || 0) - (b.quantidade || 0);
        }
        if (sortBy === 'qty_desc') {
          return (b.quantidade || 0) - (a.quantidade || 0);
        }
        // 'recent' padrão:
        const timeA = a.createdAt?.toMillis?.() || (a.createdAt ? new Date(a.createdAt).getTime() : 0);
        const timeB = b.createdAt?.toMillis?.() || (b.createdAt ? new Date(b.createdAt).getTime() : 0);
        return timeB - timeA;
      });
  }, [products, searchTerm, selectedCategory, statusFilter, sortBy]);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setProductModalOpen(true);
  };

  const handleOpenEdit = (product) => {
    setEditingProduct(product);
    setProductModalOpen(true);
  };

  const handleOpenDelete = (product) => {
    setDeletingProduct(product);
    setDeleteModalOpen(true);
  };

  const handleSaveProduct = async (formData) => {
    if (!currentUser) return;
    setActionLoading(true);
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, formData);
        success(`Produto "${formData.nome}" atualizado!`);
      } else {
        await createProduct(currentUser.uid, formData);
        success(`Produto "${formData.nome}" cadastrado com sucesso!`);
      }
      setProductModalOpen(false);
      setEditingProduct(null);
    } catch (err) {
      error('Erro ao salvar produto: ' + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingProduct) return;
    setActionLoading(true);
    try {
      await deleteProduct(deletingProduct.id);
      success(`Produto "${deletingProduct.nome}" excluído com sucesso.`);
      setDeleteModalOpen(false);
      setDeletingProduct(null);
    } catch (err) {
      error('Erro ao excluir produto: ' + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const formatCurrency = (val) => {
    return (val || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <div className="page-title-row">
            <h2 className="page-title">Gerenciamento de Produtos</h2>
            <span className="badge badge-info">{products.length} itens cadastrados</span>
          </div>
          <p className="page-subtitle">
            Cadastre, pesquise, edite e monitore os níveis de estoque das suas mercadorias.
          </p>
        </div>

        <div className="page-actions">
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleOpenAdd}
          >
            <Plus size={18} />
            <span>Adicionar Produto</span>
          </button>
        </div>
      </div>

      {/* Barra de Filtros e Busca */}
      <div className="content-card filter-bar-card">
        <div className="filter-grid">
          {/* Campo de Busca */}
          <div className="search-input-wrapper">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Buscar por nome, código SKU ou descrição..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {searchTerm && (
              <button
                type="button"
                className="clear-search-btn"
                onClick={() => setSearchTerm('')}
                aria-label="Limpar pesquisa"
              >
                ✕
              </button>
            )}
          </div>

          {/* Filtro por Categoria */}
          <div className="filter-select-wrapper">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="form-select"
            >
              <option value="all">Todas as Categorias</option>
              {categoriesList.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro por Status */}
          <div className="filter-select-wrapper">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="form-select"
            >
              <option value="all">Todos os Status</option>
              <option value="available">Em Estoque Normal</option>
              <option value="low">Estoque Baixo</option>
              <option value="out">Esgotados</option>
            </select>
          </div>

          {/* Ordenação */}
          <div className="filter-select-wrapper">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="form-select"
            >
              <option value="recent">Mais Recentes</option>
              <option value="name_asc">Nome (A a Z)</option>
              <option value="price_asc">Menor Preço</option>
              <option value="price_desc">Maior Preço</option>
              <option value="qty_asc">Menor Quantidade</option>
              <option value="qty_desc">Maior Quantidade</option>
            </select>
          </div>
        </div>
      </div>

      {/* Listagem de Produtos */}
      <div className="content-card">
        {loading ? (
          <div className="loading-card">
            <div className="spinner-lg" />
            <p>Carregando inventário...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="empty-state-placeholder">
            <Package size={50} className="empty-icon" />
            {products.length === 0 ? (
              <>
                <h4>Nenhum produto cadastrado</h4>
                <p>Seu estoque está vazio. Clique abaixo para cadastrar o primeiro item.</p>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleOpenAdd}
                >
                  <Plus size={18} />
                  <span>Cadastrar Primeiro Produto</span>
                </button>
              </>
            ) : (
              <>
                <h4>Nenhum resultado encontrado</h4>
                <p>Nenhum produto corresponde aos critérios de pesquisa ou filtros selecionados.</p>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                    setStatusFilter('all');
                  }}
                >
                  Limpar Filtros
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Produto</th>
                  <th>Categoria</th>
                  <th>Qtd. Estoque</th>
                  <th>Preço Unit.</th>
                  <th>Subtotal</th>
                  <th>Status</th>
                  <th className="text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p) => {
                  const qty = p.quantidade || 0;
                  const price = p.preco || 0;
                  const total = qty * price;
                  const min = p.estoqueMinimo ?? 5;
                  const isOut = qty === 0;
                  const isLow = !isOut && qty <= min;

                  return (
                    <tr key={p.id}>
                      <td className="font-mono text-muted text-sm">
                        {p.codigo ? p.codigo : <span className="text-dim">-</span>}
                      </td>
                      <td>
                        <div className="product-table-name">
                          <span className="font-semibold text-main">{p.nome}</span>
                          {p.descricao && (
                            <span className="product-table-desc" title={p.descricao}>
                              {p.descricao}
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className="category-pill">{p.categoria || 'Geral'}</span>
                      </td>
                      <td>
                        <div className="stock-qty-cell">
                          <span className={`font-bold ${isOut ? 'text-danger' : isLow ? 'text-warning' : 'text-main'}`}>
                            {qty} un.
                          </span>
                          {isLow && (
                            <span className="stock-min-hint" title={`Estoque mínimo definido: ${min}`}>
                              (mín: {min})
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="font-medium">{formatCurrency(price)}</td>
                      <td className="font-semibold text-main">{formatCurrency(total)}</td>
                      <td>
                        {isOut ? (
                          <span className="badge badge-danger">Esgotado</span>
                        ) : isLow ? (
                          <span className="badge badge-warning">Estoque Baixo</span>
                        ) : (
                          <span className="badge badge-success">Em Estoque</span>
                        )}
                      </td>
                      <td className="text-right">
                        <div className="action-buttons-group">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(p)}
                            className="btn-icon"
                            title="Editar este produto"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenDelete(p)}
                            className="btn-icon danger"
                            title="Excluir este produto"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de Criação / Edição */}
      <ProductModal
        key={editingProduct?.id || 'create-modal'}
        isOpen={productModalOpen}
        onClose={() => setProductModalOpen(false)}
        onSave={handleSaveProduct}
        product={editingProduct}
        loading={actionLoading}
      />

      {/* Modal de Confirmação de Exclusão */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Excluir Produto"
        message="Tem certeza de que deseja remover este produto do seu inventário? Esta ação é definitiva."
        itemName={deletingProduct?.nome}
        loading={actionLoading}
      />
    </div>
  );
};

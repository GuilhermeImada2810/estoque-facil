import React, { useState } from 'react';
import { X, Package, DollarSign, Layers, Tag, Hash, FileText, AlertTriangle } from 'lucide-react';

const CATEGORIES = [
  'Geral',
  'Alimentos & Bebidas',
  'Roupas & Acessórios',
  'Eletrônicos',
  'Informática',
  'Móveis & Decoração',
  'Saúde & Beleza',
  'Limpeza',
  'Papelaria & Escritório',
  'Ferramentas & Construção',
];

export const ProductModal = ({ isOpen, onClose, onSave, product = null, loading = false }) => {
  const [formData, setFormData] = useState(() => ({
    nome: product?.nome || '',
    categoria: product?.categoria || 'Geral',
    quantidade: product?.quantidade !== undefined ? String(product.quantidade) : '',
    preco: product?.preco !== undefined ? String(product.preco) : '',
    estoqueMinimo: product?.estoqueMinimo !== undefined ? String(product.estoqueMinimo) : '5',
    codigo: product?.codigo || '',
    descricao: product?.descricao || '',
  }));

  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};
    if (!formData.nome.trim()) {
      newErrors.nome = 'O nome do produto é obrigatório.';
    }

    if (formData.quantidade === '' || isNaN(formData.quantidade)) {
      newErrors.quantidade = 'Informe uma quantidade válida.';
    } else if (Number(formData.quantidade) < 0) {
      newErrors.quantidade = 'A quantidade não pode ser negativa.';
    }

    if (formData.preco === '' || isNaN(formData.preco)) {
      newErrors.preco = 'Informe um preço válido.';
    } else if (Number(formData.preco) < 0) {
      newErrors.preco = 'O preço não pode ser negativo.';
    }

    if (formData.estoqueMinimo !== '' && Number(formData.estoqueMinimo) < 0) {
      newErrors.estoqueMinimo = 'O estoque mínimo deve ser maior ou igual a zero.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      nome: formData.nome,
      categoria: formData.categoria,
      quantidade: parseInt(formData.quantidade, 10),
      preco: parseFloat(formData.preco),
      estoqueMinimo: parseInt(formData.estoqueMinimo || '5', 10),
      codigo: formData.codigo,
      descricao: formData.descricao,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const calcSubtotal = () => {
    const q = Number(formData.quantidade) || 0;
    const p = Number(formData.preco) || 0;
    return (q * p).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const isEditing = Boolean(product && product.id);

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-dialog modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-icon primary">
            <Package size={22} />
          </div>
          <div>
            <h3 className="modal-title">{isEditing ? 'Editar Produto' : 'Cadastrar Novo Produto'}</h3>
            <p className="modal-subtitle">
              {isEditing ? 'Atualize as informações do item no inventário.' : 'Preencha os dados do item para adicioná-lo ao estoque.'}
            </p>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Fechar"
            disabled={loading}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="modal-body form-grid">
            {/* Nome do Produto */}
            <div className="form-group col-span-2">
              <label htmlFor="prod-nome" className="form-label">
                Nome do Produto <span className="required">*</span>
              </label>
              <div className="input-group">
                <Tag size={18} className="input-icon" />
                <input
                  id="prod-nome"
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  placeholder="Ex: Teclado Mecânico RGB"
                  className={`form-input ${errors.nome ? 'input-error' : ''}`}
                  disabled={loading}
                  autoFocus
                />
              </div>
              {errors.nome && <span className="form-error">{errors.nome}</span>}
            </div>

            {/* Categoria */}
            <div className="form-group">
              <label htmlFor="prod-categoria" className="form-label">
                Categoria
              </label>
              <div className="input-group">
                <Layers size={18} className="input-icon" />
                <select
                  id="prod-categoria"
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleChange}
                  className="form-input"
                  disabled={loading}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Código / SKU */}
            <div className="form-group">
              <label htmlFor="prod-codigo" className="form-label">
                Código / SKU (Opcional)
              </label>
              <div className="input-group">
                <Hash size={18} className="input-icon" />
                <input
                  id="prod-codigo"
                  type="text"
                  name="codigo"
                  value={formData.codigo}
                  onChange={handleChange}
                  placeholder="Ex: TEC-001"
                  className="form-input"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Quantidade */}
            <div className="form-group">
              <label htmlFor="prod-quantidade" className="form-label">
                Quantidade em Estoque <span className="required">*</span>
              </label>
              <div className="input-group">
                <Package size={18} className="input-icon" />
                <input
                  id="prod-quantidade"
                  type="number"
                  min="0"
                  step="1"
                  name="quantidade"
                  value={formData.quantidade}
                  onChange={handleChange}
                  placeholder="0"
                  className={`form-input ${errors.quantidade ? 'input-error' : ''}`}
                  disabled={loading}
                />
              </div>
              {errors.quantidade && <span className="form-error">{errors.quantidade}</span>}
            </div>

            {/* Preço Unitário */}
            <div className="form-group">
              <label htmlFor="prod-preco" className="form-label">
                Preço Unitário (R$) <span className="required">*</span>
              </label>
              <div className="input-group">
                <DollarSign size={18} className="input-icon" />
                <input
                  id="prod-preco"
                  type="number"
                  min="0"
                  step="0.01"
                  name="preco"
                  value={formData.preco}
                  onChange={handleChange}
                  placeholder="0.00"
                  className={`form-input ${errors.preco ? 'input-error' : ''}`}
                  disabled={loading}
                />
              </div>
              {errors.preco && <span className="form-error">{errors.preco}</span>}
            </div>

            {/* Estoque Mínimo */}
            <div className="form-group">
              <label htmlFor="prod-estoqueMinimo" className="form-label">
                Estoque Mínimo (Alerta)
              </label>
              <div className="input-group">
                <AlertTriangle size={18} className="input-icon" />
                <input
                  id="prod-estoqueMinimo"
                  type="number"
                  min="0"
                  step="1"
                  name="estoqueMinimo"
                  value={formData.estoqueMinimo}
                  onChange={handleChange}
                  placeholder="5"
                  className={`form-input ${errors.estoqueMinimo ? 'input-error' : ''}`}
                  disabled={loading}
                />
              </div>
              {errors.estoqueMinimo && <span className="form-error">{errors.estoqueMinimo}</span>}
            </div>

            {/* Resumo do Valor Total Calculado */}
            <div className="form-group">
              <label className="form-label">Valor Total Estimado</label>
              <div className="value-preview-box">
                <span className="value-preview-label">Subtotal em estoque:</span>
                <span className="value-preview-amount">{calcSubtotal()}</span>
              </div>
            </div>

            {/* Descrição */}
            <div className="form-group col-span-2">
              <label htmlFor="prod-descricao" className="form-label">
                Descrição ou Observações (Opcional)
              </label>
              <div className="input-group">
                <FileText size={18} className="input-icon textarea-icon" />
                <textarea
                  id="prod-descricao"
                  name="descricao"
                  rows={3}
                  value={formData.descricao}
                  onChange={handleChange}
                  placeholder="Detalhes sobre o fornecedor, especificações ou localização na loja..."
                  className="form-input form-textarea"
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-sm" />
                  Salvando...
                </>
              ) : (
                isEditing ? 'Salvar Alterações' : 'Cadastrar Produto'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

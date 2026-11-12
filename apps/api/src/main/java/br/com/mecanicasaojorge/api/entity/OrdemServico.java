package br.com.mecanicasaojorge.api.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Ordem de servico (tabela {@code ordens_servico}, migration V2).
 *
 * <p>ADR-005: os totais de nivel OS ({@code subtotalServicos}, {@code subtotalPecas}, {@code
 * desconto}, {@code valorTotal}) sao colunas comuns, recalculadas no service — diferente dos
 * subtotais de item (colunas geradas em {@link OrdemServicoServico} e {@link OrdemServicoPeca}).
 */
@Entity
@Table(name = "ordens_servico")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrdemServico {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "cliente_id", nullable = false)
  private Cliente cliente;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "veiculo_id", nullable = false)
  private Veiculo veiculo;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 20)
  private StatusOS status;

  @Column(name = "subtotal_servicos", nullable = false, precision = 10, scale = 2)
  private BigDecimal subtotalServicos;

  @Column(name = "subtotal_pecas", nullable = false, precision = 10, scale = 2)
  private BigDecimal subtotalPecas;

  @Column(nullable = false, precision = 10, scale = 2)
  private BigDecimal desconto;

  @Column(name = "valor_total", nullable = false, precision = 10, scale = 2)
  private BigDecimal valorTotal;
}

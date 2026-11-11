package br.com.mecanicasaojorge.api.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
 * Item de servico de uma OS (tabela {@code ordens_servico_servicos}, migration V2).
 *
 * <p>ADR-005: {@code subtotal} e {@code GENERATED ALWAYS AS (valor_cobrado * quantidade) STORED} no
 * banco; a aplicacao nunca grava esse campo ({@code insertable = false, updatable = false}).
 */
@Entity
@Table(name = "ordens_servico_servicos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrdemServicoServico {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "ordem_id", nullable = false)
  private OrdemServico ordem;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "servico_id", nullable = false)
  private Servico servico;

  @Column(name = "valor_cobrado", nullable = false, precision = 10, scale = 2)
  private BigDecimal valorCobrado;

  @Column(nullable = false)
  private int quantidade;

  @Column(insertable = false, updatable = false, precision = 10, scale = 2)
  private BigDecimal subtotal;
}

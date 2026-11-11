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
import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Parcela de uma OS (tabela {@code parcelas}, migration V2).
 *
 * <p>Sem campo de status: conforme overview.md, o status da parcela e calculado em runtime, nao e
 * persistido.
 */
@Entity
@Table(name = "parcelas")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Parcela {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "ordem_id", nullable = false)
  private OrdemServico ordem;

  @Column(nullable = false)
  private int numero;

  @Column(name = "total_parcelas", nullable = false)
  private int totalParcelas;

  @Column(name = "valor_previsto", nullable = false, precision = 10, scale = 2)
  private BigDecimal valorPrevisto;

  @Column(name = "data_vencimento", nullable = false)
  private LocalDate dataVencimento;
}

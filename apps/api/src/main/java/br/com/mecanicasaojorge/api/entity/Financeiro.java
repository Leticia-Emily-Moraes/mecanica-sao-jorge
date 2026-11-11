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
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Lancamento financeiro (tabela {@code financeiro}, migration V2). */
@Entity
@Table(name = "financeiro")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Financeiro {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 10)
  private TipoLancamento tipo;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "ordem_id")
  private OrdemServico ordem;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "pagamento_id")
  private Pagamento pagamento;
}

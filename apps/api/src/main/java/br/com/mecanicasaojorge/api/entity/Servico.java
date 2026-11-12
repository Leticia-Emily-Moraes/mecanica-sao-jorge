package br.com.mecanicasaojorge.api.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Item do catalogo de servicos (tabela {@code servicos}, migration V2). */
@Entity
@Table(name = "servicos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Servico {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "valor_padrao_mao_obra", nullable = false, precision = 10, scale = 2)
  private BigDecimal valorPadraoMaoObra;

  @Column(name = "tempo_estimado_horas", precision = 5, scale = 2)
  private BigDecimal tempoEstimadoHoras;

  @Column(nullable = false)
  private boolean ativo;
}

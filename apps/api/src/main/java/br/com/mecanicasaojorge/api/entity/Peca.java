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

/** Item do catalogo de pecas, com estoque (tabela {@code pecas}, migration V2). */
@Entity
@Table(name = "pecas")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Peca {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, length = 50, unique = true)
  private String codigo;

  @Column(nullable = false, precision = 10, scale = 2)
  private BigDecimal custo;

  @Column(name = "preco_venda", nullable = false, precision = 10, scale = 2)
  private BigDecimal precoVenda;

  @Column(name = "quantidade_estoque", nullable = false)
  private int quantidadeEstoque;

  @Column(name = "estoque_minimo", nullable = false)
  private int estoqueMinimo;

  @Column(nullable = false)
  private boolean ativo;
}

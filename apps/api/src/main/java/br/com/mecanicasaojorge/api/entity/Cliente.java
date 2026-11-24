package br.com.mecanicasaojorge.api.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.OffsetDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Cliente da oficina (tabela {@code clientes}, migration V2). */
@Entity
@Table(name = "clientes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Cliente {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, length = 150)
  private String nome;

  @Column(length = 20)
  private String telefone;

  @Column(length = 190)
  private String email;

  /** So digitos (CHECK da V4). Dado pessoal: nunca em log nem em toString (ADR-018). */
  @Column(length = 11)
  private String cpf;

  @Column(length = 255)
  private String endereco;

  @Column(name = "created_at", nullable = false, insertable = false, updatable = false)
  private OffsetDateTime createdAt;

  /**
   * O {@code toString()} gerado pelo Lombok imprimiria CPF e endereco; este o substitui por um
   * texto fixo (politica de dados do cliente, secao 7, achado B1).
   */
  public static class ClienteBuilder {
    @Override
    public String toString() {
      return "Cliente.ClienteBuilder";
    }
  }
}

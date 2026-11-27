package br.com.mecanicasaojorge.api.service;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class EstoqueMinimoTest {

  @Test
  void shouldBeLowWhenQuantityEqualsMinimum() {
    assertThat(EstoqueMinimo.atingido(5, 5)).isTrue();
  }

  @Test
  void shouldBeLowWhenQuantityIsBelowMinimum() {
    assertThat(EstoqueMinimo.atingido(2, 5)).isTrue();
  }

  @Test
  void shouldNotBeLowWhenQuantityIsAboveMinimum() {
    assertThat(EstoqueMinimo.atingido(6, 5)).isFalse();
  }

  @Test
  void shouldBeLowWhenQuantityAndMinimumAreZero() {
    assertThat(EstoqueMinimo.atingido(0, 0)).isTrue();
  }

  @Test
  void shouldNotBeLowWhenMinimumIsZeroAndThereIsStock() {
    assertThat(EstoqueMinimo.atingido(1, 0)).isFalse();
  }
}

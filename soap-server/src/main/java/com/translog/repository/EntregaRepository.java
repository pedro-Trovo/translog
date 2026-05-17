package com.translog.repository;

import com.translog.entity.Entrega;
import com.translog.entity.StatusEntrega;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface EntregaRepository extends JpaRepository<Entrega, Long> {

    Optional<Entrega> findByCodigoRastreio(String codigoRastreio);

    List<Entrega> findByCriadoEmBetween(LocalDateTime inicio, LocalDateTime fim);

    List<Entrega> findByStatusAtualAndCriadoEmBetween(StatusEntrega status, LocalDateTime inicio, LocalDateTime fim);

    long countByStatusAtualAndCriadoEmBetween(StatusEntrega status, LocalDateTime inicio, LocalDateTime fim);

    long countByCodigoRastreioStartingWith(String prefixo);
}

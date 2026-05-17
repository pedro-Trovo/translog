package com.translog.repository;

import com.translog.entity.StatusHistorico;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StatusHistoricoRepository extends JpaRepository<StatusHistorico, Long> {

    List<StatusHistorico> findByEntregaIdOrderByRegistradoEmDesc(Long entregaId);
}

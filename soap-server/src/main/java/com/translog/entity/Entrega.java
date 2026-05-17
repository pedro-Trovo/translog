package com.translog.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "entregas")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Entrega {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "codigo_rastreio", unique = true, length = 20)
    private String codigoRastreio;

    @Column(name = "remetente_nome", length = 100, nullable = false)
    private String remetenteNome;

    @Column(name = "remetente_cidade", length = 100, nullable = false)
    private String remetenteCidade;

    @Column(name = "destinatario_nome", length = 100, nullable = false)
    private String destinatarioNome;

    @Column(name = "destinatario_cidade", length = 100, nullable = false)
    private String destinatarioCidade;

    @Column(name = "destinatario_endereco", length = 255, nullable = false)
    private String destinatarioEndereco;

    @Column(name = "peso_kg", precision = 8, scale = 2)
    private BigDecimal pesoKg;

    @Enumerated(EnumType.STRING)
    @Column(name = "status_atual", length = 30, nullable = false)
    private StatusEntrega statusAtual;

    @Column(name = "criado_em", nullable = false, updatable = false)
    private LocalDateTime criadoEm;

    @Column(name = "atualizado_em", nullable = false)
    private LocalDateTime atualizadoEm;

    @OneToMany(mappedBy = "entrega", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("registradoEm DESC")
    @Builder.Default
    private List<StatusHistorico> statusHistorico = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        criadoEm = LocalDateTime.now();
        atualizadoEm = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        atualizadoEm = LocalDateTime.now();
    }
}

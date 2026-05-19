<h1 align="center">
  <img src="logo.svg" width="280" alt="TransLog">
</h1>

<p align="center">
<strong>Sistema de Gestão de Entregas</strong><br>
Painel interno (intranet) moderno conectado a sistema legado via SOAP — 100% containerizado.
</p>

---

<h2 align="center">Sobre o TransLog</h2>

A <strong>TransLog</strong> é uma transportadora de médio porte que opera há mais de 15 anos no mercado brasileiro. O sistema de gestão de entregas deles foi construído em Java com SOAP e está no coração da operação.

O problema é que a equipe operacional não tinha uma interface moderna para acompanhar as entregas em tempo real — dependiam de consultas manuais no banco ou relatórios impressos.

A solução foi construir um <strong>painel interno (intranet)</strong> que se conecta ao sistema legado via SOAP, sem tocar no código antigo. Um backend intermediário em Express traduz as chamadas REST do frontend para SOAP e devolve JSON para o React.

---

<h2 align="center">Funcionalidades</h2>

- <strong>Painel com resumo</strong> — cards com total de entregas, entregues, em trânsito e canceladas
- <strong>Rastreio por código</strong> — timeline vertical com histórico completo de status
- <strong>Atualização de status</strong> — transições válidas entre os status com observação
- <strong>Criação de entrega</strong> — formulário com validação e refresh automático da tabela
- <strong>Cancelamento</strong> — com motivo e validação de regras de negócio
- <strong>Gráfico por status</strong> — barras horizontais com ECharts atualizadas com os filtros
- <strong>Filtros</strong> — período (date picker), status e busca por código de rastreio

---

<h2 align="center">Arquitetura</h2>

```
React (Dashboard Intranet)
        ↓ HTTP REST + JSON
Express.js (API Intermediária)
        ↓ SOAP + XML
Spring Boot + Spring-WS (Servidor SOAP)
        ↓
PostgreSQL
```

---

<h2 align="center">Tecnologias</h2>

<table align="center">
  <tr>
    <th></th>
    <th>Linguagens</th>
    <th>Frameworks</th>
    <th>Bibliotecas</th>
    <th>Ferramentas</th>
  </tr>

  <tr>
    <th>Frontend</th>
    <td>
      <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript"><img alt="JavaScript" src="https://img.shields.io/badge/javascript-%23F7DF1E.svg?style=for-the-badge&logo=javascript&logoColor=black"/></a>
    </td>
    <td>
      <a href="https://react.dev/"><img alt="React" src="https://img.shields.io/badge/react-%2361DAFB.svg?style=for-the-badge&logo=react&logoColor=black"/></a>
      <a href="https://vitejs.dev/"><img alt="Vite" src="https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white"/></a>
      <a href="https://tailwindcss.com/"><img alt="TailwindCSS" src="https://img.shields.io/badge/tailwindcss-%2306B6D4.svg?style=for-the-badge&logo=tailwindcss&logoColor=white"/></a>
      <a href="https://ui.shadcn.com/"><img alt="shadcn/ui" src="https://img.shields.io/badge/shadcn%2Fui-000000.svg?style=for-the-badge&logo=shadcnui&logoColor=white"/></a>
    </td>
    <td>
      <a href="https://axios-http.com/"><img alt="Axios" src="https://img.shields.io/badge/axios-%235A29E4.svg?style=for-the-badge&logo=axios&logoColor=white"/></a>
      <a href="https://echarts.apache.org/"><img alt="ECharts" src="https://img.shields.io/badge/echarts-%23AA344D.svg?style=for-the-badge&logo=apacheecharts&logoColor=white"/></a>
      <a href="https://lucide.dev/"><img alt="Lucide" src="https://img.shields.io/badge/lucide-%23F56565.svg?style=for-the-badge&logo=lucide&logoColor=white"/></a>
    </td>
    <td>-</td>
  </tr>

  <tr>
    <th>API Rest</th>
    <td>
      <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript"><img alt="JavaScript" src="https://img.shields.io/badge/javascript-%23F7DF1E.svg?style=for-the-badge&logo=javascript&logoColor=black"/></a>
    </td>
    <td>
      <a href="https://expressjs.com/"><img alt="Express" src="https://img.shields.io/badge/express-%23000000.svg?style=for-the-badge&logo=express&logoColor=white"/></a>
    </td>
    <td>
      <a href="https://www.npmjs.com/package/soap"><img alt="soap" src="https://img.shields.io/badge/soap-009688.svg?style=for-the-badge"/></a>
    </td>
    <td>
      <a href="https://swagger.io/"><img alt="Swagger" src="https://img.shields.io/badge/swagger-%2385EA2D.svg?style=for-the-badge&logo=swagger&logoColor=black"/></a>
    </td>
  </tr>

  <tr>
    <th>API SOAP</th>
    <td>
      <a href="https://www.java.com/"><img alt="Java" src="https://img.shields.io/badge/java-%23ED8B00.svg?style=for-the-badge&logo=openjdk&logoColor=white"/></a>
    </td>
    <td>
      <a href="https://spring.io/projects/spring-boot"><img alt="Spring Boot" src="https://img.shields.io/badge/spring%20boot-%236DB33F.svg?style=for-the-badge&logo=springboot&logoColor=white"/></a>
      <a href="https://spring.io/projects/spring-ws"><img alt="Spring-WS" src="https://img.shields.io/badge/spring%20ws-%236DB33F.svg?style=for-the-badge&logo=spring&logoColor=white"/></a>
    </td>
    <td>
      <a href="https://spring.io/projects/spring-data-jpa"><img alt="JPA" src="https://img.shields.io/badge/jpa-%236DB33F.svg?style=for-the-badge&logo=hibernate&logoColor=white"/></a>
      <a href="https://projectlombok.org/"><img alt="Lombok" src="https://img.shields.io/badge/lombok-%23BC4520.svg?style=for-the-badge"/></a>
    </td>
    <td>
      <a href="https://maven.apache.org/"><img alt="Maven" src="https://img.shields.io/badge/maven-%23C71A36.svg?style=for-the-badge&logo=apachemaven&logoColor=white"/></a>
    </td>
  </tr>

  <tr>
    <th>Infra</th>
    <td>-</td>
    <td>-</td>
    <td>-</td>
    <td>
      <a href="https://www.postgresql.org/"><img alt="PostgreSQL" src="https://img.shields.io/badge/postgresql-%234169E1.svg?style=for-the-badge&logo=postgresql&logoColor=white"/></a>
      <a href="https://www.docker.com/"><img alt="Docker" src="https://img.shields.io/badge/docker-%232496ED.svg?style=for-the-badge&logo=docker&logoColor=white"/></a>
      <a href="https://nginx.org/"><img alt="Nginx" src="https://img.shields.io/badge/nginx-%23009639.svg?style=for-the-badge&logo=nginx&logoColor=white"/></a>
    </td>
  </tr>
</table>

> **Frontend** — Construído com **React** + **Vite**, estilizado com **TailwindCSS** e componentes **shadcn/ui**. **Axios** faz as chamadas HTTP para a API Rest, **ECharts** renderiza o gráfico de entregas por status e **Lucide** fornece os ícones da interface.
>
> **API Rest (Express)** — Serviço intermediário em **Express** que expõe os endpoints REST e, usando a biblioteca `soap` (npm), traduz cada requisição para o formato **SOAP** esperado pelo sistema legado. A documentação dos endpoints é gerada automaticamente via **Swagger**.
>
> **API SOAP (Spring Boot)** — Sistema legado em **Java 17** com **Spring Boot** e **Spring-WS** expondo os métodos SOAP. **Spring Data JPA** + **Hibernate** faz o mapeamento objeto-relacional e **Lombok** reduz o código boilerplate. O build e as dependências são gerenciados pelo **Maven**.
>
> **Infraestrutura** — **PostgreSQL** armazena os dados da aplicação. **Docker Compose** orquestra todos os serviços (PostgreSQL, SOAP Server, API Rest e Frontend) com um único comando. O build estático do frontend é servido pelo **Nginx**.

---

<h2 align="center">Executando com Docker</h2>

```bash
git clone https://github.com/pedro-Trovo/translog
cd translog
docker compose up --build
```

Após subir, acesse:

| Serviço | URL |
|---------|-----|
| Frontend | <code>http://localhost</code> |
| API (Express) | <code>http://localhost:3001</code> |
| Swagger | <code>http://localhost:3001/api-docs</code> |
| SOAP Server | <code>http://localhost:8080</code> |
| WSDL | <code>http://localhost:8080/ws/entregas.wsdl</code> |

---

<h2 align="center">Executando sem Docker</h2>

### 1. Banco de Dados (PostgreSQL)

Certifique-se de ter o PostgreSQL rodando na porta <code>5432</code> com banco <code>translog</code>.

### 2. Servidor SOAP

```bash
cd soap-server
mvn spring-boot:run
```

### 3. API Intermediária

```bash
cd api-intermediaria
npm install
npm start
```

### 4. Frontend

```bash
cd frontend
npm install
npm run dev
```

Acesse: <code>http://localhost:5173</code>

---

<h2 align="center">Endpoints REST</h2>

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | <code>/entregas</code> | Lista entregas com filtros opcionais (<code>dataInicio</code>, <code>dataFim</code>, <code>status</code>) |
| GET | <code>/entregas/:codigo</code> | Rastreia uma entrega pelo código |
| POST | <code>/entregas</code> | Cria uma nova entrega |
| PATCH | <code>/entregas/:codigo/status</code> | Atualiza o status de uma entrega |
| POST | <code>/entregas/:codigo/cancelar</code> | Cancela uma entrega |

Documentação completa disponível via Swagger em <code>/api-docs</code>.

---

<h2 align="center">Métodos SOAP</h2>

| Método | Descrição |
|--------|-----------|
| <code>criarEntrega</code> | Cria nova entrega com código de rastreio gerado automaticamente |
| <code>rastrearEntrega</code> | Retorna dados completos + histórico de status |
| <code>atualizarStatus</code> | Atualiza o status com validação de transições |
| <code>listarEntregas</code> | Lista entregas com filtros opcionais de data e status |
| <code>cancelarEntrega</code> | Cancela entrega (bloqueia se já entregue) |

### Status possíveis

```
COLETADO → EM_TRANSITO → SAIU_PARA_ENTREGA → ENTREGUE
                                  ↓
                          TENTATIVA_FALHA → SAIU_PARA_ENTREGA
                                  ↓
                              CANCELADO
```

---

<h2 align="center">Licença</h2>

Este projeto está sob a licença <strong>MIT</strong>. Consulte o arquivo <a href="LICENSE"><code>LICENSE</code></a> para mais informações.

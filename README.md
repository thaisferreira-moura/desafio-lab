# Desafio Técnico - Laboratório (Amostras, Variantes e Laudos)

Aplicação web simples que simula um laboratório fictício responsável por processar Amostras, analisar Variantes e gerar Laudos.

Requisitos atendidos:
- API em Node.js, Fastify e TypeScript
- Interface em React + TypeScript consumindo a API
- Persistência em memória
- Validação simples do formato do id da Variante (chr<numero>-<posição>-<ref>-<alt>)
- Estados de UI: idle, loading, success, error
- Consistência de estado no React e prevenção de requisições antigas (stale requests)

## Estrutura
- backend/ (Fastify + TypeScript)
- frontend/ (React + TypeScript)

## Como rodar localmente

### 1) Backend

```
cd backend
npm install
npm run dev
```

API em `http://localhost:3333`.

### 2) Frontend

Em outro terminal:

```
cd frontend
npm install
npm run dev
```

Interface em `http://localhost:5173`.

## Endpoints (Backend)

- `GET /` health check
- `POST /samples` cria amostra
- `GET /samples` lista amostras
- `POST /reports/previa` gera prévia (não salva)
- `POST /reports` gera laudo final (salva em memória)
- `GET /reports/:sampleId` busca laudo salvo

### Exemplo de payload (POST /samples)

```
{
  "name": "Amostra A",
  "variants": [
    { "id": "chr1-154548-A-G", "gene": "BRCA1", "classification": "Patogênico" },
    { "id": "chr7-55249071-G-A", "gene": "EGFR", "classification": "VUS" }
  ]
}
```

### Exemplo de payload (POST /reports/previa e POST /reports)

```
{
  "sampleId": "sample_123",
  "notes": "Triagem fictícia para fins educacionais."
}
```

## Interface (Frontend)

Tela única:
- Lista de amostras à esquerda
- Formulário para criar/editar amostra e preencher observações
- Botões para gerar prévia, gerar laudo final e buscar laudo salvo
- Exibição dos dados (amostra selecionada, prévia e laudo salvo)

## Entrega

- Criar repositório privado no GitHub
- Adicionar o usuário `LGCM-dev` como colaborador


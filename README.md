# <img src="./public/logo.png" width="150" height="150" alt="Logo" align="center" /> Peel (Front-end)

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white) ![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

O **Peel** é uma rede social baseada na simplicidade dos *post-its*. Este repositório contém a interface web do projeto, focada em entregar uma experiência fluida, responsiva e minimalista para os usuários.

## 🧱 Tecnologias e Arquitetura

O front-end foi construído focando em performance, tipagem estática e facilidade de estilização:

*   **React + TypeScript:** Garante um desenvolvimento robusto com autocompletion, segurança no consumo de dados e componentes fortemente tipados.
*   **Vite:** Utilizado como build tool para garantir um ambiente de desenvolvimento extremamente rápido e builds otimizados.
*   **Tailwind CSS (v4 / @tailwindcss/vite):** Estilização ágil através de utilitários, garantindo uma interface altamente customizável e responsiva com visual moderno de post-its.

A aplicação consome a API RESTful do Peel, gerenciando o estado local e as interações do usuário em tempo real.

## 🔒 Variáveis de Ambiente

O front-end precisa se conectar à API do Peel. Na raiz do repositório, duplique o arquivo **`.env.example`** para **`.env`** e defina a URL base da sua API:

```python
VITE_API_BASE_URL="http://127.0.0.1:8000/api/v1"
VITE_WS_URL="ws://localhost:8000/api/v1"
```

---

## 🛠️ Executando o projeto

Para rodar a aplicação web localmente na sua máquina, siga os passos abaixo:

```cmd
    # Acesse a pasta do projeto
    cd peel-app

    # Instale as dependências
    npm install
    
    # Instale o Tailwind e suas dependências do Vite
    npm install tailwindcss @tailwindcss/vite

    # Inicialize o servidor de desenvolvimento
    npm run dev
```

A aplicação estará disponível no seu navegador por padrão em **`http://localhost:5173`**.

---

## 🔗 Repositório Relacionado

* ⚙️ **Back-end (FastAPI + PostgreSQL):** [antoniolpcan/peel-back](https://github.com/antoniolpcan/peel-back)

---

Desenvolvido por [Antonio Candioto](https://github.com/antoniolpcan) — Entre em contato no [LinkedIn](https://www.linkedin.com/in/antoniolpcan/)
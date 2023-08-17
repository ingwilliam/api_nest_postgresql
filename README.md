<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Correr el contenedor postgresql con phpmyadmin

Ambiente de desarrollo y/o QA

```docker-compose up -d```

Ingresar a la url phppgadmin-container:port, creando el servidor conectando a postgres-container, con el fin de que se pueda administrar la base de datos 

Ambiente de pre y producción

```docker-compose -f docker-compose-produccion.yml up -d```

# Git

Clonar proyecto

# Install nest con npm

```npm install```

Clonar el archivo ```.env.template``` y renombrarlo a ```.env```

Cambiar las variables de entorno

# Ejecutar SEED para crear los insert que necesitemos

```http://localhost:3001/api/seed```

# Levantar nest con npm para desarrollo

```npm run start:dev```

# Software Project Management API

Servidor desarrollado en NestJS que expone una API GraphQL para la gestión de tareas de proyectos de desarrollo de software. Este proyecto ha sido diseñado aplicando principios de Clean Code, Programación Orientada a Aspectos (AOP) para el manejo de logs y un flujo de desarrollo riguroso mediante GitFlow.

## 🚀 Tecnologías y Herramientas
* **Backend Framework:** NestJS
* **API Layer:** GraphQL (@nestjs/graphql, Apollo Server)
* **Persistencia:** Sistema de archivos local (Lectura/Escritura sincrónica de archivos `.json`)
* **Aspectos (AOP):** Interceptors y Decoradores personalizados de NestJS
* **Calidad de Código & Documentación:** Clean Code, JSDoc profesional
* **Control de Versiones:** GitFlow (Ramas estructuradas de desarrollo y características)

## 📁 Persistencia de Datos (JSON Database)
Para cumplir con los requerimientos de ligereza y simplicidad en el entorno de evaluación, la persistencia de datos se maneja localmente mediante archivos JSON localizados en el directorio del servidor[cite: 1]. 
* El sistema lee y actualiza dinámicamente los arreglos de tareas y proyectos, simulando operaciones atómicas de una base de datos tradicional[cite: 1].
* Se garantiza la consistencia de los identificadores únicos y el manejo dinámico de arreglos (como los tags y usuarios asignados) de forma estrictamente estructurada[cite: 1].

## 🛠️ Instrucciones de Instalación y Ejecución

1. Clonar el repositorio y acceder a la rama correspondiente[cite: 1]:
```bash
git clone <link-del-repositorio>
cd <nombre-del-directorio>

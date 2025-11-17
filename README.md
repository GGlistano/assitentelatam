# Dr. Juan - Asistente de Adelgazamiento

Una aplicación web de chat estilo WhatsApp con inteligencia artificial integrada para asesoramiento de adelgazamiento y salud.

## Características

- **Interfaz de Chat WhatsApp**: Diseño moderno y familiar basado en WhatsApp
- **IA Conversacional**: Integración con OpenAI para respuestas inteligentes
- **Autenticación**: Sistema de login con número de WhatsApp
- **Panel de Administración**: Dashboard completo para monitorear usuarios y conversaciones
- **Base de Datos en Tiempo Real**: Powered by Supabase
- **Diseño Responsive**: Funciona perfectamente en móvil y desktop

## Tecnologías

- **Frontend**: React 18 + TypeScript + Vite
- **Estilos**: Tailwind CSS
- **Base de Datos**: Supabase (PostgreSQL)
- **Edge Functions**: Supabase Edge Functions (Deno)
- **Iconos**: Lucide React
- **Deploy**: GitHub Actions + GitHub Pages

## Requisitos Previos

- Node.js 18+
- Cuenta de Supabase
- Cuenta de OpenAI (para la IA)

## Configuración

### 1. Clonar el Repositorio

```bash
git clone <url-del-repositorio>
cd <nombre-del-proyecto>
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_SUPABASE_URL=tu_supabase_url
VITE_SUPABASE_ANON_KEY=tu_supabase_anon_key
```

### 4. Configurar Supabase

Las migraciones de base de datos ya están incluidas en `supabase/migrations/`:

- `20251117154132_create_whatsapp_schema.sql` - Estructura inicial
- `20251117170442_create_users_and_update_schema.sql` - Usuarios y permisos

### 5. Configurar Edge Function

La Edge Function para la IA está en `supabase/functions/chat-ai/index.ts`

**IMPORTANTE: Configurar la API key de OpenAI de forma SEGURA:**

1. Ve a tu proyecto en Supabase Dashboard
2. Navega a **Settings > Edge Functions**
3. En la sección de **Secrets**, añade:
   - Nombre: `OPENAI_API_KEY`
   - Valor: Tu API key de OpenAI (empieza con `sk-`)
4. Guarda el secret

**NUNCA pongas la API key directamente en el código!**

### 6. Ejecutar en Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## Estructura del Proyecto

```
├── src/
│   ├── components/          # Componentes React
│   │   ├── AdminPanel.tsx   # Panel de administración
│   │   ├── ChatHeader.tsx   # Cabecera del chat
│   │   ├── ChatInput.tsx    # Input de mensajes
│   │   ├── LoginForm.tsx    # Formulario de login
│   │   ├── MessageBubble.tsx # Burbujas de mensajes
│   │   └── TypingIndicator.tsx # Indicador de escritura
│   ├── contexts/
│   │   └── AuthContext.tsx  # Contexto de autenticación
│   ├── hooks/
│   │   └── useChat.ts       # Hook personalizado para chat
│   ├── lib/
│   │   └── supabase.ts      # Cliente de Supabase
│   ├── App.tsx              # Componente principal
│   └── main.tsx             # Entry point
├── supabase/
│   ├── functions/
│   │   └── chat-ai/         # Edge Function de IA
│   └── migrations/          # Migraciones de BD
├── public/                  # Archivos estáticos
└── .github/
    └── workflows/
        └── deploy.yml       # GitHub Actions para deploy
```

## Funcionalidades del Admin

Para acceder al panel de administración, inicia sesión con un número de WhatsApp marcado como `is_admin = true` en la base de datos.

**El panel permite:**
- Ver estadísticas de usuarios y mensajes
- Ver lista completa de usuarios
- Ver conversaciones de cada usuario
- Actualizar datos en tiempo real

## Deploy

El proyecto está configurado para deploy automático en GitHub Pages usando GitHub Actions.

### Configuración de GitHub

1. **Settings > Secrets and variables > Actions**
   - Añade `VITE_SUPABASE_URL`
   - Añade `VITE_SUPABASE_ANON_KEY`

2. **Settings > Pages**
   - Source: GitHub Actions

3. **DNS (si usas dominio custom)**
   - Añade CNAME apuntando a `tu-usuario.github.io`

El archivo `CNAME` ya está configurado para: `suporte.visionpub.online`

## Scripts Disponibles

```bash
npm run dev        # Servidor de desarrollo
npm run build      # Build de producción
npm run preview    # Preview del build
npm run lint       # Linter
npm run typecheck  # Verificación de tipos TypeScript
```

## Seguridad

- Row Level Security (RLS) habilitado en todas las tablas
- Políticas de acceso restrictivas
- API keys protegidas mediante variables de entorno
- Validación de autenticación en todas las operaciones

## Licencia

Privado

## Soporte

Para soporte, contacta al administrador del sistema.

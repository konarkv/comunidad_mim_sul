# Comunidad

Sitio de lanzamiento y precios **+ demo funcional** para *Comunidad*, la
plataforma para que una comunidad de propietarios comunique, decida y vote con
transparencia.

Construido con **Next.js 16 (App Router) + Tailwind v4 + Supabase**.

Son dos cosas en una:

1. **Sitio de marketing** (`/`) — landing en español, mobile-first, con captación
   de leads real (formulario "Solicitar acceso" → tabla `access_requests`). No
   hay cobro: la CTA es solicitud de acceso al piloto.
2. **Demo del producto** (`/app`) — producto de gobernanza real y funcional:
   registro/login, crear una comunidad, invitar vecinos por código, tablón de
   comunicación, propuestas con **voto Sí / No / Abstención** y recuento en
   directo, y **actas** que quedan como constancia al cerrar cada votación.

---

## 1. Requisitos

- **Node.js 20.9+** (este proyecto se probó con Node 24 vía `nvm`).
- Una cuenta gratuita de **Supabase** → https://supabase.com

Si usas `nvm` y `node` no aparece en una terminal nueva:

```bash
export PATH="$HOME/.nvm/versions/node/v24.18.0/bin:$PATH"
```

---

## 2. Configurar Supabase (una vez)

### 2.1 Crear el proyecto
1. Entra en https://supabase.com/dashboard y pulsa **New project**.
2. Elige nombre, contraseña de la base de datos y región (por ejemplo *EU West*).
3. Espera ~1 min a que se aprovisione.

### 2.2 Crear las tablas y políticas
1. En el panel del proyecto: **SQL Editor → New query**.
2. Copia **todo** el contenido de [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql)
   y pégalo.
3. Pulsa **Run**. Debe terminar sin errores. Esto crea todas las tablas
   (`access_requests`, `profiles`, `communities`, `community_members`, `posts`,
   `proposals`, `votes`, `actas`), sus políticas RLS y las funciones
   (`create_community`, `join_community`, `close_proposal`, …).

### 2.3 Desactivar la confirmación de email (para la demo)
Para que el registro entre directo sin verificar el correo:
1. **Authentication → Sign In / Providers → Email**.
2. Desactiva **Confirm email** y guarda.

> Si prefieres dejar la confirmación activada, el registro pedirá confirmar el
> correo antes de poder entrar; la app ya lo contempla y muestra el aviso.

### 2.4 Copiar las claves
1. **Project Settings → API**.
2. Copia **Project URL** y la clave **anon public**.

---

## 3. Variables de entorno

```bash
cp .env.local.example .env.local
```

Edita `.env.local` con tus valores:

```
NEXT_PUBLIC_SUPABASE_URL=https://TU-REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-public-key
```

> El sitio de marketing renderiza aunque no haya claves; el envío del formulario
> y toda la zona `/app` requieren estas variables.

---

## 4. Ejecutar

```bash
npm install        # solo la primera vez
npm run dev        # desarrollo → http://localhost:3000
npm run build      # build de producción
npm start          # servir el build
```

---

## 5. Prueba rápida (smoke test)

Con las claves puestas y `npm run dev` arrancado:

**Marketing**
- [ ] La home carga en español, sin scroll horizontal en móvil (375 px).
- [ ] "Solicitar acceso" (nav, hero, tarjetas de precio, banda final) abre el
      formulario. Al abrir desde una tarjeta, el título dice el plan (p. ej.
      *Plan Mediana*).
- [ ] Email vacío o inválido → error en línea; no envía.
- [ ] Con email válido → estado de éxito *"¡Gracias! Te contactamos…"*.
- [ ] En Supabase, **Table editor → access_requests** muestra la fila con
      `email`, `role`, `dwellings`, `plan_interest`, `wants_call`.

**Producto** (abre `/registro` o pulsa *Entrar*)
- [ ] Crea una cuenta → entras en `/app`.
- [ ] **Crear comunidad** → entras a la comunidad y ves un **código**.
- [ ] **Tablón**: publica un mensaje / aviso → aparece en la lista.
- [ ] **Votaciones**: crea una propuesta → vota Sí/No/Abstención → el recuento
      se actualiza y tu voto aparece en "quién ha votado qué".
- [ ] **Cerrar votación** (como autor o junta) → se genera un **acta** con el
      resultado en la pestaña *Actas*.
- [ ] En otra cuenta, **Unirme** con el código → ves la misma comunidad y puedes
      votar; una cuenta ajena no ve comunidades a las que no pertenece.

---

## 6. Mapa del proyecto

```
supabase/migrations/0001_init.sql     Esquema + RLS + funciones (fuente de verdad)
src/lib/supabase/                     Clientes (browser/server), proxy de sesión, tipos
src/proxy.ts                          Next 16 "proxy" (antes middleware): refresco de sesión + guard de /app
src/app/page.tsx                      Landing (compone las secciones de marketing)
src/components/marketing/*            Nav, Hero, Problem, Features, HowItWorks, ConceptArt, Pricing, Faq, ...
src/components/access/*               Modal "Solicitar acceso" (contexto + validación + insert)
src/app/login, /registro             Autenticación (email + contraseña)
src/app/app/                          Zona de producto protegida
  page.tsx                            Panel: mis comunidades + crear/unirse
  c/[id]/                             Comunidad: tablón / votaciones / actas
  c/[id]/actions.ts                   Server Actions: publicar, proponer, votar, cerrar
```

## 7. Notas de diseño y alcance

- **Sin pagos**: no hay Stripe ni suscripciones. Los precios son informativos;
  la CTA capta un lead. (Un lanzamiento real añadiría cobro por comunidad/año.)
- **RLS**: cada comunidad solo ve lo suyo. Las funciones `SECURITY DEFINER`
  (`is_member`, `create_community`, `join_community`, `close_proposal`) evitan la
  recursión clásica de políticas y resuelven el "unirse por código".
- **La capa social** (trueque, cenas, paseos) es solo un teaser *próximamente*.
- **Voto en la app**: refleja los acuerdos de la junta; la FAQ no sobreafirma
  validez legal bajo la LPH.

## 8. Desplegar (opcional)

Despliega en **Vercel**: importa el repo, añade las dos variables
`NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` en *Environment
Variables*, y en Supabase añade la URL de producción en **Authentication → URL
Configuration** (Site URL / Redirect URLs).

import Link from "next/link";
import { Logo } from "./Logo";

const CONTACT_EMAIL = "hola@comunidad.app";

export function Footer() {
  return (
    <footer className="border-t border-border bg-bg px-4 py-12 sm:px-6">
      <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2">
            <Logo />
            <span className="text-lg font-bold text-ink">Comunidad</span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-muted">
            La comunidad de propietarios que se comunica, decide y vota con
            transparencia.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-ink">Producto</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li>
              <a href="#producto" className="hover:text-ink">
                Producto
              </a>
            </li>
            <li>
              <a href="#como-funciona" className="hover:text-ink">
                Cómo funciona
              </a>
            </li>
            <li>
              <a href="#precios" className="hover:text-ink">
                Precios
              </a>
            </li>
            <li>
              <a href="#faq" className="hover:text-ink">
                FAQ
              </a>
            </li>
            <li>
              <Link href="/login" className="hover:text-ink">
                Entrar a la demo
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-ink">Contacto</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="hover:text-ink"
              >
                {CONTACT_EMAIL}
              </a>
            </li>
            <li>
              <span className="cursor-default">Aviso legal</span>
            </li>
            <li>
              <span className="cursor-default">Privacidad</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-6xl border-t border-border pt-6 text-sm text-muted">
        <p>
          Somos estudiantes de IE Business School construyendo esto. El producto
          está en fase piloto: al solicitar acceso no se realiza ningún cobro.
        </p>
        <p className="mt-2">
          © {new Date().getFullYear()} Comunidad · Hecho en España
        </p>
      </div>
    </footer>
  );
}

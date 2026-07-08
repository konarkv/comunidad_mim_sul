import { RequestAccessButton } from "@/components/access/RequestAccessButton";

export function SecondCta() {
  return (
    <section className="bg-accent px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Que vuestra comunidad decida con claridad.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-white/85">
          Pedid acceso al piloto. Os contactamos para dar de alta vuestra
          comunidad, sin ningún cobro.
        </p>
        <div className="mt-8">
          <RequestAccessButton
            variant="light"
            className="px-7 py-3.5 text-base"
          />
        </div>
      </div>
    </section>
  );
}

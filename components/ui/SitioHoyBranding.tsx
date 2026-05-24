export default function SitioHoyBranding() {
  return (
    <div className="text-center py-4 border-t border-white/10">
      <p className="text-xs text-neutral-400">
        Desarrollado por{" "}
        <a
          href="https://sitiohoy.com.ar"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center align-middle hover:opacity-80 transition-opacity pl-[0.9px]"
          aria-label="SitioHoy"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo-sitiohoy.webp"
            alt="SitioHoy"
            style={{
              height: "1.4em",
              width: "auto",
              display: "inline",
              verticalAlign: "middle",
            }}
          />
        </a>
      </p>
    </div>
  );
}

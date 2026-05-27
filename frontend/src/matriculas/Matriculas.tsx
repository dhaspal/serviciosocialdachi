import { useState } from 'react'
import type { FormEvent } from 'react'
import './Matriculas.css'

const STEPS = [
  {
    id: 's1',
    title: 'Documentos requeridos',
    body: 'Registro civil, carné de vacunas, fotografía reciente y certificación de residencia en el territorio.',
    tone: 'salmon' as const,
  },
  {
    id: 's2',
    title: 'Gratuidad educativa',
    body: 'La institución garantiza educación gratuita para las familias del resguardo, conforme a la normativa vigente.',
    tone: 'teal' as const,
  },
  {
    id: 's3',
    title: 'Contacto institucional',
    body: 'Para cupos, fechas y orientación sobre el proceso, comuníquese con la coordinación académica.',
    tone: 'blue' as const,
  },
]

const FAQ = [
  {
    q: '¿Hay costo de matrícula?',
    a: 'La gratuidad del servicio educativo público aplica según normativa. Costos asociados a uniformes o materiales se informan por separado.',
  },
  {
    q: '¿Puedo enviar documentos en PDF?',
    a: 'Sí. En esta demostración el archivo se valida en el navegador; en producción se almacenará de forma segura en el servidor.',
  },
  {
    q: '¿Cuánto tarda la respuesta?',
    a: 'La institución confirmará recepción y pasos siguientes por correo o teléfono en los plazos definidos por secretaría.',
  },
]

export function Matriculas() {
  const [faqOpen, setFaqOpen] = useState<string | null>(FAQ[0]?.q ?? null)
  const [sent, setSent] = useState(false)

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSent(true)
    window.setTimeout(() => setSent(false), 4000)
  }

  return (
    <div className="mat-content layout-contained">
      <p className="mat-section-label">Inscripciones</p>
      <h2 className="mat-section-title">Matrículas y preinscripción</h2>
      <p className="mat-lead">
        Formulario de referencia para el requerimiento 4.7. El envío real
        conectará notificaciones por correo cuando el backend esté disponible.
      </p>

      <div className="mat-highlight">
        <p className="mat-highlight-title">Período de matrículas 2026</p>
        <p className="mat-highlight-body">
          Las fechas oficiales de inscripción y vinculación se publicarán en la
          sede y en los canales acordados con el gobierno propio. Consulte
          periódicamente en secretaría o coordinación.
        </p>
        <div className="mat-downloads">
          <a className="mat-download" href="#" onClick={(e) => e.preventDefault()}>
            Descargar instructivo (PDF)
          </a>
          <a className="mat-download" href="#" onClick={(e) => e.preventDefault()}>
            Descargar formato de solicitud (PDF)
          </a>
        </div>
      </div>

      <section className="mat-form-section" aria-labelledby="mat-form-title">
        <h3 id="mat-form-title" className="mat-form-title">
          Preinscripción en línea
        </h3>
        <form className="mat-form" onSubmit={onSubmit}>
          <div className="mat-form-grid">
            <label className="mat-field">
              <span>Nombre del estudiante</span>
              <input name="estudiante" required autoComplete="name" />
            </label>
            <label className="mat-field">
              <span>Grado al que aplica</span>
              <select name="grado" required defaultValue="">
                <option value="" disabled>
                  Seleccione…
                </option>
                <option>Preescolar</option>
                <option>Primaria</option>
                <option>Secundaria</option>
              </select>
            </label>
            <label className="mat-field">
              <span>Nombre del acudiente</span>
              <input name="acudiente" required />
            </label>
            <label className="mat-field">
              <span>Correo del acudiente</span>
              <input name="correo" type="email" required autoComplete="email" />
            </label>
            <label className="mat-field">
              <span>Teléfono / WhatsApp</span>
              <input name="telefono" type="tel" required autoComplete="tel" />
            </label>
            <label className="mat-field mat-field--full">
              <span>Observaciones</span>
              <textarea name="notas" rows={3} />
            </label>
            <label className="mat-field mat-field--full">
              <span>Adjuntar PDF (acta, certificados, etc.)</span>
              <input name="archivo" type="file" accept="application/pdf" />
            </label>
          </div>
          <button type="submit" className="mat-submit">
            Enviar solicitud
          </button>
          {sent ? (
            <p className="mat-sent" role="status">
              Solicitud simulada: en producción se notificará al acudiente y al
              Admin.
            </p>
          ) : null}
        </form>
      </section>

      <ul className="mat-steps">
        {STEPS.map((s, i) => (
          <li key={s.id} className="mat-step">
            <div className={`mat-step-icon mat-step-icon--${s.tone}`}>
              {i + 1}
            </div>
            <div>
              <p className="mat-step-title">{s.title}</p>
              <p className="mat-step-body">{s.body}</p>
            </div>
          </li>
        ))}
      </ul>

      <section className="mat-faq" aria-labelledby="mat-faq-title">
        <h3 id="mat-faq-title" className="mat-faq-title">
          Preguntas frecuentes
        </h3>
        <div className="mat-faq-list">
          {FAQ.map((item) => {
            const open = faqOpen === item.q
            return (
              <div key={item.q} className="mat-faq-item">
                <button
                  type="button"
                  className="mat-faq-q"
                  aria-expanded={open}
                  onClick={() => setFaqOpen(open ? null : item.q)}
                >
                  {item.q}
                </button>
                {open ? <p className="mat-faq-a">{item.a}</p> : null}
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}

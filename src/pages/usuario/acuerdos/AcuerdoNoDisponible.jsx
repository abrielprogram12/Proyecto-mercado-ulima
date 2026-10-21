import EstadoVacio from '../../../components/EstadoVacio/EstadoVacio';

export default function AcuerdoNoDisponible() {
  return (
    <div className="page-container">
      <EstadoVacio
        icono="🔍"
        titulo="No encontramos este acuerdo"
        descripcion="Puede que el enlace esté mal escrito o que el acuerdo pertenezca a otra cuenta."
        textoBoton="Ir a mis acuerdos"
        rutaBoton="/acuerdos"
      />
    </div>
  );
}

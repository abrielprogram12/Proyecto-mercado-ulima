import React, { useMemo, useRef, useState } from "react";
import {
  Search, Plus, ChevronDown, BookOpen, Heart, HandCoins, Handshake,
  Star, UserRound, Menu, Bell, MoreHorizontal, Pencil, Copy, Pause,
  Play, CheckCircle2, Trash2, ImagePlus, X, Upload, ArrowLeft,
  Check, AlertCircle, SlidersHorizontal, ExternalLink, BookMarked
} from "lucide-react";
import { initialPublications } from "./data.js";

const statuses = ["Todos", "Publicado", "Pausado", "Borrador", "Vendido"];
const conditions = ["Como nuevo", "Muy buen estado", "Buen estado", "Con marcas de uso"];
const blankForm = {
  title: "", description: "", category: "", course: "", condition: "",
  price: "", acceptsOffers: true, minimumPrice: "", photos: []
};
const art = {
  book: { emoji: "📘", label: "LIBRO", bg: "linear-gradient(145deg,#e9ddd0,#b88b65)" },
  calc: { emoji: "🧮", label: "CALCULADORA", bg: "linear-gradient(145deg,#e6e5df,#aaa99f)" },
  tools: { emoji: "📐", label: "INSTRUMENTOS", bg: "linear-gradient(145deg,#e7d6b9,#c29a69)" }
};

function StatusTag({ status }) {
  const cls = status.toLowerCase().replace("ó", "o");
  return <span className={`status status-${cls}`}>{status}</span>;
}
function ProductThumb({ kind, large = false }) {
  const item = art[kind];
  if (!item) return <div className={`product-thumb no-photo ${large ? "large" : ""}`}><ImagePlus size={large ? 30 : 20}/><span>Sin foto</span></div>;
  return <div className={`product-thumb ${large ? "large" : ""}`} style={{background:item.bg}} aria-label={item.label}>
    <span className="thumb-emoji">{item.emoji}</span><small>{item.label}</small>
  </div>;
}
function Toast({ toast, onClose }) {
  if (!toast) return null;
  return <div className={`toast ${toast.type || "success"}`} role="status">
    {toast.type === "error" ? <AlertCircle size={18}/> : <CheckCircle2 size={18}/>}
    <span>{toast.message}</span><button className="icon-btn" onClick={onClose} aria-label="Cerrar aviso"><X size={16}/></button>
  </div>;
}
function Modal({ title, children, onClose, footer, danger = false }) {
  return <div className="modal-backdrop" role="presentation" onMouseDown={e => e.target === e.currentTarget && onClose()}>
    <section className="modal" role="dialog" aria-modal="true" aria-label={title}>
      <div className="modal-heading"><h2>{title}</h2><button className="icon-btn" onClick={onClose} aria-label="Cerrar"><X size={19}/></button></div>
      <div className="modal-content">{children}</div>
      <div className={`modal-footer ${danger ? "danger-footer" : ""}`}>{footer}</div>
    </section>
  </div>;
}

export default function App() {
  const [publications, setPublications] = useState(initialPublications);
  const [activeStatus, setActiveStatus] = useState("Todos");
  const [search, setSearch] = useState("");
  const [screen, setScreen] = useState("list");
  const [form, setForm] = useState(blankForm);
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});
  const [showSummaryError, setShowSummaryError] = useState(false);
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState(null);
  const [photoError, setPhotoError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const fileRef = useRef(null);

  const notify = (message, type = "success") => {
    setToast({ message, type });
    window.setTimeout(() => setToast(null), 4200);
  };
  const counts = useMemo(() => Object.fromEntries(statuses.map(s => [
    s, s === "Todos" ? publications.length : publications.filter(p => p.status === s).length
  ])), [publications]);
  const visible = useMemo(() => publications.filter(p =>
    (activeStatus === "Todos" || p.status === activeStatus) &&
    `${p.title} ${p.description} ${p.category} ${p.course}`.toLowerCase().includes(search.toLowerCase())
  ), [publications, activeStatus, search]);
  const totalOffers = publications.reduce((sum, p) => sum + p.offers, 0);

  function startNew() {
    setEditingId(null); setForm({...blankForm}); setErrors({}); setShowSummaryError(false);
    setPhotoError(""); setScreen("form");
  }
  function startEdit(p) {
    setEditingId(p.id);
    setForm({title:p.title, description:p.description, category:p.category, course:p.course,
      condition:p.condition, price:String(p.price), acceptsOffers:p.acceptsOffers,
      minimumPrice:String(p.minimumPrice), photos:[...(p.photos || [])]});
    setErrors({}); setShowSummaryError(false); setPhotoError(""); setScreen("form");
  }
  function duplicate(p) {
    setEditingId(null);
    setForm({title:p.title, description:p.description, category:p.category, course:p.course,
      condition:p.condition, price:String(p.price), acceptsOffers:p.acceptsOffers,
      minimumPrice:String(p.minimumPrice), photos:[...(p.photos || [])]});
    setErrors({}); setShowSummaryError(false); setScreen("form");
    notify("Aviso duplicado como borrador. Revisa los datos antes de publicarlo.");
  }
  function updateField(key, value) {
    setForm(prev => ({...prev, [key]:value}));
    setErrors(prev => ({...prev, [key]:undefined}));
    setShowSummaryError(false);
  }
  function validate(forPublish) {
    const next = {};
    if (!form.title.trim() || form.title.trim().length < 15 || !/[a-záéíóúñ].*\s.+/i.test(form.title.trim())) next.title = "Incluye un título de al menos 15 caracteres e identifica autor o modelo.";
    if (!form.description.trim() || form.description.trim().length < 20) next.description = "Escribe una descripción de al menos 20 caracteres.";
    if (!form.category) next.category = "Selecciona una categoría.";
    if (!form.condition) next.condition = "Selecciona el estado del producto.";
    if (!form.price || Number(form.price) <= 0) next.price = "Ingresa un precio mayor que S/ 0.";
    if (form.acceptsOffers && (!form.minimumPrice || Number(form.minimumPrice) <= 0)) next.minimumPrice = "Indica el monto mínimo que aceptarías.";
    else if (form.acceptsOffers && Number(form.minimumPrice) > Number(form.price)) next.minimumPrice = "El monto mínimo no puede superar el precio pedido.";
    if (forPublish && form.photos.length === 0) next.photos = "Agrega al menos una fotografía para publicar.";
    setErrors(next); setShowSummaryError(Object.keys(next).length > 0);
    return Object.keys(next).length === 0;
  }
  function saveDraft() {
    const next = {};
    if (!form.title.trim()) next.title = "Completa el título para identificar el borrador.";
    if (form.price && Number(form.price) <= 0) next.price = "El precio debe ser mayor que S/ 0.";
    if (form.acceptsOffers && form.minimumPrice && Number(form.minimumPrice) > Number(form.price)) next.minimumPrice = "El monto mínimo no puede superar el precio pedido.";
    setErrors(next); setShowSummaryError(Object.keys(next).length > 0);
    if (Object.keys(next).length) { notify("Revisa los campos marcados antes de guardar.", "error"); return; }
    savePublication("Borrador");
  }
  function savePublication(status) {
    const record = {
      id: editingId || Math.max(0, ...publications.map(p => p.id)) + 1,
      title:form.title.trim(), description:form.description.trim(), category:form.category,
      course:form.course.trim(), condition:form.condition, price:Number(form.price),
      acceptsOffers:form.acceptsOffers, minimumPrice:form.acceptsOffers ? Number(form.minimumPrice || form.price) : Number(form.price),
      status, offers: editingId ? (publications.find(p=>p.id===editingId)?.offers || 0) : 0,
      published: status === "Publicado" ? "Hoy" : "—",
      photos:form.photos, cover:form.photos[0] || ""
    };
    setPublications(prev => editingId ? prev.map(p=>p.id===editingId ? {...p,...record} : p) : [record,...prev]);
    setScreen("list"); setActiveStatus("Todos"); setSearch("");
    notify(status === "Publicado" ? "Aviso publicado correctamente." : editingId ? "Cambios guardados." : "Borrador guardado correctamente.");
  }
  function submitPublish() {
    if (!validate(true)) {
      notify("No pudimos publicar el aviso. Revisa los campos señalados.", "error");
      return;
    }
    savePublication("Publicado");
  }
  function changeStatus(p, status) {
    setPublications(prev=>prev.map(item=>item.id===p.id ? {...item,status,published:status==="Publicado" ? "Hoy" : item.published} : item));
    setModal(null); notify(status==="Vendido" ? "Aviso marcado como vendido; ya no aparece en el catálogo." : status==="Pausado" ? "Aviso pausado correctamente." : "Aviso reactivado y publicado.");
  }
  function requestDelete(p) {
    setModal({type:"delete", publication:p, typed:""});
  }
  function confirmDelete() {
    const p = modal.publication;
    if (p.offers > 0 && modal.typed !== "ELIMINAR") return;
    setPublications(prev=>prev.filter(item=>item.id!==p.id));
    setModal(null); notify("Aviso eliminado correctamente.");
  }
  function handleFiles(files) {
    const incoming = Array.from(files || []);
    if (!incoming.length) return;
    setPhotoError("");
    const valid = [];
    for (const file of incoming) {
      if (!["image/jpeg","image/png"].includes(file.type)) { setPhotoError("Solo se admiten archivos JPG o PNG."); continue; }
      if (file.size > 5 * 1024 * 1024) { setPhotoError("La imagen supera 5 MB."); continue; }
      valid.push(file.name);
    }
    const available = 6 - form.photos.length;
    if (valid.length > available) setPhotoError("Puedes agregar como máximo 6 fotografías.");
    const accepted = valid.slice(0, available);
    if (accepted.length) {
      setUploading(true);
      window.setTimeout(() => {
        setForm(prev=>({...prev,photos:[...prev.photos,...accepted]}));
        setUploading(false);
        notify(`${accepted.length} fotografía(s) agregada(s).`);
      }, 550);
    }
    if (valid.length && !available) setPhotoError("Ya alcanzaste el límite de 6 fotografías.");
  }
  function removePhoto(index) {
    setForm(prev=>({...prev,photos:prev.photos.filter((_,i)=>i!==index)}));
  }
  function movePhoto(index, direction) {
    const target = index + direction;
    if (target < 0 || target >= form.photos.length) return;
    setForm(prev => {
      const photos=[...prev.photos]; [photos[index],photos[target]]=[photos[target],photos[index]];
      return {...prev,photos};
    });
  }
  function navigateScreen(next) { setScreen(next); setMobileNav(false); }

  return <div className="app-shell">
    <header className="topbar">
      <div className="topbar-inner">
        <button className="mobile-menu icon-btn" onClick={()=>setMobileNav(!mobileNav)} aria-label="Abrir menú"><Menu/></button>
        <button className="brand" onClick={()=>navigateScreen("list")}><span className="brand-mark"><BookOpen size={22}/></span><span>Tablón <b>ULima</b></span></button>
        <div className="global-search"><Search size={18}/><input aria-label="Buscar en el tablón" placeholder="Buscar libros, calculadoras, apuntes…" value={search} onChange={e=>{setSearch(e.target.value);setScreen("list");}}/><kbd>⌘ K</kbd></div>
        <button className="btn btn-primary top-publish" onClick={startNew}><Plus size={17}/> Publicar aviso</button>
        <button className="user-menu" onClick={()=>notify("Sesión de demostración: estudiante ULima.")}><span className="avatar">NC</span><span className="user-name">Nicole C.</span><ChevronDown size={15}/></button>
      </div>
    </header>
    <nav className={`main-nav ${mobileNav ? "nav-open" : ""}`} aria-label="Navegación principal">
      <div className="nav-inner">
        <button onClick={()=>navigateScreen("list")}><BookOpen size={16}/> Catálogo</button>
        <button className="active" onClick={()=>navigateScreen("list")}><BookMarked size={16}/> Mis publicaciones</button>
        <button onClick={()=>notify("La sección Favoritos pertenece a la HU-3.")}><Heart size={16}/> Favoritos</button>
        <button onClick={()=>notify("La gestión de ofertas corresponde a la HU-4.")}><HandCoins size={16}/> Ofertas <span className="nav-count">{totalOffers}</span></button>
        <button onClick={()=>notify("Los acuerdos corresponden a la HU-5.")}><Handshake size={16}/> Acuerdos</button>
        <button onClick={()=>notify("Las calificaciones corresponden a la HU-6.")}><Star size={16}/> Calificaciones</button>
        <button onClick={()=>notify("La cuenta corresponde a la HU-1.")}><UserRound size={16}/> Mi cuenta</button>
      </div>
    </nav>

    <main className="page">
      {screen === "list" && <section className="list-screen">
        <div className="breadcrumbs"><span>Inicio</span><span className="crumb-sep">/</span><b>Mis publicaciones</b></div>
        <div className="page-heading">
          <div><p className="eyebrow">TU ESPACIO DE VENTA</p><h1>Mis publicaciones</h1><p className="subheading">{publications.length} avisos <span>·</span> {totalOffers} ofertas recibidas en total</p></div>
          <button className="btn btn-primary" onClick={startNew}><Plus size={18}/> Nuevo aviso</button>
        </div>
        <div className="list-toolbar">
          <div className="status-tabs" role="tablist" aria-label="Filtrar por estado">
            {statuses.map(s=><button key={s} role="tab" aria-selected={activeStatus===s} className={activeStatus===s?"selected":""} onClick={()=>setActiveStatus(s)}>{s==="Publicado"?"Publicados":s==="Pausado"?"Pausados":s==="Borrador"?"Borradores":s==="Vendido"?"Vendidos":s} <span>{counts[s]}</span></button>)}
          </div>
          <div className="list-search"><Search size={17}/><input placeholder="Buscar en mis avisos…" value={search} onChange={e=>setSearch(e.target.value)}/><SlidersHorizontal size={16}/></div>
        </div>
        {visible.length > 0 ? <div className="table-card">
          <div className="table-scroll"><table>
            <thead><tr><th>FOTO</th><th>AVISO</th><th>PRECIO</th><th>ESTADO</th><th>OFERTAS</th><th>PUBLICADO</th><th><span className="sr-only">Acciones</span></th></tr></thead>
            <tbody>{visible.map(p=><tr key={p.id}>
              <td><ProductThumb kind={p.cover}/></td>
              <td className="notice-cell"><button className="notice-title" onClick={()=>startEdit(p)}>{p.title}</button><span>{p.category}{p.course ? ` · ${p.course}` : ""}</span></td>
              <td className="price-cell">S/ {Number(p.price).toFixed(2)}</td>
              <td><StatusTag status={p.status}/></td>
              <td><span className={`offer-count ${p.offers ? "has-offers" : ""}`}>{p.offers}</span></td>
              <td className="date-cell">{p.published}</td>
              <td><div className="row-actions">
                <button className="icon-btn" title="Editar aviso" aria-label="Editar aviso" onClick={()=>startEdit(p)}><Pencil size={16}/></button>
                <div className="dropdown-wrap"><button className="icon-btn" title="Más acciones" aria-label="Más acciones" onClick={()=>setModal({type:"actions",publication:p})}><MoreHorizontal size={18}/></button></div>
              </div></td>
            </tr>)}</tbody>
          </table></div>
          <div className="table-bottom"><span>Mostrando <b>{visible.length}</b> de <b>{publications.length}</b> avisos</span><span className="muted">Los cambios se guardan en esta sesión de demostración.</span></div>
        </div> : <div className="empty-state">
          <div className="empty-illustration"><BookOpen size={38}/><span>+</span></div>
          <h2>{publications.length === 0 ? "Todavía no publicas nada" : "No encontramos avisos"}</h2>
          <p>{publications.length === 0 ? "Ese libro del ciclo pasado le puede servir a alguien esta semana. Publicar un aviso toma menos de tres minutos." : "Prueba con otra búsqueda o cambia el filtro de estado."}</p>
          <div className="empty-actions"><button className="btn btn-primary" onClick={startNew}><Plus size={17}/> Crear mi primer aviso</button><button className="btn btn-secondary" onClick={()=>{setActiveStatus("Todos");setSearch("");}}>Ver todos los avisos</button></div>
        </div>}
        <div className="helper-strip"><div className="helper-icon"><BookOpen size={18}/></div><div><b>¿Listo para darles una segunda vida a tus materiales?</b><p>Publica fotos claras, describe el estado real y define un precio justo.</p></div><button onClick={()=>notify("Consejo: usa luz natural y muestra el estado del producto.")}>Consejos para publicar <ExternalLink size={14}/></button></div>
      </section>}

      {screen === "form" && <section className="form-screen">
        <div className="breadcrumbs"><button onClick={()=>navigateScreen("list")}>Mis publicaciones</button><span className="crumb-sep">/</span><b>{editingId ? "Editar aviso" : "Nuevo aviso"}</b></div>
        <div className="page-heading form-heading"><div><p className="eyebrow">{editingId ? "ACTUALIZA TU AVISO" : "COMPARTE CON LA COMUNIDAD"}</p><h1>{editingId ? "Editar aviso" : "Nuevo aviso"}</h1><p className="subheading">Completa los detalles para que tus compañeros encuentren tu material.</p></div><span className="step-indicator">Paso 1 de 1 <span>·</span> Datos del aviso</span></div>
        {showSummaryError && <div className="form-alert"><AlertCircle size={19}/><div><b>No pudimos publicar el aviso.</b><p>Revisa {Object.keys(errors).length} campo(s) señalado(s) antes de continuar.</p></div></div>}
        <div className="form-layout">
          <div className="form-main">
            <section className="form-card">
              <div className="section-title"><span className="section-number">1</span><div><h2>Producto</h2><p>Cuéntanos qué estás vendiendo.</p></div></div>
              <div className="field"><label htmlFor="title">Título del aviso <em>*</em></label><input id="title" className={errors.title?"invalid":""} value={form.title} maxLength={80} placeholder="Ej. Cálculo de una variable — James Stewart, 8.ª edición" onChange={e=>updateField("title",e.target.value)}/><div className="field-meta"><span className={errors.title?"error-text":""}>{errors.title || "Incluye autor y edición o modelo: así lo buscan tus compañeros."}</span><span>{form.title.length}/80 caracteres</span></div></div>
              <div className="field"><label htmlFor="description">Descripción <em>*</em></label><textarea id="description" rows="4" className={errors.description?"invalid":""} value={form.description} placeholder="Describe el estado, detalles de uso y qué incluye…" onChange={e=>updateField("description",e.target.value)}/>{errors.description && <small className="error-text">{errors.description}</small>}</div>
              <div className="field-grid">
                <div className="field"><label htmlFor="category">Categoría <em>*</em></label><select id="category" className={errors.category?"invalid":""} value={form.category} onChange={e=>updateField("category",e.target.value)}><option value="">Selecciona una categoría</option>{["Libros","Calculadoras","Apuntes","Instrumentos","Otros"].map(x=><option key={x}>{x}</option>)}</select>{errors.category && <small className="error-text">{errors.category}</small>}</div>
                <div className="field"><label htmlFor="course">Curso asociado <span className="optional">(opcional)</span></label><input id="course" value={form.course} placeholder="Ej. Cálculo I" onChange={e=>updateField("course",e.target.value)}/></div>
              </div>
            </section>
            <section className="form-card">
              <div className="section-title"><span className="section-number">2</span><div><h2>Condición del producto</h2><p>Sé transparente sobre su estado actual.</p></div></div>
              <div className="condition-options">{conditions.map((c,i)=><button type="button" key={c} className={`condition-option ${form.condition===c?"chosen":""}`} onClick={()=>updateField("condition",c)}><span className="condition-dot">{form.condition===c?<Check size={14}/>:null}</span><span><b>{c}</b><small>{["Sin señales visibles de uso","Casi sin señales de uso","Funcional y bien conservado","Tiene marcas, anotaciones o desgaste"][i]}</small></span></button>)}</div>
              {errors.condition && <small className="error-text">{errors.condition}</small>}
            </section>
            <section className="form-card">
              <div className="section-title"><span className="section-number">3</span><div><h2>Precio y ofertas</h2><p>Establece tu precio y si estás dispuesto a negociar.</p></div></div>
              <div className="field price-input"><label htmlFor="price">Precio pedido <em>*</em></label><div className={`money-input ${errors.price?"invalid":""}`}><span>S/</span><input id="price" type="number" min="1" step="0.5" value={form.price} placeholder="0.00" onChange={e=>updateField("price",e.target.value)}/></div><small className="field-hint">Precio en soles (S/).</small>{errors.price && <small className="error-text">{errors.price}</small>}</div>
              <label className="toggle-row"><span><b>Acepto ofertas por un monto menor</b><small>Los compradores podrán proponer un precio inferior al pedido.</small></span><input type="checkbox" checked={form.acceptsOffers} onChange={e=>updateField("acceptsOffers",e.target.checked)}/><span className="toggle-ui"/></label>
              {form.acceptsOffers && <div className="field min-price"><label htmlFor="minimumPrice">Monto mínimo que aceptarías <em>*</em></label><div className={`money-input ${errors.minimumPrice?"invalid":""}`}><span>S/</span><input id="minimumPrice" type="number" min="1" step="0.5" value={form.minimumPrice} placeholder="0.00" onChange={e=>updateField("minimumPrice",e.target.value)}/></div>{errors.minimumPrice && <small className="error-text">{errors.minimumPrice}</small>}</div>}
            </section>
            <section className="form-card">
              <div className="section-title"><span className="section-number">4</span><div><h2>Fotografías</h2><p>Agrega hasta 6 fotos. La primera será la portada.</p></div><button type="button" className="btn btn-secondary photo-manage-link" onClick={()=>navigateScreen("photos")}>Gestionar fotos</button><span className="photo-counter">{form.photos.length} de 6</span></div>
              <div className="upload-zone" onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();handleFiles(e.dataTransfer.files);}}>
                <div className="upload-icon"><Upload size={23}/></div><b>Arrastra tus fotos aquí</b><span>o</span><button type="button" className="btn btn-secondary" onClick={()=>fileRef.current?.click()}>Elegir archivos</button><small>JPG o PNG · Máximo 5 MB por imagen</small>
                <input ref={fileRef} type="file" accept="image/jpeg,image/png" multiple hidden onChange={e=>{handleFiles(e.target.files);e.target.value="";}}/>
              </div>
              {uploading && <div className="upload-progress"><span>Subiendo fotografías…</span><div><i/></div><b>62 %</b></div>}
              {photoError && <div className="inline-alert"><AlertCircle size={16}/>{photoError}<button className="icon-btn" onClick={()=>setPhotoError("")}><X size={14}/></button></div>}
              {errors.photos && <small className="error-text">{errors.photos}</small>}
              {form.photos.length>0 && <div className="photo-grid">{form.photos.map((photo,i)=><div className="photo-item" key={`${photo}-${i}`}><div className="photo-placeholder"><span>{photo.length>18?photo.slice(0,15)+"…":photo}</span><button className="photo-remove" type="button" onClick={()=>removePhoto(i)} aria-label="Quitar foto"><X size={14}/></button></div>{i===0?<span className="cover-tag">Portada</span>:<button type="button" className="make-cover" onClick={()=>movePhoto(i,-1)}>← Mover al inicio</button>}<div className="photo-order"><button type="button" disabled={i===0} onClick={()=>movePhoto(i,-1)} aria-label="Mover foto a la izquierda">←</button><span>{i+1}</span><button type="button" disabled={i===form.photos.length-1} onClick={()=>movePhoto(i,1)} aria-label="Mover foto a la derecha">→</button></div></div>)}</div>}
            </section>
            <div className="form-actions"><button className="btn btn-ghost" onClick={()=>setModal({type:"cancel"})}>Cancelar</button><div><button className="btn btn-secondary" onClick={saveDraft}>Guardar borrador</button><button className="btn btn-primary" onClick={submitPublish}><CheckCircle2 size={17}/> {editingId?"Guardar cambios":"Publicar aviso"}</button></div></div>
          </div>
          <aside className="preview-column">
            <div className="preview-card"><div className="preview-heading"><h3>Vista previa</h3><span>ASÍ LO VERÁN</span></div><div className="preview-product"><ProductThumb kind={form.photos[0] && art[form.photos[0]] ? form.photos[0] : ""} large/><div className="preview-info"><span className="preview-category">{form.category || "Categoría"}</span><h4>{form.title || "Título de tu aviso"}</h4><p>{form.condition || "Estado del producto"}</p><strong>S/ {form.price ? Number(form.price).toFixed(2) : "0.00"}</strong>{form.acceptsOffers && <span className="offer-accept"><HandCoins size={13}/> Acepta ofertas</span>}</div></div><div className="preview-note"><span className="note-icon">✦</span><div><b>Un buen aviso se vende mejor</b><p>Usa luz natural, muestra los detalles y agrega al menos 3 fotos desde distintos ángulos.</p></div></div></div>
            <div className="privacy-note"><CheckCircle2 size={17}/><p><b>Compra y venta entre estudiantes</b><br/>Coordina entregas dentro del campus y revisa el material antes de cerrar el acuerdo.</p></div>
          </aside>
        </div>
      </section>}

      {screen === "photos" && <section className="photo-screen">
        <div className="breadcrumbs"><button onClick={()=>navigateScreen("list")}>Mis publicaciones</button><span>/</span><button onClick={()=>startEdit(publications[0])}>Editar aviso</button><span>/</span><b>Fotografías</b></div>
        <div className="page-heading"><div><p className="eyebrow">GESTIONA TUS IMÁGENES</p><h1>Fotografías del aviso</h1><p className="subheading">La primera fotografía será la portada que verán en el catálogo.</p></div></div>
        <section className="form-card standalone-photo-card"><div className="section-title"><span className="section-number"><ImagePlus size={18}/></span><div><h2>Galería de fotografías</h2><p>Máximo 6 imágenes · JPG o PNG · 5 MB por archivo</p></div><span className="photo-counter">{form.photos.length} de 6</span></div>
          <div className="upload-zone" onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();handleFiles(e.dataTransfer.files);}}><Upload size={25}/><b>Arrastra las imágenes para subirlas</b><button className="btn btn-secondary" onClick={()=>fileRef.current?.click()}>Buscar en mi equipo</button><input ref={fileRef} type="file" accept="image/jpeg,image/png" multiple hidden onChange={e=>{handleFiles(e.target.files);e.target.value="";}}/></div>
          {uploading && <div className="upload-progress"><span>Subiendo 62 %</span><div><i/></div><b>62 %</b></div>}{photoError && <div className="inline-alert">{photoError}</div>}
          <div className="photo-grid larger">{form.photos.map((photo,i)=><div className="photo-item" key={`${photo}-${i}`}><div className="photo-placeholder"><span>{photo}</span><button className="photo-remove" onClick={()=>removePhoto(i)}><X size={14}/></button></div>{i===0?<span className="cover-tag">Foto principal</span>:<button className="make-cover" onClick={()=>movePhoto(i,-1)}>Hacer principal</button>}<div className="photo-order"><button disabled={i===0} onClick={()=>movePhoto(i,-1)}>←</button><span>Posición {i+1}</span><button disabled={i===form.photos.length-1} onClick={()=>movePhoto(i,1)}>→</button></div></div>)}</div>
          <div className="form-actions"><button className="btn btn-ghost" onClick={()=>navigateScreen("list")}>Cancelar</button><button className="btn btn-primary" onClick={()=>{notify("Fotografías guardadas.");navigateScreen("list");}}>Guardar fotografías</button></div>
        </section>
      </section>}

      <footer className="footer"><div className="footer-brand"><span className="brand-mark small"><BookOpen size={16}/></span><span>Tablón <b>ULima</b></span></div><span>Universidad de Lima · Campus Monterrico</span><div><button onClick={()=>notify("Reglas de uso: publica información veraz y coordina entregas seguras.")}>Reglas de uso</button><button onClick={()=>notify("Ayuda: soporte del tablón universitario.")}>Ayuda</button><button onClick={()=>notify("Correo de soporte: soporte@ulima.edu.pe")}>Contacto</button></div><small>Proyecto académico · Programación Web 2026-2</small></footer>
    </main>

    {modal?.type==="actions" && <Modal title="Acciones del aviso" onClose={()=>setModal(null)} footer={<button className="btn btn-secondary" onClick={()=>setModal(null)}>Cerrar</button>}>
      <div className="action-modal-product"><ProductThumb kind={modal.publication.cover}/><div><b>{modal.publication.title}</b><p>S/ {modal.publication.price.toFixed(2)} · <StatusTag status={modal.publication.status}/></p></div></div>
      <div className="action-list">
        <button onClick={()=>{const p=modal.publication;setModal(null);startEdit(p);}}><Pencil size={17}/><span><b>Editar aviso</b><small>Modifica los datos, precio o fotos.</small></span></button>
        <button onClick={()=>{const p=modal.publication;setModal(null);duplicate(p);}}><Copy size={17}/><span><b>Duplicar como borrador</b><small>Crea un nuevo aviso con los mismos datos.</small></span></button>
        {modal.publication.status==="Publicado" && <button onClick={()=>changeStatus(modal.publication,"Pausado")}><Pause size={17}/><span><b>Pausar aviso</b><small>Dejará de aparecer en el catálogo.</small></span></button>}
        {modal.publication.status==="Pausado" && <button onClick={()=>changeStatus(modal.publication,"Publicado")}><Play size={17}/><span><b>Reactivar aviso</b><small>Volverá a aparecer en el catálogo.</small></span></button>}
        {modal.publication.status!=="Vendido" && <button onClick={()=>changeStatus(modal.publication,"Vendido")}><CheckCircle2 size={17}/><span><b>Marcar como vendido</b><small>Se retirará del catálogo.</small></span></button>}
        <button className="danger-action" onClick={()=>requestDelete(modal.publication)}><Trash2 size={17}/><span><b>Eliminar aviso</b><small>Esta acción no se puede deshacer.</small></span></button>
      </div>
    </Modal>}
    {modal?.type==="delete" && <Modal title="Eliminar aviso" danger onClose={()=>setModal(null)} footer={<><button className="btn btn-secondary" onClick={()=>setModal(null)}>Cancelar</button><button className="btn btn-danger" disabled={modal.publication.offers>0 && modal.typed!=="ELIMINAR"} onClick={confirmDelete}><Trash2 size={16}/> Eliminar aviso</button></>}>
      <div className="warning-box"><AlertCircle size={21}/><div><b>Esta acción es irreversible.</b><p>Vas a eliminar “{modal.publication.title}”.</p></div></div>
      {modal.publication.offers>0 ? <><p>Este aviso tiene <b>{modal.publication.offers} ofertas activas</b>. Se rechazarán automáticamente al eliminarlo.</p><div className="field"><label htmlFor="confirm-delete">Escribe <b>ELIMINAR</b> para confirmar</label><input id="confirm-delete" value={modal.typed} onChange={e=>setModal(prev=>({...prev,typed:e.target.value}))} placeholder="ELIMINAR"/></div></> : <p>¿Confirmas que deseas eliminar este aviso? No podrás recuperarlo.</p>}
    </Modal>}
    {modal?.type==="cancel" && <Modal title="¿Salir sin guardar?" onClose={()=>setModal(null)} footer={<><button className="btn btn-secondary" onClick={()=>setModal(null)}>Seguir editando</button><button className="btn btn-danger" onClick={()=>{setModal(null);setScreen("list");notify("Cambios descartados.","error");}}>Salir sin guardar</button></>}>
      <p>Los cambios que no hayas guardado se perderán. ¿Quieres volver a Mis publicaciones?</p>
    </Modal>}
    <Toast toast={toast} onClose={()=>setToast(null)}/>
  </div>;
}
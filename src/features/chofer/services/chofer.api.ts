import { ChoferRoute } from "../models";

// These invoices match the all-Listo orders in the shared logistics store (by invoiceNumber).
// Their areas will be overridden at render time with the shared semaphore state.
const MOCK_ROUTE: ChoferRoute = {
  id: "route-001",
  driverName: "Carlos Ramírez",
  date: "19 de Marzo 2026",
  totalPendingInvoices: 5,
  invoices: [
    {
      id: "chofer-1",
      invoiceNumber: "#1023",
      client: {
        name: "Herrajes y Perfiles SA",
        initials: "MH",
        address: "Calle Fresno #145, Col. Industrial, Monterrey, NL",
        phone: "+52 81 2345 6789",
        deliveryDate: "19 de marzo 2026",
      },
      areas: { aluminio: "Listo", vidrio: "Listo", herrajes: "Listo" },
      overallState: "Listo",
      items: [
        { id: "he-01", warehouse: "Herrajes", description: "Bisagra oculta europeo 110° (pack x10)", quantity: 40, weightPerUnit: 0.45, section: "H-3" },
        { id: "he-02", warehouse: "Herrajes", description: "Jaladera tubular acero inox 30cm", quantity: 20, weightPerUnit: 0.38, section: "H-3" },
        { id: "al-01", warehouse: "Aluminio", description: "Perfil marco recto 2.5m (plateado)", quantity: 30, weightPerUnit: 1.8, section: "7" },
        { id: "vi-01", warehouse: "Vidrio", description: "Cristal claro 4mm 60×90cm", quantity: 15, weightPerUnit: 5.8, section: "1" },
      ],
    },
    {
      id: "chofer-2",
      invoiceNumber: "#1021",
      client: {
        name: "Vidrios San Pedro",
        initials: "UD",
        address: "Av. Revolución #832, San Pedro Garza García, NL",
        phone: "+52 81 3456 7890",
        deliveryDate: "19 de marzo 2026",
      },
      areas: { aluminio: "Listo", vidrio: "Listo", herrajes: "Listo" },
      overallState: "Listo",
      items: [
        { id: "vi-02", warehouse: "Vidrio", description: "Vidrio templado 8mm (120×200cm)", quantity: 8, weightPerUnit: 42.0, section: "2" },
        { id: "vi-03", warehouse: "Vidrio", description: "Cristal esmerilado satinado 6mm", quantity: 4, weightPerUnit: 22.5, section: "1" },
        { id: "al-02", warehouse: "Aluminio", description: "Perfil serie 45 anodizado plata", quantity: 18, weightPerUnit: 2.1, section: "3" },
        { id: "he-03", warehouse: "Herrajes", description: "Cerradura embutida multipunto", quantity: 6, weightPerUnit: 1.2, section: "H-1" },
      ],
    },
    {
      id: "chofer-3",
      invoiceNumber: "#1016",
      client: {
        name: "Perfiles Blancos del Norte",
        initials: "PB",
        address: "Blvd. Constitución #2010, Col. Centro, Monterrey, NL",
        phone: "+52 81 4567 8901",
        deliveryDate: "19 de marzo 2026",
      },
      areas: { aluminio: "Listo", vidrio: "Listo", herrajes: "Listo" },
      overallState: "Listo",
      items: [
        { id: "al-03", warehouse: "Aluminio", description: "Perfil blanco brillante serie 60", quantity: 50, weightPerUnit: 1.95, section: "11" },
        { id: "al-04", warehouse: "Aluminio", description: "Perfil U blanco 3m c/u", quantity: 24, weightPerUnit: 1.1, section: "11" },
        { id: "vi-04", warehouse: "Vidrio", description: "Vidrio reflectivo bronce 6mm", quantity: 10, weightPerUnit: 30.0, section: "2" },
        { id: "he-04", warehouse: "Herrajes", description: "Riel corredizo aluminio 2m", quantity: 12, weightPerUnit: 0.85, section: "H-2" },
      ],
    },
    {
      id: "chofer-4",
      invoiceNumber: "#1012",
      client: {
        name: "Fachadas de Vidrio MTY",
        initials: "FV",
        address: "Av. Lázaro Cárdenas #1500, Valle Oriente, NL",
        phone: "+52 81 5678 9012",
        deliveryDate: "19 de marzo 2026",
      },
      areas: { aluminio: "Listo", vidrio: "Listo", herrajes: "Listo" },
      overallState: "Listo",
      items: [
        { id: "vi-05", warehouse: "Vidrio", description: "Cristal laminado de seguridad 10mm", quantity: 12, weightPerUnit: 55.0, section: "1" },
        { id: "vi-06", warehouse: "Vidrio", description: "Espejo filo biselado 4mm (60×80cm)", quantity: 8, weightPerUnit: 8.4, section: "2" },
        { id: "al-05", warehouse: "Aluminio", description: "Marco de fachada ventilada modular", quantity: 6, weightPerUnit: 5.5, section: "5" },
        { id: "he-05", warehouse: "Herrajes", description: "Bisagra de piso hidráulica 180°", quantity: 4, weightPerUnit: 3.8, section: "H-1" },
      ],
    },
    {
      id: "chofer-5",
      invoiceNumber: "#1010",
      client: {
        name: "Sistemas de Aluminio Regio",
        initials: "SA",
        address: "Carr. Monterrey-Saltillo Km 4, Guadalupe, NL",
        phone: "+52 81 6789 0123",
        deliveryDate: "19 de marzo 2026",
      },
      areas: { aluminio: "Listo", vidrio: "Listo", herrajes: "Listo" },
      overallState: "Listo",
      items: [
        { id: "al-06", warehouse: "Aluminio", description: "Sistema cancelería residencial S-70", quantity: 20, weightPerUnit: 3.2, section: "9" },
        { id: "al-07", warehouse: "Aluminio", description: "Perfil horizontal tapa junta 3m", quantity: 30, weightPerUnit: 0.95, section: "9" },
        { id: "vi-07", warehouse: "Vidrio", description: "Cristal DVH 6+6mm cámara aire", quantity: 6, weightPerUnit: 38.0, section: "1" },
        { id: "he-06", warehouse: "Herrajes", description: "Manija palanca satinada antipánico", quantity: 10, weightPerUnit: 0.6, section: "H-2" },
      ],
    },
    {
      id: "chofer-6",
      invoiceNumber: "#1008",
      client: {
        name: "Vidrios Regios del Noreste",
        initials: "VR",
        address: "Parque Industrial Apodaca, Av. Las Torres #310, NL",
        phone: "+52 81 7890 1234",
        deliveryDate: "19 de marzo 2026",
      },
      areas: { aluminio: "Listo", vidrio: "Listo", herrajes: "Listo" },
      overallState: "Listo",
      items: [
        { id: "vi-08", warehouse: "Vidrio", description: "Vidrio antirreflejo AR coating 5mm", quantity: 20, weightPerUnit: 18.5, section: "2" },
        { id: "al-08", warehouse: "Aluminio", description: "Perfil estructural 40×80mm 6m", quantity: 15, weightPerUnit: 6.2, section: "12" },
        { id: "he-07", warehouse: "Herrajes", description: "Tornillería inox M6 (caja x200)", quantity: 5, weightPerUnit: 2.0, section: "H-3" },
      ],
    },
  ],
};

export const choferApi = {
  getRouteDetails: async (): Promise<ChoferRoute> => {
    return new Promise((resolve) => setTimeout(() => resolve(MOCK_ROUTE), 600));
  },
};

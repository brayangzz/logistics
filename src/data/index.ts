import db from "./db.json";
import type { Order } from "@/features/logistics/models";
import type { AnticipatedOrder } from "@/lib/OrdersContext";
import type { ChoferRoute } from "@/features/chofer/models";
import type { Chofer } from "@/features/caja/hooks/useCaja";
import type { Delivery } from "@/app/(app)/supervision/choferes/data";

export const orders = db.orders as Order[];
export const anticipatedOrders = db.anticipatedOrders as AnticipatedOrder[];
export const choferRoute = db.choferRoute as ChoferRoute;
export const cajaChoferes = db.cajaChoferes as Chofer[];

export const chofereDrivers = db.choferes.drivers;
export const chofereDeliveries = db.choferes.deliveries as Delivery[];

export const asignarBlocks = db.asignarBlocks;
export const asignarOrders = db.asignarOrders;

export const autorizarDrivers = db.autorizarDrivers;

export const supervisionDrivers = db.supervisionDrivers;
export const supervisionOrders = db.supervisionOrders;

export const anticipadosPageOrders = db.anticipadosPageOrders;

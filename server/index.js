import express from "express";
import cors from "cors";
import { MercadoPagoConfig, Preference } from "mercadopago";

// Es recomendable usar variables de entorno para el token
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || 'APP_USR-6582541527769666-032217-1acc998d3d8d86724da574564e07cd9d-1014313313'
});

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Soy el server :)");
});

app.post("/create_preference", async (req, res) => {
  try {
    const body = {
      items: [{
        title: req.body.title,
        quantity: Number(req.body.quantity),
        unit_price: Number(req.body.price),
        currency_id: "COP"
      }],
      back_urls: {
        success: "https://vuelosavianconline.site/vuelos/vuelos-col/",
        failure: "https://vuelosavianconline.site/vuelos/vuelos-col/Error.html",
        pending: "https://vuelosavianconline.site/vuelos/vuelos-col/Error.html"
      },
      auto_return: "approved",
      payment_methods: {
        // Excluimos todos los métodos excepto PSE
        excluded_payment_types: [
          { id: "credit_card" },
          { id: "debit_card" },
          { id: "prepaid_card" },
          { id: "digital_wallet" },
          { id: "ticket" }
        ],
        // Fijamos el número de cuotas en 1, ya que PSE solo permite pago único
        installments: 1
      }
    };

    const preference = new Preference(client);
    const result = await preference.create({ body });

    res.json({ id: result.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear la preferencia :(" });
  }
});

export default app;

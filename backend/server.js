import express from 'express';
import cors from 'cors'
import userRouter from './routes/user.routes.js';
import shopRouter from './routes/shop.routes.js';
import productRouter from './routes/product.routes.js';
import orderRouter from './routes/order.routes.js';
import cartRouter from './routes/cart.routes.js';
import salesRouter from './routes/sales.routes.js'
import renewalsRouter from './routes/renewal.routes.js'

const app = express();
// Configuration de CORS
const corsOptions = {
    origin: ['http://localhost:5173','http://localhost:5174'],
    credentials: true,      
};


app.use(cors(corsOptions));
app.use(express.json());

// eslint-disable-next-line no-undef
const port = process.env.PORT || 8082;

app.use((req, res, next) => {
    console.log(`Requête reçue: ${req.method} ${req.url}`);
    console.log('Corps de la requête (req.body):', req.body);
    next();
});
// Utiliser les routes
app.use('/media', express.static('uploads'));
app.use('/user', userRouter);
app.use('/shops', shopRouter);
app.use('/products', productRouter);
app.use('/orders', orderRouter);
app.use('/carts', cartRouter);
app.use('/sales', salesRouter);
app.use('/renewals', renewalsRouter)

app.listen(port, ()=>{
    console.log(`Connected to the server on localhost:${port}`);
})

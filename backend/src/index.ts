import { Hono, type Context } from 'hono'
import { jwt, type JwtVariables } from 'hono/jwt'
import { envCheck, getEnv } from './env.js';
import { authorize, refreshToken } from './controllers/auth.js';
import { profile, updateProfile } from './controllers/user.js';
import { getSiteConfig, getSiteConfigAll, setSiteConfig } from './controllers/config.js';
import { catalogueDetail, catalogueList } from './controllers/catalogue.js';
import { addToCart, cartList, checkout, removeFromCart } from './controllers/cart.js';
import { storeTransactionDetail, storeTransactionList, storeTransactionStatusUpdate, transactionDetail, transactionList, transactionStatusUpdate } from './controllers/transaction.js';
import { withdrawCreate, withdrawList } from './controllers/withdraw.js';
import { hasStore, initialConfig, isAdmin } from './utils/middleware.js';
import { storeCreate, storeDetail, storeUpdate } from './controllers/store.js';
import { storeProductCreate, storeProductDelete, storeProductDetail, storeProductList, storeProductUpdate } from './controllers/product.js';
import { adminStoreDetail, adminStoreList } from './controllers/admin/store.js';
import { adminWithdrawalApproveReject, adminWithdrawalList } from './controllers/admin/withdraw.js';
import { adminTransactionDetail, adminTransactionList, adminTransactionStatusUpdate } from './controllers/admin/transaction.js';
import { adminUserDetail, adminUserList, adminUserSuspendStatusUpdate } from './controllers/admin/user.js';
import { adminProductUpdate, adminProductDetail, adminProductList } from './controllers/admin/product.js';
import { cors } from 'hono/cors';
import type { HandlerResponse } from 'hono/types';

envCheck();
const jwt_secret = getEnv('JWT_SECRET', 'default_secret');

type Variables = JwtVariables
const app = new Hono<{ Variables: Variables }>().basePath('/api');
app.use('/*', cors({ origin: '*' }))

app.get('/config', getSiteConfig);
app.post('/config', initialConfig, setSiteConfig);
app.post('/authorize', authorize);
app.post('/refresh-token', jwt({ secret: jwt_secret }), refreshToken);

app.get('/catalogues', catalogueList)
app.get('/catalogues/:sku', catalogueDetail)

const userRoute = new Hono<{ Variables: Variables }>();
userRoute.use('/*', jwt({ secret: jwt_secret }))

userRoute.get('/profile', profile);
userRoute.patch('/profile', updateProfile);

userRoute.get('/carts', cartList)
userRoute.post('/carts', addToCart)
userRoute.delete('/carts/:id', removeFromCart)
userRoute.post('/checkout', checkout)

userRoute.get('/transactions', transactionList)
userRoute.get('/transactions/:id', transactionDetail)
userRoute.patch('/transactions/:id/status', transactionStatusUpdate)

userRoute.get('/withdrawals', withdrawList)
userRoute.post('/withdrawals', withdrawCreate)

userRoute.post('/stores', storeCreate)
userRoute.get('/stores', hasStore, storeDetail)
userRoute.get('/stores', hasStore, storeUpdate)

userRoute.get('/stores/products', hasStore, storeProductList)
userRoute.post('/stores/products', hasStore, storeProductCreate)
userRoute.get('/stores/products/:id', hasStore, storeProductDetail)
userRoute.put('/stores/products/:id', hasStore, storeProductUpdate)
userRoute.delete('/stores/products/:id', hasStore, storeProductDelete)

userRoute.get('/stores/transactions', hasStore, storeTransactionList)
userRoute.get('/stores/transactions/:id', hasStore, storeTransactionDetail)
userRoute.patch('/stores/transactions/:id/status', hasStore, storeTransactionStatusUpdate)

const adminRoute = new Hono<{ Variables: Variables }>();
adminRoute.use('/*', jwt({ secret: jwt_secret }))
adminRoute.use('/*', isAdmin)

adminRoute.get('/config', getSiteConfigAll);
adminRoute.post('/config', setSiteConfig);

adminRoute.get('/users', adminUserList)
adminRoute.get('/users/:id', adminUserDetail)
adminRoute.post('/users/:id/suspend', adminUserSuspendStatusUpdate)

adminRoute.get('/stores', adminStoreList)
adminRoute.get('/stores/:id', adminStoreDetail)

adminRoute.get('/products', adminProductList)
adminRoute.get('/products/:id', adminProductDetail)
adminRoute.patch('/products/:id', adminProductUpdate)

adminRoute.get('/transactions', adminTransactionList)
adminRoute.get('/transactions/:id', adminTransactionDetail)
adminRoute.patch('/transactions/:id/status', adminTransactionStatusUpdate)

adminRoute.get('/withdrawals', adminWithdrawalList)
adminRoute.post('/withdrawals/:id/action', adminWithdrawalApproveReject)

app.route('/user', userRoute)
app.route('/admin', adminRoute)

export default app;

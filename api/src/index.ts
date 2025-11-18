import { Hono } from 'hono'
import { jwt, type JwtVariables } from 'hono/jwt'
import { envCheck, getEnv } from './env.js';
import { authorize, refreshToken } from './controllers/auth.js';
import { profile, updatePin, updateProfile } from './controllers/user.js';
import { clearSiteConfigCache, getSiteConfig, getSiteConfigAll, setSiteConfig } from './controllers/config.js';
import { catalogueDetail, catalogueList } from './controllers/catalogue.js';
import { addToCart, cartList, checkout, removeFromCart } from './controllers/cart.js';
import { transactionDetail, transactionList, transactionStatusUpdate } from './controllers/transaction.js';
import { withdrawalCreate, withdrawalList } from './controllers/withdraw.js';
import { hasStore, initialConfig, isAdmin } from './utils/middleware.js';
import { storeCreate, storeDetail, storeList, storeUpdate } from './controllers/store.js';
import { storeProductCreate, storeProductToggle, storeProductDetail, storeProductList, storeProductUpdate } from './controllers/store-product.js';
import { adminStoreDetail, adminStoreList } from './controllers/admin/store.js';
import { adminWithdrawalApproveReject, adminWithdrawalList } from './controllers/admin/withdraw.js';
import { adminTransactionDetail, adminTransactionList, adminTransactionStatusUpdate } from './controllers/admin/transaction.js';
import { adminUserDetail, adminUserList, adminUserSuspendStatusUpdate } from './controllers/admin/user.js';
import { adminProductDetail, adminProductFeatured, adminProductList, adminProductToggle } from './controllers/admin/product.js';
import { cors } from 'hono/cors';
import { storeTransactionDetail, storeTransactionList, storeTransactionStatusUpdate } from './controllers/store-transaction.js';
import { webhookPakasir } from './controllers/webhook.js';
import { runMigration } from './db.js';

envCheck();
const jwt_secret = getEnv('JWT_SECRET', 'default_secret');

type Variables = JwtVariables
const app = new Hono<{ Variables: Variables }>().basePath('/api');
app.use('/*', cors({ origin: '*' }))

app.get('/config', getSiteConfig);
app.get('/config/clear', clearSiteConfigCache);
app.post('/config', initialConfig, setSiteConfig);
app.post('/authorize', authorize);
app.post('/refresh-token', jwt({ secret: jwt_secret }), refreshToken);
app.post('/webhooks/pakasir', webhookPakasir)

app.get('/catalogues', catalogueList)
app.get('/catalogues/:sku', catalogueDetail)
app.get('/stores', storeList)
app.get('/stores/:id', storeDetail)

const userRoute = new Hono<{ Variables: Variables }>();
userRoute.use('/*', jwt({ secret: jwt_secret }))

userRoute.get('/profile', profile);
userRoute.put('/profile', updateProfile);
userRoute.put('/pin', updatePin);

userRoute.get('/carts', cartList)
userRoute.post('/carts', addToCart)
userRoute.delete('/carts/:id', removeFromCart)
userRoute.post('/checkout', checkout)

userRoute.get('/transactions', transactionList)
userRoute.get('/transactions/:id', transactionDetail)
userRoute.patch('/transactions/:id/status', transactionStatusUpdate)

userRoute.get('/withdrawals', withdrawalList)
userRoute.post('/withdrawals', withdrawalCreate)

userRoute.post('/stores', storeCreate)
userRoute.get('/stores', hasStore, storeDetail)
userRoute.put('/stores', hasStore, storeUpdate)

userRoute.get('/stores/products', hasStore, storeProductList)
userRoute.post('/stores/products', hasStore, storeProductCreate)
userRoute.get('/stores/products/:id', hasStore, storeProductDetail)
userRoute.put('/stores/products/:id', hasStore, storeProductUpdate)
userRoute.post('/stores/products/:id/toggle', hasStore, storeProductToggle)

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
adminRoute.post('/products/:id/toggle', adminProductToggle)
adminRoute.post('/products/:id/featured', adminProductFeatured)

adminRoute.get('/transactions', adminTransactionList)
adminRoute.get('/transactions/:id', adminTransactionDetail)
adminRoute.patch('/transactions/:id/status', adminTransactionStatusUpdate)

adminRoute.get('/withdrawals', adminWithdrawalList)
adminRoute.patch('/withdrawals/:id/status', adminWithdrawalApproveReject)

app.route('/user', userRoute)
app.route('/admin', adminRoute)

await runMigration();

export default app;

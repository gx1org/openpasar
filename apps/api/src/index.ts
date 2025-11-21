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
import { adminStoreCreate, adminStoreDetail, adminStoreList, adminStoreUpdate } from './controllers/admin/store.js';
import { adminWithdrawalApproveReject, adminWithdrawalList } from './controllers/admin/withdraw.js';
import { adminTransactionDetail, adminTransactionList, adminTransactionStatusUpdate } from './controllers/admin/transaction.js';
import { adminUserDetail, adminUserList, adminUserResetPin, adminUserSuspendStatusUpdate } from './controllers/admin/user.js';
import { adminProductDetail, adminProductFeatured, adminProductList, adminProductToggle, adminProductUpdate } from './controllers/admin/product.js';
import { cors } from 'hono/cors';
import { storeTransactionDetail, storeTransactionList, storeTransactionStatusUpdate } from './controllers/store-transaction.js';
import { webhookPakasir } from './controllers/webhook.js';
import { runAutomation } from './controllers/automation.js';
import { healthCheck } from './controllers/index.js';

envCheck();
const jwt_secret = getEnv('JWT_SECRET', 'default_secret');

type Variables = JwtVariables
const app = new Hono<{ Variables: Variables }>();
app.use('/*', cors({ origin: '*' }))
app.get('/', healthCheck)

const api = new Hono<{ Variables: Variables }>();

api.get('/config', getSiteConfig);
api.get('/config/clear', clearSiteConfigCache);
api.post('/config', initialConfig, setSiteConfig);
api.post('/authorize', authorize);
api.post('/refresh-token', jwt({ secret: jwt_secret }), refreshToken);
api.post('/webhooks/pakasir', webhookPakasir)
api.get('/automate', runAutomation)

api.get('/catalogues', catalogueList)
api.get('/catalogues/:sku', catalogueDetail)
api.get('/stores', storeList)
api.get('/stores/:id', storeDetail)

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
adminRoute.patch('/users/:id/pin', adminUserResetPin)

adminRoute.get('/stores', adminStoreList)
adminRoute.get('/stores/:id', adminStoreDetail)
adminRoute.post('/stores', adminStoreCreate)
adminRoute.put('/stores/:id', adminStoreUpdate)

adminRoute.get('/products', adminProductList)
adminRoute.get('/products/:id', adminProductDetail)
adminRoute.post('/products/:id/toggle', adminProductToggle)
adminRoute.post('/products/:id/featured', adminProductFeatured)
adminRoute.put('/products/:id', adminProductUpdate)

adminRoute.get('/transactions', adminTransactionList)
adminRoute.get('/transactions/:id', adminTransactionDetail)
adminRoute.patch('/transactions/:id/status', adminTransactionStatusUpdate)

adminRoute.get('/withdrawals', adminWithdrawalList)
adminRoute.patch('/withdrawals/:id/status', adminWithdrawalApproveReject)

app.route('/api', api)
app.route('/api/user', userRoute)
app.route('/api/admin', adminRoute)

export default app;

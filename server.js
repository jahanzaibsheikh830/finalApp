var express = require("express");
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var cors = require("cors");
var morgan = require("morgan");
var { foodUserModel, foodOrderModel, foodProductModel } = require('./dbconn/module')
var path = require("path")
var SERVER_SECRET = process.env.SECRET || "1234";
var jwt = require('jsonwebtoken')
var app = express()
var authRoutes = require('./routes/auth')
const fs = require('fs')
const admin = require("firebase-admin");
const multer = require('multer')

const storage = multer.diskStorage({ // https://www.npmjs.com/package/multer#diskstorage
    destination: './uploads/',
    filename: function (req, file, cb) {
        cb(null, `${new Date().getTime()}-${file.filename}.${file.mimetype.split("/")[1]}`)
    }
})

var upload = multer({ storage: storage })

var SERVICE_ACCOUNT = {
    "type": "service_account",
    "project_id": "twitter-profile-pics",
    "private_key_id": "e99858c63c3db8d89e6523ae14b648c6bffd9011",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDIXPS9qALcnAFb\nUW273yLKacncOJYSa9opG0OVe9O9GXfVoSGkLl1KOMWRaUCpigwrQID3AI0X1CSV\n6o6dxWQIIzsdAUXf2ilhkQ+03z902sT5mCXLkSFooyBNSjR9rL2k+N5KeJgN2V6r\nat78kd+v3UKAPCF0+Wp69u3514XvWslabi+Bk/fr05IuuwSi2Q2eU4SFsvSZHhb6\no3Bp/5VIcbVIIO3Z5pTS0B1nsyU5CqCrSLardlXWAaLHNiIcZVCEnlx2IV3bnyTS\nrsIjddC3K6KLRLam4lWRAWdteHhbxcfnsz+153eUa+72phRte0nx1zFLG9gNgCgs\na+UeZdBJAgMBAAECggEAF2kPtNPbTGjImnbahMepik+Z+lUnk7duTLyWxPHW55Kr\njGvAloJO/CEYqcjLzq4Ghfc0xPzCKjVAoROViPGgongbVrmTWc26ZV/29IHb1Dd2\nKa478Zu0ykO6aSLGcfirn97uz3IPshk3v9JDg5c3tOtRSH0TcQDDZDf9zjdUZYbX\npc2NgFYZEOV1rxMnq+oGdaBh1UOut6nfBclsV1JGm6w1IZqFcDrnOB8DuS9m4aHf\nxNCcaaLZQ/9VraRhsxw3/Jn9/5zQHCG8UiNXv1J3t24BkWMT7/md8QKbwDZhxZcY\nlJbsZkaouFEXTVcEHsNePZgMUEfiZf2vO/HkzNAAUQKBgQDyn1oMUzaLHKKjuGks\ncVZBaZZAhbl7n0bJ/QAran4M3pQuhdG38N4S3IOaoUA/wTiOwEi1skA7xmQJtv8R\nvKpamYWDgKEoNU8WlSU6DCzuqEortXH3ASrZiPpVu9adivDron4whIxIoKqRcuiv\nnEJ1aWKJKiNZVyC1opAf+ocY4wKBgQDTaRua2V80rVzXfNgmO4dD3BJhGPm9mau/\n1HqtxXg9umjBRXaxP8+xESXpyJ4iAyPR814bdzUz0ecAzbpcv+fg/Bp/wNoKHKUX\nbWDnhzrrFpRQecCP2VQPfXeNsvzEnioEZjXIuPzk5q24UuVrOKfKeKTS//pSeZGC\niAmokMl14wKBgQDthWFjlYddMwBp5VxZXO9DhHnK2t9WDf0AO4YR+uRB9xj8XpeM\nSustbeIM3HYItEGJRucnscS+gB9pf1RAagIgRhF2RtP+iAnQItzZ8hd+4RQTrENQ\nvDzV0Aq7KfQWMXJgTKjbGLg5VckGMYdofEJ3rV8Ax1bp3KkyCF6uX9YoXwKBgQCY\nad6M9Mm+oH2enVL3vVL3iWF2vxrNpkw8MGOBhCv71LhRHlND1k1VypcaxJe8zaa1\nZk8iXf7tLRbtbWQ+GdyCRz6Te+W2BJDBIwoJ4WSIt+6VVjGNg5Em2b2nWrMAzUZd\nhZKg8zzfia8UhC8B7gaJ4hByTjmZ3CsbgBf2fuu/IQKBgQDete8Ij/1QnHRN7U3i\np735JUv5d0/YG93y8l4QtwB6xBBS2vXZLOCH/39v0KZeXaJyzMmfXrUFL6SG8w3Q\nZVc0uaMi7Ebs9rVl5eKjhKrc0sNXCPJXbMfYAeHQpuVnCaF6IKslTx5bL/sTQmEq\nXbhKEaA61d4lG5PRgn/o1T+I0Q==\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-nrq5c@twitter-profile-pics.iam.gserviceaccount.com",
    "client_id": "110265852152524228238",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-nrq5c%40twitter-profile-pics.iam.gserviceaccount.com"
}

admin.initializeApp({
    credential: admin.credential.cert(SERVICE_ACCOUNT),
    databaseURL: "c1085f89-3538-4e2d-8751-faf7125765e6"
});
const bucket = admin.storage().bucket("gs://twitter-profile-pics.appspot.com");

app.use(bodyParser.json());
app.use(cookieParser());

app.use(cors({
    origin: ['http://localhost:3000', "https://login-system-jahan.herokuapp.com/"],
    credentials: true
}));
app.use(morgan('dev'));
app.use("/", express.static(path.resolve(path.join(__dirname, "./web/build"))));

app.use('/', authRoutes);
app.use(function (req, res, next) {
    console.log(req.cookies.jToken)
    if (!req.cookies.jToken) {
        res.status(401).send("include http-only credentials with every request")
        return;
    }
    jwt.verify(req.cookies.jToken, SERVER_SECRET, function (err, decodedData) {
        if (!err) {

            const issueDate = decodedData.iat * 1000;
            const nowDate = new Date().getTime();
            const diff = nowDate - issueDate;

            if (diff > 300000) {
                res.status(401).send("token expired")
            } else {
                var token = jwt.sign({
                    id: decodedData.id,
                    name: decodedData.name,
                    email: decodedData.email,
                    role: decodedData.role
                }, SERVER_SECRET)
                res.cookie('jToken', token, {
                    maxAge: 86400000,
                    httpOnly: true
                });
                req.body.jToken = decodedData
                req.headers.jToken = decodedData
                next();
            }
        } else {
            res.status(401).send("invalid token")
        }
    });
})

app.get("/profile", (req, res, next) => {

    console.log(req.body)

    foodUserModel.findById(req.body.jToken.id, 'name email phone role createdOn',
        function (err, doc) {
            console.log("doc", doc)
            if (!err) {
                res.send({
                    status: 200,
                    profile: doc
                })

            } else {
                res.status(500).send({
                    message: "server error"
                })
            }
        })
})
app.post("/addProduct", upload.any(), (req, res, next) => {

    console.log("req.body: ", req.body);
    bucket.upload(
        req.files[0].path,
        function (err, file, apiResponse) {
            if (!err) {
                file.getSignedUrl({
                    action: 'read',
                    expires: '03-09-2491'
                }).then((urlData, err) => {
                    if (!err) {
                        console.log("public downloadable url: ", urlData[0])
                        foodUserModel.findById(req.headers.jToken.id, 'email role', (err, user) => {
                            console.log("user =======>", user.email)
                            if (!err) {
                                foodProductModel.create({
                                    "name": req.body.productName,
                                    "price": req.body.price,
                                    "stock": req.body.stock,
                                    "image": urlData[0],
                                    "description": req.body.description
                                }).then((data) => {
                                    console.log(data)
                                    res.send({
                                        status: 200,
                                        message: "Product add successfully",
                                        data: data
                                    })
                                }).catch(() => {
                                    console.log(err);
                                    res.status(500).send({
                                        message: "user create error, " + err
                                    })
                                })
                            }
                            else {
                                res.send("err")
                            }
                        })
                        try {
                            fs.unlinkSync(req.files[0].path)
                        } catch (err) {
                            console.error(err)
                        }
                    }
                })
            } else {
                console.log("err: ", err)
                res.status(500).send();
            }
        });
})

app.post("/order", (req, res, next) => {
    console.log("fsfsf", req.body)
    if (!req.body.orders || !req.body.total) {

        res.status(403).send(`
            please send email and passwod in json body.
            e.g:
            {
                "orders": "order",
                "total": "12342",
            }`)
        return;
    }

    foodUserModel.findOne({ email: req.body.jToken.email }, (err, user) => {
        console.log("afafa", user)
        if (!err) {
            foodOrderModel.create({
                name: req.body.name,
                email: user.email,
                phone: req.body.phone,
                status: "In review",
                address: req.body.address,
                total: req.body.total,
                orders: req.body.orders
            }).then((data) => {
                res.send({
                    status: 200,
                    message: "Order have been submitted",
                    data: data
                })
            }).catch(() => {
                res.status(500).send({
                    message: "order submit error, " + err
                })
            })
        }
        else {
            console.log(err)
        }
    })
})

app.get('/getOrders', (req, res, next) => {
    foodOrderModel.find({}, (err, data) => {
        if (!err) {
            res.send({
                data: data
            })
        }
        else {
            res.send(err)
        }
    })
})
app.get('/myOrders', (req, res, next) => {
    foodUserModel.findOne({ email: req.body.jToken.email }, (err, user) => {
        if (user) {
            foodOrderModel.find({ email: req.body.jToken.email }, (err, data) => {
                if (data) {
                    res.send({
                        data: data
                    })
                }
                else {
                    res.send(err)
                }
            })
        } else {
            res.send(err)
        }
    })
})

app.post('/updateStatus', (req, res, next) => {
    foodOrderModel.findById({ _id: req.body.id }, (err, data) => {
        if (data) {
            data.updateOne({ status: req.body.status }, (err, update) => {
                if (update) {
                    res.send("Status update")
                }
                else {
                    res.send(err)
                }
            })
        }
        else {
            res.send(err)
        }
    })
})

app.post('/delProduct', (req, res, next) => {
    foodUserModel.findOne({ email: req.body.jToken.email }, (err, user) => {
        if (user) {
            foodProductModel.findOne({ _id: req.body.id }, (err, data) => {
                if (data) {
                    data.deleteOne({}, (err, del) => {
                        if (del) {
                            res.send({
                                status: 200,
                                message: "Deleted"
                            })
                        }
                        else {
                            res.send({
                                message: "somrething went wrong"
                            })
                        }
                    })
                } else {
                    res.send({
                        message: "somrething went wrong"
                    })
                }
            })
        } else {
            res.send(err)
        }
    })
})
app.post('/updateProduct', (req, res, next) => {
    console.log("dafdafa", req.body.id)
    foodUserModel.findOne({ email: req.body.jToken.email }, (err, user) => {
        if (user) {
            foodProductModel.findOne({_id: req.body.id},(err,data)=>{
                if (data) {
                    res.send({
                        status: 200,
                        data: data
                    })
                }
                else{
                    res.send({
                        message: "somrthing went wrong"
                    })
                }
            })
        } else {
            res.send(err)
        }
    })
})
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log("server is running on: ", PORT);
})

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const body_parser_1 = __importDefault(require("body-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const routers_1 = __importDefault(require("./routers"));
const user_db_1 = require("./data/user.db");
const database_1 = require("./data/database");
dotenv_1.default.config();
const port = process.env.PORT || 3001;
const app = (0, express_1.default)();
let sessionCookie = {
    secure: false,
};
let sess = {
    resave: true,
    saveUninitialized: true,
    secret: "secretKey",
    cookie: sessionCookie,
};
if (process.env.NODE_ENV === "production") {
    app.set("trust proxy", 1);
    sessionCookie.secure = true;
}
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use(body_parser_1.default.json());
app.use((_, res, next) => {
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,PATCH");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    next();
});
app.use((0, cors_1.default)({
    origin: process.env.CORS_HOSTS.split(","),
    methods: ["GET", "POST"],
}));
app.use((0, express_session_1.default)(sess));
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.use("/sso", routers_1.default);
app.listen(port, () => {
    console.log(`App listening on port: ${port}`);
    (0, database_1.initAllModels)();
    (0, user_db_1.insertUser)({
        username: "Huyen Pham",
        password: "123456",
        email: "huyenp@gmail.com",
        isActive: false,
        role: "developer",
    });
    // dbHelper.insertUser(
    //   "Huyen Pham DEV",
    //   "123456",
    //   "huyenp1@gmail.com",
    //   true,
    //   "developer"
    // );
});
exports.default = app;

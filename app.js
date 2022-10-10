require("dotenv").config();

const logger = require("morgan");
const express = require("express");
const errorHandler = require("errorhandler");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");

const app = express();
const path = require("path");
const port = 3000;

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride());
app.use(errorHandler());
app.use(express.static(path.join(__dirname, "public")));

const Prismic = require("@prismicio/client");
var PrismicDOM = require("prismic-dom");
const { log } = require("console");
const apiEndpoint = process.env.PRISMIC_ENDPOINT;

const initApi = (req) => {
  return Prismic.getApi(apiEndpoint, {
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
    req: req,
  });
};

const handleLinkResolver = (doc) => {
  console.log("log", doc);
  switch (doc.type) {
    case "product":
      return `/detail/${doc.uid}`;
    case "about":
      return `/about`;
    case "collections":
      return `/collections`;
    default:
      return `/`;
  }
};

var th_val = ["", "thousand", "million", "billion", "trillion"];
var dg_val = [
  "zero",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
];
var tn_val = [
  "ten",
  "eleven",
  "twelve",
  "thirteen",
  "fourteen",
  "fifteen",
  "sixteen",
  "seventeen",
  "eighteen",
  "nineteen",
];
var tw_val = [
  "twenty",
  "thirty",
  "forty",
  "fifty",
  "sixty",
  "seventy",
  "eighty",
  "ninety",
];
function numberToWord(s) {
  s = s.toString();
  s = s.replace(/[\, ]/g, "");
  if (s != parseFloat(s)) return "not a number ";
  var x_val = s.indexOf(".");
  if (x_val == -1) x_val = s.length;
  if (x_val > 15) return "too big";
  var n_val = s.split("");
  var str_val = "";
  var sk_val = 0;
  for (var i = 0; i < x_val; i++) {
    if ((x_val - i) % 3 == 2) {
      if (n_val[i] == "1") {
        str_val += tn_val[Number(n_val[i + 1])] + " ";
        i++;
        sk_val = 1;
      } else if (n_val[i] != 0) {
        str_val += tw_val[n_val[i] - 2] + " ";
        sk_val = 1;
      }
    } else if (n_val[i] != 0) {
      str_val += dg_val[n_val[i]] + " ";
      if ((x_val - i) % 3 == 0) str_val += "hundred ";
      sk_val = 1;
    }
    if ((x_val - i) % 3 == 1) {
      if (sk_val) str_val += th_val[(x_val - i - 1) / 3] + " ";
      sk_val = 0;
    }
  }
  if (x_val != s.length) {
    var y_val = s.length;
    str_val += "point ";
    for (var i = x_val + 1; i < y_val; i++) str_val += dg_val[n_val[i]] + " ";
  }
  return str_val.replace(/\s+/g, " ");
}

// Middleware to inject prismic context
app.use((req, res, next) => {
  res.locals.Link = handleLinkResolver;
  res.locals.numberToWord = numberToWord;
  res.locals.PrismicDOM = PrismicDOM;
  next();
});

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

const handleRequest = async (api) => {
  const metadata = await api.getSingle("metadata");
  const navigation = await api.getSingle("navigation");
  const preloader = await api.getSingle("preloader");

  return {
    metadata,
    navigation,
    preloader,
  };
};

app.get("/", async (req, res) => {
  const api = await initApi(req);
  const defaults = await handleRequest(api);
  const home = await api.getSingle("home");
  const { results: collections } = await api.query(
    Prismic.Predicates.at("document.type", "collection"),
    {
      fetchLinks: "product.image",
    }
  );

  console.log("home", home.data.gallery);

  res.render("pages/home", { ...defaults, collections, home });
});

app.get("/about", async (req, res) => {
  const api = await initApi(req);
  const defaults = await handleRequest(api);
  const about = await api.getSingle("about");

  res.render("pages/about", { about, ...defaults });
});

app.get("/detail/:uid", async (req, res) => {
  const api = await initApi(req);
  const defaults = await handleRequest(api);
  const product = await api.getByUID("product", req.params.uid, {
    fetchLinks: "collection.title",
  });

  res.render("pages/detail", { ...defaults, product });
});

app.get("/collections", async (req, res) => {
  const api = await initApi(req);
  const defaults = await handleRequest(api);
  const home = await api.getSingle("home");
  const { results: collections } = await api.query(
    Prismic.Predicates.at("document.type", "collection"),
    {
      fetchLinks: "product.image",
    }
  );

  res.render("pages/collections", { ...defaults, collections, home });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

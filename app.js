require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const port = 3000;

const Prismic = require("@prismicio/client");
const PrismicDOM = require("prismic-dom");

const initApi = (req) => {
  return Prismic.getApi(process.env.PRISMIC_ENDPOINT, {
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
    req: req,
  });
};

const handleLinkResolver = (doc) => {
  // switch (doc.type) {
  //   case "product":
  //     return `/detail/${doc.uid}`;
  //   case "about":
  //     return `/about`;
  //   case "collections":
  //     return `/collections`;
  //   default:
  //     return `/`;
  // }
  return "/";
};

app.use((req, res, next) => {
  res.locals.ctx = {
    endpoint: process.env.PRISMIC_ENDPOINT,
    linkResolver: handleLinkResolver,
  };
  res.locals.PrismicDOM = PrismicDOM;
  next();
});

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.get("/", (req, res) => {
  res.render("pages/home");
});

app.get("/about", (req, res) => {
  initApi(req).then((api) => {
    api
      .query(Prismic.Predicates.any("document.type", ["about", "meta"]))
      .then((response) => {
        const { results } = response;
        const [about, meta] = results;
        console.log("res", about.data?.items);
        about.data.body.forEach((item) => {
          console.log("item", item.items);
        });
        res.render("pages/about", {
          about,
          meta,
        });
      })
      .catch((err) => {
        new Error("err", err);
      });
  });
});

app.get("/detail/:uid", (req, res) => {
  res.render("pages/detail");
});

app.get("/collections", (req, res) => {
  res.render("pages/collections");
});

app.listen(port, () => {
  console.log(`server listening on ${port}`);
});

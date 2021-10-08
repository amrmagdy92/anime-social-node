require('dotenv').config();
const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const webpackConfig = require('../webpack.config.client');

const compile = (app) => {
    if (process.env.NODE_ENV == "development") {
        const compiler = webpack(webpackConfig);
        const middleware = webpackMiddleware(compiler,{
            publicPath: webpackConfig.output.path
        });
        app.use(middleware);
        app.use(webpackHotMiddleware(compiler));
    }
};

export default {
    compile
}
class DeleteCssJs {
    apply(compiler) {
        compiler.hooks.emit.tapAsync(this.constructor.name, (compilation, callback) => {
            compilation.getAssets().forEach((asset) => {
                const pathname = asset.name;
                if(pathname.includes('cssJsDist')){
                    delete compilation.assets[asset.name];
                }
            })
            callback()
        })
    }
}
module.exports = DeleteCssJs;

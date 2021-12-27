// Use a very simplified package normalization.
// As stylelint doesn't use most of it.
module.exports = function(pkg) {
    pkg.name = pkg.name ? pkg.name.trim() : "";
    
    if (!pkg.version) {
        pkg.version = "";
    }

    if (typeof pkg.bin == "string") {
        const bin = pkg.bin;
        pkg.bin = {
            [pkg.name]: bin
        }
    }
}

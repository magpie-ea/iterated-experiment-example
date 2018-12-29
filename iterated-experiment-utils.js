/* Helper functions */
/* For generating random colors */
// From Dawkins' code.
const iteratedExperimentUtils = {
    // generateId :: Integer -> String
    generateId: function(len) {
        var arr = new Uint8Array((len || 40) / 2);
        window.crypto.getRandomValues(arr);
        return Array.from(arr, this.dec2hex).join("");
    }
};

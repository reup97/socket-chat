const path = require('path');
const mime = require('mime');
const fs = require('fs');

function static_files(url, dir) {
    return function (req, res, next) {
        let rpath = req.path;

        if (rpath.startsWith(url)) {
            let fp = path.join(dir, rpath.substring(url.length));
            console.log('dir:', fp);
            if (fs.existsSync(fp)) {
                res.type = mime.lookup(rpath);
                // console.log('res.type', res.type);
                res.sendFile(fp);
            } else {
                res.status = 404;
            }
        } else {
            next();
        }
    }
}

module.exports = static_files;
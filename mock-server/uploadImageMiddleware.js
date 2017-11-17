const fs = require('fs');
const path = require('path');

const removeBase64Header = base64String => base64String.split(';base64,').pop();
const checkExistParamImage = (req, paramName) => {
  const image = req.body[paramName];
  if (
    image &&
    Object.prototype.hasOwnProperty.call(image, 'uri') &&
    image.uri.indexOf(';base64') > -1
  ) {
    return true;
  }
  return false;
};
const imageSave = (req, paramName, relativePaht) => {
  const image = req.body[paramName];
  const { id } = req.body;

  const base64Image = removeBase64Header(image.uri);
  const imageName = `${id}-${image.name}`;
  const imagePath = path.join(__dirname, `public/${relativePaht}/${imageName}`);
  const imageUri = `${req.protocol}://${req.headers.host}/${relativePaht}/${imageName}`;

  fs.writeFile(imagePath, base64Image, { encoding: 'base64' }, (err) => {
    if (err) {
      console.log('uploadImageMIddlware. Error while recording image: ', err);
    }
  });

  req.body[paramName].uri = imageUri;
};

module.exports = (req, res, next) => {
  if (req.method === 'PUT' || req.method === 'POST') {
    if (checkExistParamImage(req, 'image')) {
      imageSave(req, 'image', 'images/segments');
    }

    if (checkExistParamImage(req, 'logo')) {
      imageSave(req, 'logo', 'images/partners/logos');
    }
    // res.status(422).jsonp({
    //   error: 'The uri attribute of the image object must be encoded in base64',
    // });
  }

  next();
};
